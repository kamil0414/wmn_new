import React from "react";
import Layout from "../components/Layout";
import { classNames, fetcher, formatter } from "../utils";
import useSWR from "swr";

const Expenses: React.FC<any> = (props) => {
  const {
    data: expensesHistory,
    error: expensesHistoryError,
    isLoading: expensesHistoryIsLoading,
  } = useSWR("/api/operations?onlyExpenses=true", fetcher);

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
                    <th className="border-b font-medium pl-4 pr-2 pb-2 pt-0 text-slate-400 text-left">
                      Data
                    </th>
                    <th className="border-b font-medium p-2 pt-0 text-slate-400 text-left">
                      Firma
                    </th>
                    <th className="border-b font-medium p-2 pt-0 text-slate-400 text-left">
                      Rodzaj i numer dowodu księgowego
                    </th>
                    <th className="border-b font-medium p-2 pt-0 text-slate-400 text-left">
                      Opis
                    </th>
                    <th className="border-b font-medium p-2 pt-0 text-slate-400 text-right">
                      Kwota
                    </th>
                    <th className="border-b font-medium pl-2 pr-4 pb-2 pt-0 text-slate-400">
                      Uwagi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white ">
                  {expensesHistory?.map((row) => (
                    <tr key={row.id} className={classNames(row.czy_bank && "bg-sky-100", "hover:bg-gray-200 focus:bg-gray-200")}>
                      <td className="border-b border-slate-200 pl-4 pr-2 py-2 text-slate-500 ">
                        {row.data.split("T")[0]}
                      </td>
                      <td className="border-b border-slate-200 p-2 text-slate-500 ">
                        {row.firma.nazwa}
                      </td>
                      <td className="border-b border-slate-200 p-2 text-slate-500 ">
                        {row.rodzaj_i_numer_dowodu_ksiegowego}
                      </td>
                      <td
                        className={classNames(
                          row.opis_pow == null
                            ? "text-red-500"
                            : "text-slate-500",
                          "border-b border-slate-200 p-2"
                        )}
                      >
                        {row.opis_pow
                          ? `${
                              row.opis_pow?.kategoria_wydatku?.nazwa ===
                              row.opis_pow?.opis
                                ? row.opis_pow?.kategoria_wydatku?.nazwa
                                : `${row.opis_pow?.kategoria_wydatku?.nazwa} / ${row.opis_pow?.opis}`
                            }`
                          : row.opis}{" "}
                        {row.ilosc > 0 ? `(${row.ilosc})` : ""}
                      </td>
                      <td className="border-b border-slate-200 p-2 py-2 text-slate-500 text-right">
                        {formatter.format(row.kwota)}
                      </td>
                      <td className="border-b border-slate-200 p-2 text-slate-500 ">
                        {row.komentarz}
                      </td>
                    </tr>
                  ))}
                  {(expensesHistory == null ||
                    expensesHistory?.length === 0) && (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center border-b border-slate-200 p-4 text-slate-500"
                      >
                        {expensesHistory?.length === 0 ? "brak operacji" : ""}
                        {expensesHistoryIsLoading ? "ładowanie..." : ""}
                        {expensesHistoryError ? expensesHistoryError : ""}
                      </td>
                    </tr>
                  )}
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
