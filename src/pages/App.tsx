import { AppSidebar } from "@/components/layout/app-sidebar";
import { Header } from "@/components/layout/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { Outlet, useNavigate } from "react-router-dom";
import { Loader } from "@/components/auth/loader";
import { useEffect } from "react";

export function MainLayout() {
  const navigate = useNavigate();
  const { isLoading, token, user } = useAuth();

  useEffect(() => {
    if (!token && !isLoading && !user) {
      navigate("/", { replace: true });
    }
  }, [token, navigate, isLoading, user]);

  if (isLoading) return <Loader />;
  if (isLoading) {
    return <Loader />;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className="my-20 mx-auto max-w-full w-full px-2 md:px-2 @container/main">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
