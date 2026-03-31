"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef, ReactNode } from "react";
import { setStorageBackend } from "./storage";

interface StorageContextType {
  loaded: boolean;
  exportAll: () => Promise<string>;
  importAll: (json: string) => Promise<{ imported: number; error?: string }>;
}

const StorageContext = createContext<StorageContextType>({
  loaded: false,
  exportAll: async () => "{}",
  importAll: async () => ({ imported: 0 }),
});

export function useStorageContext() {
  return useContext(StorageContext);
}

export function StorageProvider({ children }: { children: ReactNode }) {
  const cache = useRef<Record<string, unknown>>({});
  const [loaded, setLoaded] = useState(false);

  // Register the storage backend on mount
  useEffect(() => {
    const get = <T,>(key: string, fallback: T): T => {
      if (key in cache.current) {
        const val = cache.current[key];
        if (typeof fallback === "object" && fallback !== null && !Array.isArray(fallback) && typeof val === "object" && val !== null) {
          return { ...fallback, ...(val as Record<string, unknown>) } as T;
        }
        return val as T;
      }
      return fallback;
    };

    const set = (key: string, value: unknown) => {
      cache.current[key] = value;
      fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      }).catch(() => {});
    };

    setStorageBackend(get, set);

    // Load all progress from API
    fetch("/api/progress?key=__all__")
      .then((r) => {
        if (!r.ok) throw new Error("API error");
        return r.json();
      })
      .then(async (data: Record<string, unknown>) => {
        cache.current = { ...data, ...cache.current };

        // One-time migration from localStorage
        if (typeof window !== "undefined" && !localStorage.getItem("nihongo_migrated")) {
          const legacy: Record<string, unknown> = {};
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith("nihongo_") && key !== "nihongo_migrated") {
              const raw = localStorage.getItem(key);
              if (raw) {
                const storageKey = key.replace("nihongo_", "");
                if (!(storageKey in cache.current)) {
                  try { legacy[storageKey] = JSON.parse(raw); } catch { legacy[storageKey] = raw; }
                }
              }
            }
          }
          if (Object.keys(legacy).length > 0) {
            // Upload legacy data to server
            for (const [k, v] of Object.entries(legacy)) {
              cache.current[k] = v;
              set(k, v);
            }
          }
          localStorage.setItem("nihongo_migrated", "true");
        }

        setLoaded(true);
      })
      .catch(() => {
        setLoaded(true);
      });
  }, []);

  const exportAll = useCallback(async (): Promise<string> => {
    try {
      const r = await fetch("/api/progress?key=__all__");
      if (!r.ok) return JSON.stringify({}, null, 2);
      const data = await r.json();
      return JSON.stringify(data, null, 2);
    } catch {
      return JSON.stringify({}, null, 2);
    }
  }, []);

  const importAll = useCallback(async (json: string): Promise<{ imported: number; error?: string }> => {
    try {
      const data = JSON.parse(json);
      if (typeof data !== "object" || data === null || Array.isArray(data)) {
        return { imported: 0, error: "Invalid format" };
      }
      const r = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "import", data }),
      });
      if (!r.ok) return { imported: 0, error: "Import failed" };
      const result = await r.json();
      // Refresh cache
      const fresh = await fetch("/api/progress?key=__all__");
      if (fresh.ok) {
        cache.current = await fresh.json();
      }
      return { imported: result.imported ?? 0 };
    } catch {
      return { imported: 0, error: "Invalid JSON" };
    }
  }, []);

  return (
    <StorageContext.Provider value={{ loaded, exportAll, importAll }}>
      {children}
    </StorageContext.Provider>
  );
}
