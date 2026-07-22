import { ChevronRight, type LucideIcon } from "lucide-react";
import { Link, matchPath, useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipProvider } from "../ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { useEffect, useRef, useState } from "react";

export function NavPostGraduation({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
      isActive?: boolean;
    }[];
  }[];
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const hasAnyItem = items.some(
    (item) => item.url || (item.items && item.items.length > 0),
  );

  return (
    <SidebarGroup>
      {hasAnyItem && (
        <SidebarGroupLabel>Pós-Graduação (Core)</SidebarGroupLabel>
      )}

      <SidebarMenu>
        {items.map((item) => {
          const hasSubItems = item.items && item.items.length > 0;
          const isActive = !!matchPath(
            { path: item.url, end: item.url === "/" },
            location.pathname,
          );

          if (hasSubItems) {
            return (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      className={clsx(
                        "transition-colors",
                        isActive &&
                        "bg-primary text-primary-foreground hover:bg-primary/90",
                      )}
                    >
                      {item.icon && <item.icon />}
                      <TruncatedText text={item.title} />
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => {
                        const subActive =
                          subItem.isActive || location.pathname === subItem.url;

                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              className={clsx(
                                subActive &&
                                "bg-primary text-primary-foreground hover:bg-primary/90",
                              )}
                            >
                              <Link to={subItem.url}>
                                <TruncatedText text={subItem.title} />
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          }

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                onClick={() => navigate(item.url)}
                className={clsx(
                  "transition-colors",
                  isActive &&
                  "bg-primary text-primary-foreground hover:bg-primary/90",
                )}
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}




function TruncatedText({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [isTruncated, setIsTruncated] = useState(false)

  useEffect(() => {
    const el = ref.current

    if (el) {
      setIsTruncated(el.scrollWidth > el.clientWidth)
    }
  }, [text])

  const content = (
    <span ref={ref} className="block truncate max-w-[200px]">
      {text}
    </span>
  )

  if (!isTruncated) {
    return content
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {content}
      </TooltipTrigger>
      <TooltipContent>
        <p>{text}</p>
      </TooltipContent>
    </Tooltip>

  )
}