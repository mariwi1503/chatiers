"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSyncExternalStore } from "react";
import { readDatabase, updateDatabase } from "@/lib/storage";
import { createSeed } from "@/lib/seed";
import type { Database } from "@/types";
export const databaseKey = ["chatiers", "database"] as const;
const subscribeHydration = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;
const serverSeed = createSeed();
const selectSeed = () => serverSeed;
const selectDatabase = (db: Database) => db;
export function useDatabase() {
  const hydrated = useSyncExternalStore(
    subscribeHydration,
    clientSnapshot,
    serverSnapshot,
  );
  return useQuery({
    queryKey: databaseKey,
    queryFn: readDatabase,
    initialData: createSeed,
    enabled: hydrated,
    select: hydrated ? selectDatabase : selectSeed,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}
export function useDatabaseMutation() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: updateDatabase,
    onSuccess: (db: Database) => {
      client.setQueryData(databaseKey, db);
    },
  });
}
