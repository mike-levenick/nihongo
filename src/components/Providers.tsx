"use client";

import { SessionProvider } from "next-auth/react";
import { StorageProvider } from "@/lib/storage-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <StorageProvider>{children}</StorageProvider>
    </SessionProvider>
  );
}
