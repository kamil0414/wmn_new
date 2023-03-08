import React, { ReactNode } from "react";
import Header from "./Header";

type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = (props) => (
  <div id="app">
    <Header />
    <div className="layout">{props.children}</div>
    {/* <style jsx global>{`
      @tailwind base;
      @tailwind components;
      @tailwind utilities;
      
      html,
      body {
        font-size: 13px;
        margin: 0;
        font-family: "Segoe UI Web (East European)", "Segoe UI", -apple-system,
          BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif;
      }

      .container {
        margin-left: 12px;
        margin-right: 12px;
      }

      #app {
        display: flex;
        flex-direction: column;
      }

      #header {
        background-color: #222;
        color: #fff;
        padding: 18px 12px;
        border-bottom: 1px solid #ccc;
        margin-bottom: 24px;
        display: flex;
        justify-content: space-between;
      }

      .nav {
        display: flex;
        flex-direction: column;
        margin-top: 60px;
        flex: 1;
        align-items: center;
      }

      .nav > * {
        margin: 16px;
      }

      .nav button {
        min-width: 200px;
        padding: 24px;
      }

      .info > * {
        background-color: #d9edf7;
      }

      .flex {
        display: flex;
        flex: 1;
        justify-content: space-between;
      }

      .flex.fw > * {
        flex: 1;
      }

      .section {
        margin-bottom: 24px;
      }

      .justifyStart {
        justify-content: start;
      }

      .another {
        margin-top: 6px;
      }

      .buttons {
        margin-top: 12px;
        justify-content: end;
      }

      #saveButton {
        margin-left: 12px;
      }

      .options > * {
        margin-top: 12px;
      }

      .ms-MessageBar {
        margin: 16px 0;
      }

      .noWrap {
        white-space: nowrap;
      }

      .sum {
        text-align: right;
        padding-left: 10px;
      }

      .data {
        padding-right: 10px;
      }

      .red {
        color: red;
      }

      .ms-Table {
        display: table;
        width: 100%;
        border-collapse: collapse;
        margin-top: 16px;
      }

      .ms-Table tr {
        display: table-row;
        font-weight: 300;
        color: #333;
      }

      td {
        border-bottom: 1px solid #eaeaea;
        padding: 10px 0;
      }

      th {
        display: table-cell;
        padding: 10px 0;
        font-weight: 400;
        text-align: left;
        border-bottom: 1px solid #eaeaea;
      }
    `}</style> */}
  </div>
);

export default Layout;
