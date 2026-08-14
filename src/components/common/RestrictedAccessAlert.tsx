import {
    AlertCircle,
    AlertTriangle,
    ChevronLeft,
    ChevronRight,
    Edit,
    Eye,
    EyeOff,
    Lock,
    RefreshCw,

} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

export default function RestrictedAccessAlert({ section }: { section: string }) {
    return (
        <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle className="font-semibold">Acesso Restrito</AlertTitle>
            <AlertDescription className="mt-1 space-y-1">
                <p>
                    Esta secção destina-se exclusivamente a <strong>docentes</strong> e permite consultar{" "}
                    {section}.
                </p>
                <p>
                    A sua conta não está associada a um perfil de docente, pelo que não tem permissão para
                    visualizar estes dados.
                </p>
            </AlertDescription>
        </Alert>
    );
}