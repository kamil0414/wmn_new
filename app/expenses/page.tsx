import Link from "next/link";
import prisma from "@/lib/prisma";
import {
  getStartDateFromEnv,
  getEndDateFromEnv,
  classNames,
  formatter,
} from "@/utils/index";
import { ActionButtons } from "./actionButtons";

export default async function Expenses() {
  const expensesHistory = await prisma.operacja.findMany({
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
      is_deleted: false,
    },
    orderBy: [
      {
        data: "desc",
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

  const expensesHistoryGrouped = expensesHistory.map((el, index, array) => {
    const isDuplicated = array
      .slice(0, index)
      .some((prevEl) => prevEl.data.getTime() === el.data.getTime());
    return { ...el, isDuplicated };
  });

  return (
    <div className="container mx-auto px-4">
      <div className="relative mb-2 mt-6 overflow-hidden">
        <div className="relative overflow-auto">
          <div className="my-8 overflow-hidden shadow-sm">
            <table className="w-full table-fixed border-collapse text-sm">
              <thead>
                <tr>
                  <td colSpan={3}>
                    <div className="flex items-center justify-between  px-5 pb-8">
                      <div className="text-base font-semibold">Wydatki</div>
                      <Link href="/addExpense">
                        <div className="pointer-events-auto rounded-md bg-sky-600 px-3 py-2 text-[0.8125rem] font-semibold leading-5 text-white hover:bg-sky-500">
                          Dodaj nowy
                        </div>
                      </Link>
                    </div>
                  </td>
                </tr>
              </thead>
              <tbody className="bg-white">
                {expensesHistoryGrouped.map((row) => (
                  <>
                    {!row.isDuplicated ? (
                      <tr key={`head_${row.id}`}>
                        <td
                          colSpan={3}
                          className="border-b border-slate-200 bg-slate-50 px-4 py-2.5 font-semibold"
                        >
                          {row.data.toLocaleDateString("pl-PL", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </td>
                      </tr>
                    ) : (
                      ""
                    )}
                    <tr
                      key={row.id}
                      className="hover:bg-gray-100 focus:bg-gray-100"
                    >
                      <td className="border-b border-slate-200 p-2 pl-4  sm:px-6 sm:py-2 ">
                        <div className="flex grow flex-col items-start gap-x-3 sm:flex-row">
                          <span className="mb-1 font-medium sm:mb-0">
                            {formatter.format(-1 * row.kwota.toNumber())}
                          </span>
                          {row.czy_bank ? (
                            <span className="inline-flex items-center rounded-md bg-sky-50 px-2 py-1 text-xs font-medium text-sky-700 ring-1 ring-inset ring-sky-700/10">
                              Bank
                            </span>
                          ) : (
                            ""
                          )}
                        </div>
                      </td>
                      <td className="border-b border-slate-200 p-2 sm:px-6 sm:py-2 ">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span
                              className={`${classNames(
                                row.opis_pow == null ? "text-red-500" : "",
                              )} mb-1`}
                            >
                              {row.opis_pow
                                ? `${
                                    row.opis_pow?.kategoria_wydatku?.nazwa ===
                                    row.opis_pow?.opis
                                      ? row.opis_pow?.kategoria_wydatku?.nazwa
                                      : `${row.opis_pow?.kategoria_wydatku?.nazwa} / ${row.opis_pow?.opis}`
                                  }`
                                : row.opis}
                              {row.ilosc && row.ilosc.toNumber() > 0
                                ? ` (${row.ilosc})`
                                : ""}
                            </span>
                            <span className="text-xs text-slate-500">
                              {row.firma.nazwa}
                            </span>
                          </div>
                          <span className="hidden sm:block">
                            {row.komentarz}
                          </span>
                        </div>
                      </td>

                      <td className="border-b border-slate-200 p-2 text-right sm:px-6 sm:py-2">
                        <div className="flex flex-col">
                          <ActionButtons className="mb-1" id={row.id} />
                          <span className=" text-xs text-slate-500">
                            {row.rodzaj_i_numer_dowodu_ksiegowego}
                          </span>
                        </div>
                      </td>
                    </tr>
                  </>
                ))}
                {(expensesHistoryGrouped == null ||
                  expensesHistoryGrouped?.length === 0) && (
                  <tr>
                    <td
                      colSpan={3}
                      className="border-b border-slate-200 p-4 text-center text-slate-500"
                    >
                      {expensesHistoryGrouped?.length === 0
                        ? "brak operacji"
                        : ""}
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
  );
}
