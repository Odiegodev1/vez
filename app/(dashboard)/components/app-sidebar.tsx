import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { ComponentProps } from "react";
import Logo from '@/public/logo.png'
import { NavItems } from "./navitem";

type AppSidebarProps = ComponentProps<typeof Sidebar>
export function AppSidebar({...props}: AppSidebarProps) {
    return(
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader className="py-4 bg-grafite">
            <Link
            href="/"
           
            >
                <div   className="w-28 sm:hidden group-data-[state=expanded]:block mx-auto pt-3  max-w-[150]">
                <div className="flex items-center gap-2">
                <div className="size-13 flex items-center justify-center text-3xl font-extrabold  rounded-2xl bg-lima text-grafite">N</div>
                <h1 className="font-semibold text-2xl text-white">Vez</h1>
                </div>
    

                </div>

                <div   className="w-15 hidden group-data-[state=collapsed]:block mx-auto pt-3  max-w-[30]">
                <div className="size-7 flex items-center justify-center text-xl font-extrabold  rounded-2xl bg-grafite text-lima">N</div>
    

                </div>

            </Link>
           

        </SidebarHeader>
        <SidebarContent className="bg-grafite">
            <NavItems />
        </SidebarContent>
        <SidebarFooter className="bg-grafite">
             \\
        </SidebarFooter>
        <SidebarRail />

      </Sidebar>
    )
}