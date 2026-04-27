import { useLocation } from "react-router-dom";

export const PUBLIC_ROUTES = [
    "/",
    "/primeiro-acesso",
    "/boas-vindas",
    "/auth/primeiro-acesso/redefinir",
];

export function useIsPublicRoute() {
    const location = useLocation();

    return PUBLIC_ROUTES.some((route) =>
        location.pathname.startsWith(route)
    );
}