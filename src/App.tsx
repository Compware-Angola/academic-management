import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import GenericPage from "./pages/GenericPage";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import { menuStructure } from "./config/menuStructure";

import { ThemeProvider } from "./hooks/thme-provider";
import { MainLayout } from "./pages/App";

const queryClient = new QueryClient();

const App = () => {
  // Generate all routes from menu structure

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="uma-ui-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />

              <Route element={<MainLayout />}>
                <Route path="/" element={<Index />} />
                <Route path="/acessos/utilizador" element={<Index />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
