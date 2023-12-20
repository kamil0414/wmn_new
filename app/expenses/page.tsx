import Link from "next/link";
import prisma from "@/lib/prisma";
import {
  getStartDateFromEnv,
  getEndDateFromEnv,
  classNames,
  formatter,
} from "@/utils/index";
import { ActionButtons } from "./actionButtons";
import AAlert from "@/atoms/a-alert";

export default async function Expenses() {
  const plans = await prisma.plan.groupBy({
    by: ["id_opisu"],
    _sum: {
      kwota: true,
    },
    where: {
      termin_platnosci: {
        gte: getStartDateFromEnv(),
        lte: getEndDateFromEnv(7),
      },
      is_deleted: false,
    },
  });

  const naliczenia = await prisma.naliczenie.aggregate({
    _sum: {
      woda: true,
      smieci: true,
    },
    where: {
      data: {
        gte: getStartDateFromEnv(),
        lte: getEndDateFromEnv(7),
      },
      is_deleted: false,
    },
  });

  const media = await prisma.opis.findMany({
    select: {
      id: true,
      opis: true,
    },
    where: {
      czy_media: true,
    },
  });

  const expensesHistory = await prisma.operacja.findMany({
    select: {
      id: true,
      data: true,
      czy_bank: true,
      ilosc: true,
      kwota: true,
      typ_dowodu_ksiegowego: {
        select: {
          opis: true,
        },
      },
      numer_dowodu_ksiegowego: true,
      komentarz: true,
      firma: {
        select: {
          nazwa: true,
        },
      },
      opis_pow: {
        select: {
          opis: true,
          kategoria_opisu: {
            select: {
              czy_zawsze_bank: true,
              id_subkonta: true,
              nazwa: true,
            },
          },
        },
      },
      id_opisu: true,
      id_subkonta: true,
    },
    where: {
      OR: [
        {
          kwota: {
            lte: 0,
          },
        },
        {
          id_opisu: {
            in: [11, 21, 25],
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
        numer_dowodu_ksiegowego: "asc",
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

  const checkName = (number: string) =>
    [
      "  ",
      "bilans otwarcia",
      "brak",
      "faktura",
      "kp",
      "lub",
      "nnm",
      "nr",
      "paragon",
      "pokwitowanie",
      "polisa",
      "potrzebna",
      "przepięcia",
      "wyciąg",
    ].some((el) => number.toLocaleLowerCase().includes(el)) ||
    [".", ","].some((el) => number.toLocaleLowerCase().endsWith(el)) ||
    ["000"].some((el) => number.toLocaleLowerCase().startsWith(el));

  const expensesWithIncorrectName = expensesHistory.reduce(
    (acc, el) => (checkName(el.numer_dowodu_ksiegowego) ? acc + 1 : acc),
    0,
  );

  return (
    <div className="container mx-auto px-4">
      {media.map((e) => {
        const plan =
          (plans.find((el) => el.id_opisu === e.id)?._sum.kwota?.toNumber() ??
            0) +
          (e.id === 4
            ? naliczenia._sum.smieci?.toNumber() ?? 0
            : e.id === 5
              ? naliczenia._sum.woda?.toNumber() ?? 0
              : 0);
        const exp = expensesHistory.reduce(
          (acc, el) =>
            el.id_opisu === e.id ? (acc += el.kwota.toNumber()) : acc,
          0,
        );

        const value = -1 * exp - plan;

        return (
          value != 0 && (
            <AAlert
              key={e.id}
              title={`Niezgodność sald (${
                value < 0 ? "niedopłata" : "nadpłata"
              })`}
              color="red"
              className="mt-6"
            >
              <span>
                {e.opis}
                {": "}
                <strong>{formatter.format(value)}</strong>
              </span>
            </AAlert>
          )
        );
      })}

      {expensesWithIncorrectName > 0 && (
        <AAlert
          title="Niepoprawny numer dowodu księgowego"
          color="yellow"
          className="mt-6"
        >
          <span>
            przy <strong>{expensesWithIncorrectName}</strong> wydatkach(u)
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
                      <div className="text-base font-semibold">Wydatki</div>
                      <Link href="/expenses/add">
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
