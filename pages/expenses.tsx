import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { formatter } from "../utils";

const Expenses: React.FC<any> = (props) => {
  const [expensesHistory, setExpensesHistory] = useState([]);

  useEffect(() => {
    fetchExpensesHistory();
  }, []);

  const fetchExpensesHistory = () => {
    fetch(`/api/operations/?onlyExpenses=true`)
      .then((response) => response.json())
      .then((json) => {
        setExpensesHistory(json);
      });
  };

  return (
    <Layout>
      <div className="container">
        <span>Niebieskim kolorem oznaczone są operacje bankowe.</span>
        <table className="ms-Table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Firma</th>
              <th>Rodzaj i numer dowodu księgowego</th>
              <th>Opis</th>
              <th className="sum">Kwota</th>
            </tr>
          </thead>
          <tbody>
            {expensesHistory.map((row) => (
              <tr className={row.czy_bank ? "info" : ""}>
                <td className="noWrap data">{row.data.split("T")[0]}</td>
                <td className="data">{row.firma}</td>
                <td className="data">{row.rodzaj_i_numer_dowodu_ksiegowego}</td>
                <td className="">{row.opis}</td>
                <td className="noWrap sum">{formatter.format(row.kwota)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default Expenses;
