import React from "react";
import Layout from "../components/Layout";
import useSWR from "swr";
import { classNames, fetcher, formatter } from "../utils";

type Props = {};

const Index: React.FC<Props> = (props) => {
  const {
    data: basicData,
    error: basicDataError,
    isLoading: isLoadingBasicData,
  } = useSWR("/api/basicData", fetcher);

  return (
    <Layout>
      <div className="container mx-auto px-4">
        <div className="text-sm font-medium text-gray-700 mt-6 mb-2">
          Salda mieszkań
        </div>
        <div className="not-prose relative bg-slate-50 overflow-hidden ">
          <div className="relative overflow-auto">
            <div className="shadow-sm my-8">
              <table className="border-collapse table-auto w-full text-sm">
                <thead>
                  <tr>
                    <th className="border-b font-medium pr-2 pl-4 pt-0 pb-2 text-slate-400 text-left">
                      Numer
                    </th>
                    <th className="border-b font-medium p-2 pt-0 text-slate-400 text-left">
                      Data ostatniej wpłaty
                    </th>
                    <th className="border-b font-medium pr-4 pl-2 pt-0 pb-2 text-slate-400 text-left">
                      Saldo
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {basicData?.map((row) => (
                    <tr key={row.numer_mieszkania} className="hover:bg-gray-200 focus:bg-gray-200">
                      <td className="border-b border-slate-200 pr-2 pl-4 py-2 text-slate-500">
                        {row.numer_mieszkania}
                      </td>
                      <td className="border-b border-slate-200 p-2 text-slate-500">
                        {row.ostatnia_wplata ? new Date(row.ostatnia_wplata).toLocaleDateString() : '-'}
                      </td>
                      <td
                        className={classNames(
                          row.saldo < 0 ? "text-red-500" : "text-slate-500",
                          "border-b border-slate-200 pr-4 pl-2 py-2"
                        )}
                      >
                        {formatter.format(row.saldo)}
                      </td>
                    </tr>
                  ))}
                  {(basicData == null || basicData?.length === 0) && (
                    <tr>
                      <td
                        colSpan={3}
                        className="text-center border-b border-slate-200 p-4 text-slate-500"
                      >
                        {basicData?.length === 0 ? "brak operacji" : ""}
                        {isLoadingBasicData ? "ładowanie..." : ""}
                        {basicDataError ? basicDataError : ""}
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

export default Index;
