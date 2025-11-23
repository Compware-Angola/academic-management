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
import UnderConstruction from "./pages/UnderConstruction";

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
              <Route path="/" element={<Login />} />

              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<Index />} />

                <Route path="/alunos/novo" element={<UnderConstruction />} />
               {/* <Route path="*" element={<NotFound />} />*/}
                 <Route path="*" element={<UnderConstruction />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
