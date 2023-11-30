"use client";

import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { classNames, formatter } from "../utils";

function HeaderNav({
  accountState,
  cashState,
}: {
  accountState: number;
  cashState: number;
}) {
  const pathname = usePathname();

  const isActive: (pathname: string) => boolean = (itemPathname) =>
    pathname === itemPathname;

  const navigation = [
    { name: "Dashboard", href: "/" },
    { name: "Dodaj wpłatę", href: "/addIncome" },
    { name: "Dodaj wydatek", href: "/addExpense" },
    { name: "Historia wydatków", href: "/expenses" },
    { name: "Dokumenty", href: "/documents" },
  ];

  return (
    <Disclosure as="nav" className="sticky top-0 z-10 bg-gray-800 print:hidden">
      {({ open }) => (
        <>
          <div className="max-w-8xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="hidden sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
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
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <div id="header" className="flex gap-x-3 sm:gap-x-5">
                  <div className=" text-gray-300">
                    <span className="text-xs">K: </span>
                    <span className="text-sm font-semibold">
                      {formatter.format(cashState)}
                    </span>
                  </div>
                  <div className=" text-gray-300">
                    <span className="text-xs">B: </span>
                    <span className="text-sm font-semibold">
                      {formatter.format(accountState)}
                    </span>
                  </div>
                  <div className=" text-gray-300">
                    <span className="text-xs">R: </span>
                    <span className="text-sm font-semibold">
                      {formatter.format(accountState + cashState)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  <Disclosure.Button
                    as="span"
                    className={classNames(
                      isActive(item.href)
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "block rounded-md px-3 py-2 text-base font-medium",
                    )}
                  >
                    {item.name}
                  </Disclosure.Button>
                </Link>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

export default HeaderNav;
