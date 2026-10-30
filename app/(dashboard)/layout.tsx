"use client"

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { AppSidebar } from "./components/app-sidebar";
import { SessionProvider } from "next-auth/react";
import { Providers } from "./components/providers";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <Providers>
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />

        <SidebarInset>
          <header
          >
           
              <SidebarTrigger className="flex md:hidden" />
            
           

         

          </header>

          <div className="flex bg-nevoa flex-1 flex-col gap-6 p-6 overflow-auto">
     
           {children}
        
            
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
    </Providers>
  );
}