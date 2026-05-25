import { AuthContext } from "@/context/auth.context";
import {
  AuthResponse,
  getCurrentUserService,
} from "@/services/auth/login.service";
import { AuthStorage } from "@/util/auth-storage";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInactivityDetector } from "react-inactivity-detector";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useIsPublicRoute } from "./helpers/verify-public.routes";
import { useBlockMyCashRegister } from "@/hooks/financa/use-cash-register";

const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 min
const WARNING_TIME = 10 * 1000; // 10 s

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { mutate: lockMyCashRegister } = useBlockMyCashRegister();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isPublicRoute = useIsPublicRoute();
  const [token, setToken] = useState<string | null>(AuthStorage.getToken());

  const [openWarning, setOpenWarning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(
    Math.ceil(WARNING_TIME / 1000),
  );

  const logoutRef = useRef<() => void>(null!);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownStarted = useRef(false);
  const isCountingDown = useRef(false);
  const prevShowWarningRef = useRef(false);
  const isVisibleRef = useRef(true);

  localStorage.removeItem("auth.user");

  // ─── USER ─────────────────────────────────────────────
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["current-user", "GA"],
    queryFn: () => getCurrentUserService("GA"),
    enabled: !!token && !isPublicRoute,
  });

  useEffect(() => {
    if (!isLoading && isError) {
      AuthStorage.logout();
      setToken(null);
      queryClient.clear();
      navigate("/", { replace: true });
    }
  }, [isError, isLoading, navigate, queryClient]);

  // ─── LOGIN ────────────────────────────────────────────
  const login = useCallback(
    (payload: AuthResponse) => {
      AuthStorage.saveLogin(payload);
      setToken(payload.access_token);
      lockMyCashRegister();
      queryClient.invalidateQueries({ queryKey: ["current-user", "GA"] });
    },
    [queryClient],
  );

  // ─── LOGOUT ───────────────────────────────────────────
  const logout = useCallback(() => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }

    countdownStarted.current = false;
    isCountingDown.current = false;
    prevShowWarningRef.current = false;
    setOpenWarning(false);
    AuthStorage.logout();
    setToken(null);
    queryClient.clear();
    navigate("/", { replace: true });
  }, [navigate, queryClient]);

  logoutRef.current = logout;

  // ─── INACTIVITY DETECTOR ─────────────────────────────
  const { showWarning, handleContinue } = useInactivityDetector({
    timeout: INACTIVITY_TIMEOUT,
    warningTime: WARNING_TIME,
    enabled: !!token && isPublicRoute,
    onIdle: useCallback(() => {}, []),
    onContinue: useCallback(() => {}, []),
  });

  // ─── VISIBILITY CONTROL ───────────────────────────────
  useEffect(() => {
    const handleVisibility = () => {
      isVisibleRef.current = document.visibilityState === "visible";

      if (!isVisibleRef.current) {
        if (countdownRef.current) {
          clearInterval(countdownRef.current);
          countdownRef.current = null;
        }

        countdownStarted.current = false;
        isCountingDown.current = false;
        setOpenWarning(false);
      } else {
        handleContinue();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [handleContinue]);

  // ─── START COUNTDOWN ──────────────────────────────────
  useEffect(() => {
    if (!isVisibleRef.current) return;

    const justBecameTrue = showWarning && !prevShowWarningRef.current;

    prevShowWarningRef.current = showWarning;

    if (!justBecameTrue) return;
    if (countdownStarted.current || isCountingDown.current) return;

    countdownStarted.current = true;
    isCountingDown.current = true;

    const total = Math.ceil(WARNING_TIME / 1000);
    setSecondsLeft(total);
    setOpenWarning(true);

    let current = total;

    countdownRef.current = setInterval(() => {
      current -= 1;
      setSecondsLeft(current);

      if (current <= 0) {
        clearInterval(countdownRef.current!);
        countdownRef.current = null;

        countdownStarted.current = false;
        isCountingDown.current = false;

        logoutRef.current();
      }
    }, 1000);
  }, [showWarning]);

  // ─── CONTINUE SESSION ────────────────────────────────
  const handleContinueSession = useCallback(() => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }

    countdownStarted.current = false;
    isCountingDown.current = false;
    prevShowWarningRef.current = false;

    setSecondsLeft(Math.ceil(WARNING_TIME / 1000));
    setOpenWarning(false);

    handleContinue();
  }, [handleContinue]);

  // ─── RENDER ───────────────────────────────────────────
  return (
    <AuthContext.Provider
      value={{ user: user ?? null, token, isLoading, login, logout }}
    >
      {children}

      <Dialog open={openWarning} onOpenChange={() => {}}>
        <DialogContent
          className="max-w-md"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>⚠️ Sessão prestes a expirar</DialogTitle>
            <DialogDescription>
              Por inatividade, a sua sessão será encerrada automaticamente.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center gap-2 py-6">
            <span
              className={`text-7xl font-bold tabular-nums transition-colors duration-500 ${
                secondsLeft <= 2
                  ? "text-red-500 animate-pulse"
                  : secondsLeft <= 4
                    ? "text-orange-400"
                    : "text-yellow-500"
              }`}
            >
              {secondsLeft}
            </span>

            <span className="text-sm text-muted-foreground">
              segundo{secondsLeft !== 1 ? "s" : ""} para encerrar a sessão
            </span>
          </div>

          <DialogFooter className="mt-2 flex gap-2">
            <Button variant="outline" className="flex-1" onClick={logout}>
              Terminar sessão
            </Button>
            <Button className="flex-1" onClick={handleContinueSession}>
              Continuar sessão
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AuthContext.Provider>
  );
};
