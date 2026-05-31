"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";

export default function ConditionalSidebar() {
  const pathname = usePathname();
  if (pathname === "/admin/login") return null;
  return <Sidebar />;
}
