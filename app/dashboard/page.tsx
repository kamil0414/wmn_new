import AAlert from "@/atoms/a-alert";
import { classNames, formatter } from "@/utils/index";
import ActionButtons from "./actionButtons";
import { basicData, reminders } from "./query";

export default async function Home() {
  const receivableSum = basicData.reduce(
    (acc, el) => (el.saldo.toNumber() < 0 ? acc - el.saldo.toNumber() : acc),
    0,
  );

  const consumptionSum = basicData.reduce((acc, el) => acc + el.zuzycie, 0);

  return (
    <div className="container mx-auto px-4">
      {reminders.map((reminder) => (
        <AAlert
          key={reminder.id}
          title={reminder.tresc}
          color="blue"
          className="mt-6"
        >
          <div className="flex justify-between">
            <span>
              {reminder.data.toLocaleDateString("pl-PL", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <ActionButtons id={reminder.id} />
          </div>
        </AAlert>
      ))}

      <div className="mb-2 mt-6 text-sm font-medium text-gray-700">
        Salda mieszkań
      </div>
      <div className="not-prose relative overflow-hidden bg-slate-50 ">
        <div className="relative overflow-auto">
          <div className="my-8 shadow-sm">
            <table className="w-full table-fixed border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border-b pb-2 pl-4 pr-2 pt-0 text-left font-medium text-slate-400">
                    Numer
                  </th>
                  <th className="border-b p-2 pt-0 text-left font-medium text-slate-400">
                    Data ostatniej wpłaty
                  </th>
                  <th className="border-b p-2 pt-0 text-right font-medium text-slate-400 sm:text-left">
                    Saldo
                  </th>
                  <th className="hidden border-b p-2 pt-0 text-left font-medium text-slate-400 sm:block">
                    Data ostatniego odczytu wodomierza
                  </th>
                  <th className="border-b pb-2 pl-2 pr-4 pt-0 text-right font-medium text-slate-400 sm:text-left">
                    Suma zużycia wody w m3
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {basicData?.map((row) => (
                  <tr
                    key={row.numer_mieszkania}
                    className="hover:bg-gray-100 focus:bg-gray-100"
                  >
                    <td className="border-b border-slate-200 py-2 pl-4 pr-2 text-slate-500">
                      {row.numer_mieszkania}
                    </td>
                    <td className="border-b border-slate-200 p-2 text-left text-slate-500">
                      {row.data
                        ? new Date(row.data).toLocaleDateString("pl-PL")
                        : "-"}
                    </td>
                    <td
                      className={classNames(
                        row.saldo.toNumber() < 0
                          ? "text-red-500"
                          : "text-slate-500",
                        "border-b border-slate-200 p-2 text-right sm:text-left",
                      )}
                    >
                      {formatter.format(row.saldo.toNumber())}
                    </td>
                    <td className="hidden border-b border-slate-200 p-2 text-slate-500 sm:block">
                      {row.data_ostatniego_odczytu_wodomierza
                        ? new Date(
                            row.data_ostatniego_odczytu_wodomierza,
                          ).toLocaleDateString("pl-PL")
                        : "-"}
                    </td>
                    <td className="border-b border-slate-200 py-2 pl-2 pr-4 text-right text-slate-500 sm:text-left">
                      {row.zuzycie}
                    </td>
                  </tr>
                ))}
                {(basicData == null || basicData?.length === 0) && (
                  <tr>
                    <td
                      colSpan={5}
                      className="border-b border-slate-200 p-4 text-center text-slate-500"
                    >
                      {basicData?.length === 0 ? "brak operacji" : ""}
                    </td>
                  </tr>
                )}
              </tbody>
              {receivableSum > 0 && (
                <tfoot>
                  <tr>
                    <th />
                    <th className="py-2 pl-2 text-right font-normal text-slate-400">
                      Suma należności:
                    </th>

                    <th className="p-2 text-right font-normal text-red-500 sm:text-left">
                      {formatter.format(receivableSum)}
                    </th>
                    <th className="hidden py-2 pl-2 text-right font-normal text-slate-400 sm:block">
                      Suma:
                    </th>

                    <th className="py-2 pl-2 pr-4 text-right font-normal text-slate-400 sm:text-left">
                      {Math.round(1000 * consumptionSum) / 1000}
                    </th>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 rounded-xl border border-black/5" />
      </div>
    </div>
  );
}
