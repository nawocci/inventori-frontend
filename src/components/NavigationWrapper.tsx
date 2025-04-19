'use client';

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import { ReactNode } from "react";

interface NavigationWrapperProps {
  children: ReactNode;
}

export default function NavigationWrapper({ children }: NavigationWrapperProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <>
      {!isLoginPage && <Navbar />}
      {children}
    </>
  );
}