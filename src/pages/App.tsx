import { AppSidebar } from "@/components/layout/app-sidebar";
import { Header } from "@/components/layout/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { Navigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Loader } from "@/components/auth/loader";

export function MainLayout() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <Loader />;
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
