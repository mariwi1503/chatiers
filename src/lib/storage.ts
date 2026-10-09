import { databaseSchema } from "@/lib/schemas";
import { createSeed } from "@/lib/seed";
import type { Database } from "@/types";
export const STORAGE_KEY = "chatiers:database:v1";
export function readDatabase(): Database {
  if (typeof window === "undefined") return createSeed();
  let raw: string | null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    return createSeed();
  }
  if (!raw) return createSeed();
  try {
    const parsed = databaseSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : createSeed();
  } catch {
    return createSeed();
  }
}
export async function updateDatabase(update: (db: Database) => Database) {
  const next = update(readDatabase());
  const parsed = databaseSchema.parse(next);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  } catch {
    throw new Error(
      "Penyimpanan penuh atau tidak tersedia. Coba gunakan gambar lebih kecil.",
    );
  }
  return parsed;
}
