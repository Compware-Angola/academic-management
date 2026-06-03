import { usePermission } from "@/auth/permission.helper";
import { ReactNode } from "react";

interface HasPermissionProps {
  permission: string;
  children: ReactNode;
}

export const HasPermission = ({ permission, children }: HasPermissionProps) => {
  const { hasPermission } = usePermission();
  return <>{hasPermission(permission) && children}</>;
};
