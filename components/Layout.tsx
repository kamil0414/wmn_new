import React, { ReactNode } from "react";
import Header from "./Header";

type Props = {
  children: ReactNode;
};

function Layout({ children }: Props) {
  return (
    <div id="app">
      <Header />
      <div className="layout">{children}</div>
    </div>
  );
}

export default Layout;
