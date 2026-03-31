import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getProgress, setProgress, getAllProgress, importAllProgress } from "@/lib/db";

async function getUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

export async function GET(request: NextRequest) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const key = request.nextUrl.searchParams.get("key");

  if (key === "__all__") {
    const data = await getAllProgress(userId);
    return NextResponse.json(data);
  }

  if (!key) {
    return NextResponse.json({ error: "Missing key" }, { status: 400 });
  }

  const value = await getProgress(userId, key);
  return NextResponse.json({ value });
}

export async function POST(request: NextRequest) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Bulk import
  if (body.action === "import") {
    if (typeof body.data !== "object" || body.data === null || Array.isArray(body.data)) {
      return NextResponse.json({ error: "Invalid import data" }, { status: 400 });
    }
    const count = await importAllProgress(userId, body.data);
    return NextResponse.json({ imported: count });
  }

  // Single key set
  if (typeof body.key === "string" && body.key && body.value !== undefined) {
    await setProgress(userId, body.key, body.value);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}
