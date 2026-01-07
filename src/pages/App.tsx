

import { AppSidebar } from "@/components/layout/app-sidebar";
import { Header } from "@/components/layout/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { Navigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react"; 

export function MainLayout() {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-medium text-muted-foreground">
            Verificando autenticação...
          </p>
        </div>
      </div>
    );
  }


  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

 
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className="my-20 mx-auto max-w-7xl w-full px-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}