import React, { useEffect, useState } from "react";
import Link from "next/link";
import { formatter } from "../utils";

const Header: React.FC = () => {
  const [accountsBalance, setAccountsBalance] = useState();

  const fetchAccountBalance = () => {
    fetch(`/api/accountBalance`, {})
      .then((response) => response.json())
      .then((json) => setAccountsBalance(json));
  };

  useEffect(() => {
    fetchAccountBalance();
  }, []);

  return (
    <nav>
      <div id="header">
        <span>
          Kasa: <strong>{formatter.format(accountsBalance?.kasa)}</strong>
        </span>
        <span>
          Bank: <strong>{formatter.format(accountsBalance?.bank)}</strong>
        </span>
        <span>
          Razem: <strong>{formatter.format(accountsBalance?.razem)}</strong>
        </span>
      </div>

      <style jsx>{`
        #header {
          background-color: #222;
          color: #fff;
          padding: 18px 12px;
          border-bottom: 1px solid #ccc;
          margin-bottom: 24px;
          display: flex;
          justify-content: space-between;
        }
      `}</style>
    </nav>
  );
};

export default Header;
