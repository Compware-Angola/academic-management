import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { menuStructure } from "@/config/menuStructure";

export function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const getBreadcrumbTitle = (path: string) => {
    for (const item of menuStructure) {
      if (item.children) {
        const child = item.children.find((c) => c.path === `/${path}`);
        if (child) {
          return { parent: item.title, child: child.title };
        }
      }
    }
    return null;
  };

  if (pathnames.length === 0) {
    return null;
  }

  const fullPath = `/${pathnames.join("/")}`;
  const breadcrumb = getBreadcrumbTitle(fullPath);

  return (
    <nav className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
      <Link to="/" className="flex items-center gap-1 hover:text-foreground transition-colors">
        <Home className="h-4 w-4" />
        <span>Início</span>
      </Link>
      
      {breadcrumb && (
        <>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium">{breadcrumb.parent}</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{breadcrumb.child}</span>
        </>
      )}
    </nav>
  );
}
