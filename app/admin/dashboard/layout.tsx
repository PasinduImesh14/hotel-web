"use client";

import { ReactNode } from "react";
import Sidebar from "./Sidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />                     {/* Sidebar visible on all admin pages */}
      <main className="flex-1 p-6 bg-gray-100">{children}</main>  {/* Page content */}
    </div>
  );
}
