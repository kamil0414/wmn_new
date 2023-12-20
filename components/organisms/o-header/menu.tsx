"use client";

import ASvg from "@/atoms/a-svg";
import { useState } from "react";
import closeIcon from "@/svg/closeIcon.svg";
import hamburgerIcon from "@/svg/hamburgerIcon.svg";
import Links from "./links";

function Menu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
        type="button"
        aria-expanded="false"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="block h-6 w-6" aria-hidden="true">
          <ASvg
            className="block h-6 w-6"
            svg={isOpen ? closeIcon : hamburgerIcon}
          />
        </span>
      </button>
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="absolute -left-2 top-[64px] w-max space-y-1 bg-gray-800 px-2 pb-3 pt-2"
        >
          <Links />
        </div>
      )}
    </>
  );
}

export default Menu;
