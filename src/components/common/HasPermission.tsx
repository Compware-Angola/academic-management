import { usePermission } from "@/auth/permission.helper";
import { ReactNode } from "react";

interface HasPermissionProps {
  permission: string;
  children: ReactNode;
  blockFullAccess?: boolean;
}

export const HasPermission = ({
  permission,
  children,
  blockFullAccess = false,
}: HasPermissionProps) => {
  const { hasPermission } = usePermission();
  return (
    <>
      {hasPermission(permission, {
        blockFullAccess,
      }) && children}
    </>
  );
};
