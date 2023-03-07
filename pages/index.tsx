import React from "react";
import Layout from "../components/Layout";
import { PrimaryButton } from "@fluentui/react";
import Link from "next/link";

const downIcon = { iconName: "ChevronDown" };
const upIcon = { iconName: "ChevronUp" };
const doubleUpIcon = { iconName: "DoubleChevronUp" };
const wordDocument = { iconName: "WordDocument" };

type Props = {};

const Index: React.FC<Props> = (props) => {
  return (
    <Layout>
      <div className="nav">
        <Link href="/addIncome">
          <PrimaryButton iconProps={downIcon} allowDisabledFocus>
            Dodaj wpłatę
          </PrimaryButton>
        </Link>

        <Link href="/addExpense">
          <PrimaryButton iconProps={upIcon} allowDisabledFocus>
            Dodaj wydatek
          </PrimaryButton>
        </Link>

        <Link href="/expenses">
          <PrimaryButton iconProps={doubleUpIcon} allowDisabledFocus>
            Historia wydatków
          </PrimaryButton>
        </Link>

        <a target="_blank" href="./api/financialReport">
          <PrimaryButton iconProps={wordDocument} allowDisabledFocus>
            Dokumenty
          </PrimaryButton>
        </a>
      </div>
      <style jsx global>{`
        html,
        body {
          font-size: 13px;
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
      `}</style>
    </Layout>
  );
};

export default Index;
