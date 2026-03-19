import { LogOut, Search, User, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeSwitcher } from "../theme-switcher";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import { useMutationLogout } from "@/hooks/mutations/use-mutation-login";

import { useState, useEffect } from "react";
import { StudentSugestao } from "@/services/students/students.service";
import { useStudentSugestoes } from "@/hooks/tudents/use-query-students";

// ─── Tipagem de notificação ────────────────────────────────────────────────
interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

// ─── Mock de notificações — substituir pelo teu hook/query real ────────────
const mockNotifications: Notification[] = [
  {
    id: 1,
    title: "Nova mensagem",
    message: "O aluno João Silva enviou uma mensagem.",
    time: "há 2 min",
    read: false,
  },
  {
    id: 2,
    title: "Matrícula aprovada",
    message: "A matrícula de Ana Costa foi aprovada.",
    time: "há 15 min",
    read: false,
  },
  {
    id: 3,
    title: "Documento pendente",
    message: "Existe 1 documento à espera de revisão.",
    time: "há 1 h",
    read: false,
  },
  {
    id: 4,
    title: "Relatório gerado",
    message: "O relatório mensal está pronto.",
    time: "ontem",
    read: true,
  },
];

export function Header() {
  const { logout, user } = useAuth();
  const { mutate: logoutUser } = useMutationLogout();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // ─── Notificações ────────────────────────────────────────────────────────
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const markAsRead = (id: number) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  /** ---------------------------
   * DEBOUNCE (700ms)
   * --------------------------- */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 700);
    return () => clearTimeout(timer);
  }, [search]);

  /** ---------------------------
   * QUERY (usa debounce)
   * --------------------------- */
  const {
    data: sugestoes = [],
    isLoading,
    isFetching,
  } = useStudentSugestoes(debouncedSearch);

  /** ---------------------------
   * CONTROLAR POPOVER
   * --------------------------- */
  useEffect(() => {
    if (debouncedSearch.length > 0) setOpen(true);
    else setOpen(false);
  }, [debouncedSearch]);

  const handleSelect = (aluno: StudentSugestao) => {
    setSearch("");
    setDebouncedSearch("");
    setOpen(false);
    navigate(`/estudante/${aluno.codigo_matricula}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-4 md:px-6">
        <SidebarTrigger className="-ml-1" />

        <div className="ml-auto flex items-center gap-2 md:gap-4">
          {/* ── Pesquisa com debounce ─────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-2 w-full max-w-md">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <div className="relative w-full">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Pesquisar aluno (matrícula, BI, nome...)"
                    className="pl-9 w-full"
                    value={search}
                    onChange={handleInputChange}
                    onFocus={() => {
                      if (debouncedSearch) setOpen(true);
                    }}
                  />
                </div>
              </PopoverTrigger>

              <PopoverContent
                className="p-0 w-full max-h-80 overflow-hidden"
                align="start"
                sideOffset={4}
              >
                <Command shouldFilter={false} className="overflow-hidden">
                  <CommandList className="max-h-[300px] overflow-auto">
                    {(isLoading || isFetching) && (
                      <div className="py-6 text-center text-sm text-muted-foreground">
                        A pesquisar...
                      </div>
                    )}

                    {!isLoading &&
                      !isFetching &&
                      sugestoes.length === 0 &&
                      debouncedSearch && (
                        <CommandEmpty>
                          Nenhum aluno encontrado para "{debouncedSearch}"
                        </CommandEmpty>
                      )}

                    <CommandGroup className="p-1">
                      {sugestoes.map((aluno) => (
                        <CommandItem
                          key={aluno.codigo_matricula}
                          value={String(aluno.codigo_matricula)}
                          onSelect={() => handleSelect(aluno)}
                          className="cursor-pointer px-3 py-2 hover:bg-accent"
                        >
                          <div className="flex flex-col gap-0.5">
                            <span className="font-medium leading-tight">
                              {aluno.nome_completo}
                            </span>
                            <div className="text-xs text-muted-foreground flex flex-wrap gap-x-2">
                              <span>{aluno.codigo_matricula}</span>
                              <span>•</span>
                              <span>{aluno.bi}</span>
                              <span>•</span>
                              <span className="truncate max-w-[140px]">
                                {aluno.curso}
                              </span>
                            </div>
                            <span className="text-xs italic text-muted-foreground/80">
                              {aluno.periodo} — {aluno.estado}
                            </span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <ThemeSwitcher />

          {/* ── Sino de notificações ──────────────────────────────────── */}
          <DropdownMenu>
            <DropdownMenuTrigger >
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 min-w-5 rounded-full px-1 text-[10px] font-bold flex items-center justify-center"
                  >
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-80">
              <div className="flex items-center justify-between px-3 py-2">
                <DropdownMenuLabel className="p-0 text-sm font-semibold">
                  Notificações

                </DropdownMenuLabel>

              </div>
              <DropdownMenuSeparator />

              {notifications.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  Sem notificações
                </div>
              ) : (
                <div className="max-h-72 overflow-y-auto">
                  {notifications.map((notif) => (
                    <DropdownMenuItem
                      key={notif.id}
                      className="flex flex-col items-start gap-0.5 px-3 py-2.5 cursor-default focus:bg-accent"
                    >
                      <div className="flex w-full items-center justify-between gap-2">
                        <span className="text-sm font-medium leading-tight text-foreground">
                          {notif.title}
                        </span>

                        <span className="text-[10px] text-muted-foreground">
                          {notif.time}
                        </span>
                      </div>

                      <span className="text-xs text-muted-foreground leading-snug">
                        {notif.message}
                      </span>
                    </DropdownMenuItem>
                  ))}
                </div>
              )}

              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="justify-center text-xs text-primary cursor-pointer"
                onSelect={() => navigate("/notificacoes")}
              >
                Ver todas as notificações
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* ── Menu do utilizador ────────────────────────────────────── */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" className="gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt="Utilizador" />
                  <AvatarFallback>
                    {user?.user?.nome?.slice(0, 2).toUpperCase() || "AD"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start text-sm">
                  <span className="font-medium">
                    {user?.user?.nome || "N/A"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {user?.user?.email || "N/A"}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => navigate("/profile")}>
                <User className="mr-2 h-4 w-4" />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  logoutUser({ platform: "GA" });
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}