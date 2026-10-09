"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Check, CircleAlert } from "lucide-react";
import { databaseKey } from "@/lib/queries";
import { STORAGE_KEY } from "@/lib/storage";
import { Composer } from "@/features/feed/composer";
interface AppContextValue {
  openComposer: () => void;
  notify: (message: string, error?: boolean) => void;
}
const AppContext = createContext<AppContextValue | null>(null);
export function useApp() {
  const value = useContext(AppContext);
  if (!value) throw new Error("Missing AppProvider");
  return value;
}
export function AppProvider({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: false },
          mutations: { retry: false },
        },
      }),
  );
  const [composer, setComposer] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    error: boolean;
  } | null>(null);
  const notify = useCallback(
    (message: string, error = false) => setToast({ message, error }),
    [],
  );
  const closeComposer = useCallback(() => setComposer(false), []);
  useEffect(() => {
    document.documentElement.dataset.hydrated = "true";
  }, []);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    const sync = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY || e.key === null)
        void client.invalidateQueries({ queryKey: databaseKey });
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [client]);
  return (
    <QueryClientProvider client={client}>
      <AppContext.Provider
        value={{ openComposer: () => setComposer(true), notify }}
      >
        {children}
        {composer && <Composer onClose={closeComposer} />}
        {toast && (
          <div
            className={`toast ${toast.error ? "toast-error" : ""}`}
            role={toast.error ? "alert" : "status"}
          >
            {toast.error ? <CircleAlert size={18} /> : <Check size={18} />}
            {toast.message}
          </div>
        )}
      </AppContext.Provider>
    </QueryClientProvider>
  );
}
