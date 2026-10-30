"use client"

import { Separator } from "@/components/ui/separator";
import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { User2, Scissors, SquareActivity, QrCode, Monitor, Settings } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

type Navitem = {
    label: string;
    path: string;
    icon: React.ElementType
}

export function NavItems() {
    const { data: session, status } = useSession();

    const companySlug = session?.user?.companySlug;
  
    const navItems: Navitem[] = [
        {
            label: "Fila ao vivo",
            path: "/admin",
            icon: User2
        },
        {
            label: "Serviços",
            path: "/admin/servicos",
            icon: Scissors
        },
        {
            label: "Relatorios",
            path: "/admin/relatorios",
            icon: SquareActivity
        }
    ];

    const adminNavitems: Navitem[] = [
        {
            label: "Qrcode e link",
            path: "/admin/qrcode",
            icon: QrCode
        },
        {
            label: "Telão",
            // 3. Só gera o link se o slug já existir, evitando links quebrados como /admin/null/tela
            path: companySlug ? `/${companySlug}/tela` : "#",
            icon: Monitor
        },
        {
            label: "Configuracões",
            path: "/admin/configuracoes",
            icon: Settings
        },
    ];

    // 4. EFEITO VISUAL DE CARREGAMENTO (Opcional, melhora muito a experiência)
    if (status === "loading") {
        return (
            <SidebarGroup>
                <SidebarMenu className="animate-pulse p-2 space-y-3">
                    <div className="h-6 bg-zinc-800/50 rounded w-3/4" />
                    <div className="h-6 bg-zinc-800/50 rounded w-1/2" />
                    <div className="h-6 bg-zinc-800/50 rounded w-2/3" />
                </SidebarMenu>
            </SidebarGroup>
        )
    }

    const renderNavItems = (items: Navitem[]) => {
        return items.map((item) => (
            <SidebarMenuItem key={item.label}>
                <SidebarMenuButton 
                    className="hover:bg-cinzaapoio/40" 
                    render={<Link href={item.path}>
                    <item.icon className='text-white hover:text-primary transition-all group-data-[collasible=icon]:text-white' />
                    <span className="text-white font-semibold font-mono text-sm">{item.label}</span>
                </Link>} 
                    tooltip={item.label}
                    disabled={item.path === "#"} // Desabilita o botão do telão se o slug ainda não carregou
                >
                    
                </SidebarMenuButton>
            </SidebarMenuItem>
        ))
    }

    return (
        <SidebarGroup>
            <SidebarMenu>
                {renderNavItems(navItems)}
                <Separator className="my-2" />
                {renderNavItems(adminNavitems)}
            </SidebarMenu>
        </SidebarGroup>
    )
}
