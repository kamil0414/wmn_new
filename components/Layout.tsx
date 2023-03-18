import React, { ReactNode } from "react";
import Header from "./Header";

type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = (props) => (
  <div id="app" className="mt-16 print:mt-0">
    <Header />
    <div className="layout">{props.children}</div>
  </div>
);

export default Layout;
