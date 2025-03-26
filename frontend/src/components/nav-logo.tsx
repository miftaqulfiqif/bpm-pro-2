import * as React from "react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { title } from "process";

export function NavLogo({
  items,
}: {
  items: {
    title: string;
    logo: string;
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <div className="flex">
      <p>{title}</p>
    </div>
  );
}
