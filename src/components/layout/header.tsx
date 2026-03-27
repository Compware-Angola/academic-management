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
import { toast } from "sonner";

import { useNavigate } from "react-router-dom";
import { useCurrentUser, useMutationLogout } from "@/hooks/mutations/use-mutation-login";

import { useState, useEffect, useRef } from "react";
import { StudentSugestao } from "@/services/students/students.service";
import { useStudentSugestoes } from "@/hooks/tudents/use-query-students";
import { useQueryAvisosPorGrupos } from "@/hooks/acess/use-query-avisos-por-grupo";


export function Header() {
  const { data: user } = useCurrentUser("GA");
  const { mutate: logoutUser } = useMutationLogout();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");



  // ─── Guarda os IDs dos avisos já vistos para detectar novos ──────────────
  const seenAvisoIds = useRef<Set<number>>(new Set());
  const isFirstLoad = useRef(true);

  const gruposAviso =
    user?.groups?.filter((group) => group.type_group === 1) ?? [];
  const grupoIds = gruposAviso.map((group) => group.codigo);

  const { data: avisosGrupo = [] } = useQueryAvisosPorGrupos({ grupoIds });

  const agora = new Date();
  const avisosValidos = avisosGrupo.filter((aviso) => {
    const ativo = aviso.STATUS === 1;
    const naoExpirado =
      !aviso.DATE_EXPIRACAO || new Date(aviso.DATE_EXPIRACAO) >= agora;
    return ativo && naoExpirado;
  });

  // ─── Detecta novos avisos e dispara toast + swing ─────────────────────────
  useEffect(() => {
    if (avisosValidos.length === 0) return;

    const novos = avisosValidos.filter(
      (aviso) => !seenAvisoIds.current.has(aviso.CODIGO)
    );

    // Na primeira carga, apenas regista os IDs sem toast
    if (isFirstLoad.current) {
      avisosValidos.forEach((aviso) => seenAvisoIds.current.add(aviso.CODIGO));
      isFirstLoad.current = false;
      return;
    }

    if (novos.length === 0) return;
    novos.forEach((aviso) => seenAvisoIds.current.add(aviso.CODIGO));
    if (novos.length <= 3) {
      toast.success("🔔 Recebeste um novo aviso", {
        position: "top-right",
      });
    } else {
      toast.success(`🔔 Recebeste ${novos.length} novos avisos`, {
        position: "top-right",
      });
    }
  }, [avisosValidos]);

  // ─── Debounce da pesquisa ─────────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 700);
    return () => clearTimeout(timer);
  }, [search]);

  const {
    data: sugestoes = [],
    isLoading,
    isFetching,
  } = useStudentSugestoes(debouncedSearch);

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

  return (
    <>


      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
        <div className="flex h-16 items-center gap-4 px-4 md:px-6">
          <SidebarTrigger className="-ml-1" />

          <div className="ml-auto flex items-center gap-2 md:gap-4">
            {/* ── Pesquisa ──────────────────────────────────────────────── */}
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
                      onChange={(e) => setSearch(e.target.value)}
                      onFocus={() => { if (debouncedSearch) setOpen(true); }}
                    />
                  </div>
                </PopoverTrigger>

                <PopoverContent className="p-0 w-full max-h-80 overflow-hidden" align="start" sideOffset={4}>
                  <Command shouldFilter={false} className="overflow-hidden">
                    <CommandList className="max-h-[300px] overflow-auto">
                      {(isLoading || isFetching) && (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                          A pesquisar...
                        </div>
                      )}
                      {!isLoading && !isFetching && sugestoes.length === 0 && debouncedSearch && (
                        <CommandEmpty>Nenhum aluno encontrado para "{debouncedSearch}"</CommandEmpty>
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
                              <span className="font-medium leading-tight">{aluno.nome_completo}</span>
                              <div className="text-xs text-muted-foreground flex flex-wrap gap-x-2">
                                <span>{aluno.codigo_matricula}</span>
                                <span>•</span>
                                <span>{aluno.bi}</span>
                                <span>•</span>
                                <span className="truncate max-w-[140px]">{aluno.curso}</span>
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

            {/* ── Sino com efeito swing ─────────────────────────────────── */}
            <DropdownMenu>
              <DropdownMenuTrigger >
                <Button variant="ghost" size="icon" className="relative">
                  <span className={"bell-animate"}>
                    <Bell className="h-5 w-5" />
                  </span>
                  {avisosValidos.length > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold"
                    >
                      {avisosValidos.length > 99 ? "99+" : avisosValidos.length}
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

                {avisosValidos.length === 0 ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    Sem notificações
                  </div>
                ) : (
                  <div className="max-h-72 overflow-y-auto">
                    {avisosValidos.map((aviso, index) => (
                      <div key={aviso.CODIGO}>

                        <DropdownMenuItem
                          className="cursor-pointer px-3 py-3 focus:bg-muted/50 data-highlighted:bg-muted/50"
                          onSelect={() => navigate(`/notificacoes`)}
                        >
                          <div className="flex items-start gap-2">
                            <span className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                            <div className="flex flex-col">
                              <span className="text-xs font-semibold text-foreground">
                                {aviso.ASSUNTO}
                              </span>
                              <span className="line-clamp-1 text-xs leading-6 text-muted-foreground">
                                {aviso.DESCRICAO}
                              </span>
                            </div>
                          </div>
                        </DropdownMenuItem>
                        {index < avisosValidos.length - 1 && <DropdownMenuSeparator />}
                      </div>
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

            {/* ── Menu do utilizador ─────────────────────────────────────── */}
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
                    <span className="font-medium">{user?.user?.nome || "N/A"}</span>
                    <span className="text-xs text-muted-foreground">{user?.user?.email || "N/A"}</span>
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
    </>
  );
}