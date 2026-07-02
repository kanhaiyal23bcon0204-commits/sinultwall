import { Outlet, useLocation } from "react-router";
import { motion } from "motion/react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function PublicLayout() {
  const location = useLocation();
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1" key={location.pathname}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
