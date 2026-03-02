import { ReactNode, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { BottomNav } from "./BottomNav";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function AppLayout({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !user && location !== "/login") {
      setLocation("/login");
    } else if (!isLoading && user && location === "/login") {
      setLocation("/");
    }
  }, [user, isLoading, location, setLocation]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  const isAuthPage = location === "/login";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center w-full">
      <main className="w-full max-w-md min-h-screen bg-slate-50 relative shadow-2xl overflow-x-hidden flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={location}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`flex-1 flex flex-col w-full ${!isAuthPage ? 'pb-24' : ''}`}
          >
            {children}
          </motion.div>
        </AnimatePresence>
        
        {!isAuthPage && user && <BottomNav />}
      </main>
    </div>
  );
}
