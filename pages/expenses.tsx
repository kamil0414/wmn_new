import { InferGetServerSidePropsType } from "next";
import Layout from "../components/Layout";
import prisma from "../lib/prisma";
import {
  classNames,
  formatter,
  getEndDateFromEnv,
  getStartDateFromEnv,
} from "../utils";

function Expenses({
  expensesHistory,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Layout>
      <div className="container mx-auto px-4">
        <div className="mb-2 mt-6 text-sm font-medium text-gray-700">
          Niebieskim kolorem oznaczone są operacje bankowe.
        </div>
        <div className="not-prose relative overflow-hidden bg-slate-50 ">
          <div className="relative overflow-auto">
            <div className="my-8 overflow-hidden shadow-sm">
              <table className="w-full table-auto border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="border-b pb-2 pl-4 pr-2 pt-0 text-left font-medium text-slate-400">
                      Data
                    </th>
                    <th className="border-b p-2 pt-0 text-left font-medium text-slate-400">
                      Firma
                    </th>
                    <th className="border-b p-2 pt-0 text-left font-medium text-slate-400">
                      Rodzaj i numer dowodu księgowego
                    </th>
                    <th className="border-b p-2 pt-0 text-left font-medium text-slate-400">
                      Opis
                    </th>
                    <th className="border-b p-2 pt-0 text-right font-medium text-slate-400">
                      Kwota
                    </th>
                    <th className="border-b pb-2 pl-2 pr-4 pt-0 font-medium text-slate-400">
                      Uwagi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white ">
                  {expensesHistory?.map((row) => (
                    <tr
                      key={row.id}
                      className={classNames(
                        row.czy_bank && "bg-sky-100",
                        "hover:bg-gray-200 focus:bg-gray-200",
                      )}
                    >
                      <td className="border-b border-slate-200 py-2 pl-4 pr-2 text-slate-500 ">
                        {row.data.toString().split("T")[0]}
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
                          "border-b border-slate-200 p-2",
                        )}
                      >
                        {row.opis_pow
                          ? `${
                              row.opis_pow?.kategoria_wydatku?.nazwa ===
                              row.opis_pow?.opis
                                ? row.opis_pow?.kategoria_wydatku?.nazwa
                                : `${row.opis_pow?.kategoria_wydatku?.nazwa} / ${row.opis_pow?.opis}`
                            }`
                          : row.opis}
                        {parseInt(row.ilosc, 10) > 0 ? ` (${row.ilosc})` : ""}
                      </td>
                      <td className="border-b border-slate-200 p-2 py-2 text-right text-slate-500">
                        {formatter.format(parseFloat(row.kwota))}
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
                        className="border-b border-slate-200 p-4 text-center text-slate-500"
                      >
                        {expensesHistory?.length === 0 ? "brak operacji" : ""}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-0 rounded-xl border border-black/5" />
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps = async () => {
  const expensesHistory = await prisma.operacje.findMany({
    select: {
      id: true,
      data: true,
      czy_bank: true,
      ilosc: true,
      opis: true,
      kwota: true,
      rodzaj_i_numer_dowodu_ksiegowego: true,
      komentarz: true,
      firma: {
        select: {
          nazwa: true,
        },
      },
      opis_pow: {
        select: {
          opis: true,
          kategoria_wydatku: {
            select: {
              nazwa: true,
            },
          },
        },
      },
    },
    where: {
      OR: [
        {
          kwota: {
            lte: 0,
          },
        },
        {
          rodzaj_i_numer_dowodu_ksiegowego: {
            equals: "Bilans otwarcia",
          },
        },
      ],
      data: {
        gte: getStartDateFromEnv(),
        lte: getEndDateFromEnv(),
      },
    },
    orderBy: [
      {
        data: "asc",
      },
      {
        rodzaj_i_numer_dowodu_ksiegowego: "asc",
      },
      {
        firma: {
          nazwa: "asc",
        },
      },
    ],
  });
  return {
    props: { expensesHistory: JSON.parse(JSON.stringify(expensesHistory)) },
  };
};

export default Expenses;
