"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { classNames } from "@/utils/index";

function Links() {
  const navigation = [
    { name: "Salda mieszkań", href: "/" },
    { name: "Dodaj wpłatę", href: "/incomes/add" },
    { name: "Dodaj wydatek", href: "/expenses/add" },
    { name: "Wydatki", href: "/expenses" },
    { name: "Dokumenty", href: "/documents" },
  ];

  const pathname = usePathname();

  const isActive: (pathname: string) => boolean = (itemPathname) =>
    pathname === itemPathname;

  return navigation.map((item) => (
    <Link
      key={item.name}
      href={item.href}
      aria-current={isActive(item.href) ? "page" : undefined}
      className={classNames(
        isActive(item.href)
          ? "bg-gray-900 text-white"
          : "text-gray-300 hover:bg-gray-700 hover:text-white",
        "flex self-center rounded-md px-3 py-2 text-center text-sm font-medium",
      )}
    >
      {item.name}
    </Link>
  ));
}

export default Links;
