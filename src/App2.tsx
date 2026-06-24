import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./hooks/thme-provider";
import { MainLayout } from "./pages/App";
import UnderConstruction from "./pages/UnderConstruction";
import { ReactQueryProvider } from "./providers/react-query.provider";
import { AuthProvider } from "./providers/auth.provider";
import Index from "./pages/dasboard/Index";

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="uma-ui-theme">
      <BrowserRouter>
        <ReactQueryProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner position="top-center" closeButton richColors />
              <Routes>
                <Route element={<MainLayout />}>
                  <Route path="/dashboard" element={<Index />} />
                  <Route
                    path="*"
                    element={<UnderConstruction />}
                  />
                </Route>
              </Routes>
            </TooltipProvider>
          </AuthProvider>
        </ReactQueryProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;


