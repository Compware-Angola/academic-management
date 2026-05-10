import Lottie from "lottie-react";
import TimeLoader from "@/assets/timeloader.json";
export function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="flex justify-center items-center">
          <Lottie
            animationData={TimeLoader}
            loop={true}
            style={{ width: 200, height: 200 }}
          />
        </div>
        <p className="text-lg font-medium text-muted-foreground">
          Verificando autenticação...
        </p>
      </div>
    </div>
  );
}
