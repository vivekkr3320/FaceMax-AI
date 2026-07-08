"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavbarLinks() {
  const pathname = usePathname();

  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
    return `relative py-1 transition-colors ${
      isActive ? "text-white" : "text-[#C5CAD6] hover:text-white"
    }`;
  };

  return (
    <nav className="flex items-center gap-8 text-sm font-semibold">
      <Link href="/" className={getLinkClass("/")}>
        Home
        {pathname === "/" && (
          <span className="absolute bottom-[-4px] left-0 right-0 h-0.5 bg-[#6D5EF8] rounded-full" />
        )}
      </Link>
      <Link href="/pricing" className={getLinkClass("/pricing")}>
        Pricing
        {pathname === "/pricing" && (
          <span className="absolute bottom-[-4px] left-0 right-0 h-0.5 bg-[#6D5EF8] rounded-full" />
        )}
      </Link>
      <Link href="/#features" className="text-[#C5CAD6] hover:text-white transition-colors">
        How It Works
      </Link>
      <Link href="/privacy-policy" className={getLinkClass("/privacy-policy")}>
        About
        {pathname === "/privacy-policy" && (
          <span className="absolute bottom-[-4px] left-0 right-0 h-0.5 bg-[#6D5EF8] rounded-full" />
        )}
      </Link>
    </nav>
  );
}
