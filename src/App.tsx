import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import Index from "./pages/Index";
import GenericPage from "./pages/GenericPage";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import { menuStructure } from "./config/menuStructure";

const queryClient = new QueryClient();

const App = () => {
  // Generate all routes from menu structure
  const generateRoutes = () => {
    const routes: JSX.Element[] = [];
    
    menuStructure.forEach((item) => {
      if (item.children) {
        item.children.forEach((child) => {
          if (child.path) {
            routes.push(
              <Route
                key={child.path}
                path={child.path}
                element={<GenericPage />}
              />
            );
          }
        });
      } else if (item.path) {
        routes.push(
          <Route
            key={item.path}
            path={item.path}
            element={<GenericPage />}
          />
        );
      }
    });
    
    return routes;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<MainLayout />}>
              <Route path="/" element={<Index />} />
              {generateRoutes()}
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
