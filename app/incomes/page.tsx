import Link from "next/link";
import { classNames, formatter } from "@/utils/index";
import AAlert from "@/atoms/a-alert";
import React from "react";
import ActionButtons from "./actionButtons";
import { incomesHistory } from "./query";
import incorrectDescriptions from "../query";

export default async function Incomes() {
  const incomesHistoryGrouped = incomesHistory.map((el, index, array) => {
    const isDuplicated = array
      .slice(0, index)
      .some((prevEl) => prevEl.data.getTime() === el.data.getTime());
    return { ...el, isDuplicated };
  });

  const checkName = (number: string) =>
    incorrectDescriptions?.zawiera.some((el: string) =>
      number.toLocaleLowerCase().includes(el),
    ) ||
    incorrectDescriptions?.konczy_sie_na.some((el: string) =>
      number.toLocaleLowerCase().endsWith(el),
    ) ||
    incorrectDescriptions?.zaczyna_sie_od.some((el: string) =>
      number.toLocaleLowerCase().startsWith(el),
    );

  const incomesWithIncorrectName = incomesHistory.reduce(
    (acc, el) => (checkName(el.numer_dowodu_ksiegowego) ? acc + 1 : acc),
    0,
  );

  return (
    <div className="container mx-auto px-4">
      {incomesWithIncorrectName > 0 && (
        <AAlert title="Błąd" color="red" className="mt-6">
          <span>
            Niepoprawny numer dowodu księgowego przy{" "}
            <strong>{incomesWithIncorrectName}</strong> wpłatach(cie)
          </span>
        </AAlert>
      )}
      <div className="relative mb-2 mt-6 overflow-hidden">
        <div className="relative overflow-auto">
          <div className="my-8 overflow-hidden shadow-sm">
            <table className="w-full table-fixed border-collapse text-sm">
              <thead>
                <tr>
                  <td colSpan={3}>
                    <div className="flex items-center justify-between  px-5 pb-8">
                      <div className="text-base font-semibold">Wpłaty</div>
                      <Link href="/incomes/add">
                        <div className="pointer-events-auto rounded-md bg-sky-600 px-3 py-2 text-[0.8125rem] font-semibold leading-5 text-white hover:bg-sky-500">
                          Dodaj nową
                        </div>
                      </Link>
                    </div>
                  </td>
                </tr>
              </thead>
              <tbody className="bg-white">
                {incomesHistoryGrouped.map((row) => (
                  <React.Fragment key={row.id}>
                    {!row.isDuplicated ? (
                      <tr>
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
                            {formatter.format(row.kwota.toNumber())}
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
                                row.opis_pow == null ||
                                  (row.opis_pow.kategoria_opisu
                                    .czy_zawsze_bank &&
                                    row.opis_pow.kategoria_opisu
                                      .czy_zawsze_bank !== row.czy_bank) ||
                                  (row.opis_pow.kategoria_opisu.id_subkonta !==
                                    row.id_subkonta &&
                                    row.id_opisu !== 11)
                                  ? "text-red-500"
                                  : "",
                              )} mb-1`}
                            >
                              {row.opis_pow.kategoria_opisu?.nazwa ===
                              row.opis_pow.opis
                                ? row.opis_pow.kategoria_opisu?.nazwa
                                : `${row.opis_pow.kategoria_opisu?.nazwa} / ${row.opis_pow.opis}`}
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
                        <div className="flex flex-col items-end">
                          <ActionButtons
                            className="mb-1 flex gap-x-3"
                            id={row.id}
                          />
                          <span
                            className={classNames(
                              checkName(row.numer_dowodu_ksiegowego)
                                ? "font-semibold text-red-500"
                                : "text-slate-500",
                              "text-xs",
                            )}
                          >
                            {row.typ_dowodu_ksiegowego.opis}{" "}
                            {row.numer_dowodu_ksiegowego}
                          </span>
                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
                {(incomesHistoryGrouped == null ||
                  incomesHistoryGrouped?.length === 0) && (
                  <tr>
                    <td
                      colSpan={3}
                      className="border-b border-slate-200 p-4 text-center text-slate-500"
                    >
                      {incomesHistoryGrouped?.length === 0
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
