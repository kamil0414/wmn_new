import React from "react";
import Layout from "../components/Layout";
import { fetcher, formatter } from "../utils";
import useSWR from "swr";

const Expenses: React.FC<any> = (props) => {
  const { data: expensesHistory, error: expensesHistoryError } = useSWR(
    "/api/operations/?onlyExpenses=true",
    fetcher
  );

  return (
    <Layout>
      <div className="container mx-auto px-4">
        <div className="text-sm text-gray-700 font-medium mt-6 mb-2">
          Niebieskim kolorem oznaczone są operacje bankowe.
        </div>
        <div className="not-prose relative bg-slate-50 overflow-hidden ">
          <div className="relative overflow-auto">
            <div className="shadow-sm overflow-hidden my-8">
              <table className="border-collapse table-auto w-full text-sm">
                <thead>
                  <tr>
                    <th className="border-b font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 text-left">
                      Data
                    </th>
                    <th className="border-b font-medium p-4 pt-0 pb-3 text-slate-400 text-left">
                      Firma
                    </th>
                    <th className="border-b font-medium p-4 pr-8 pt-0 pb-3 text-slate-400 text-left">
                      Rodzaj i numer dowodu księgowego
                    </th>
                    <th className="border-b font-medium p-4 pr-8 pt-0 pb-3 text-slate-400 text-left">
                      Opis
                    </th>
                    <th className="border-b font-medium p-4 pr-8 pt-0 pb-3 text-slate-400 text-left">
                      Kwota
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white ">
                  {expensesHistory?.map((row, i) => (
                    <tr key={i} className={row.czy_bank ? "bg-sky-100" : ""}>
                      <td className="border-b border-slate-200 p-4 pl-8 text-slate-500 ">
                        {row.data.split("T")[0]}
                      </td>
                      <td className="border-b border-slate-200 p-4 text-slate-500 ">
                        {row.firma}
                      </td>
                      <td className="border-b border-slate-200 p-4 text-slate-500 ">
                        {row.rodzaj_i_numer_dowodu_ksiegowego}
                      </td>
                      <td className="border-b border-slate-200 p-4 text-slate-500 ">
                        {row.opis}
                      </td>
                      <td className="border-b border-slate-200 p-4 pr-8 text-slate-500 ">
                        {formatter.format(row.kwota)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="absolute inset-0 pointer-events-none border border-black/5 rounded-xl"></div>
        </div>
      </div>
    </Layout>
  );
};

export default Expenses;
