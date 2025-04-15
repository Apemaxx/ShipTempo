import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  className?: string;
}

const MainLayout = ({ className = "" }: MainLayoutProps) => {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main
          className={cn("flex-1 overflow-auto p-6 bg-background/50", className)}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
