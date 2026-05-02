import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Menu from "./pages/Menu.tsx";
import NotFound from "./pages/NotFound.tsx";
import { AppProviders } from "@/contexts/AppProviders";
import { CustomCursor } from "@/components/CustomCursor";
import { Loader } from "@/components/Loader";

const queryClient = new QueryClient();

function AnimatedRoutes() {
  const loc = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={loc} key={loc.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

function Shell() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(t);
  }, []);
  return (
    <>
      <Loader show={loading} />
      <CustomCursor />
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProviders>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Shell />
      </TooltipProvider>
    </AppProviders>
  </QueryClientProvider>
);

export default App;
