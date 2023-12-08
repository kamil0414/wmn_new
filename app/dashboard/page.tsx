import prisma from "@/lib/prisma";
import { classNames, formatter } from "@/utils/index";

export default async function Home() {
  const basicData = await prisma.saldo.findMany();

  const sumaNaleznosci = basicData.reduce(
    (accumulator, currentValue) =>
      currentValue.saldo.toNumber() < 0
        ? accumulator - currentValue.saldo.toNumber()
        : 0,
    0,
  );

  return (
    <div className="container mx-auto px-4">
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
                  <th className="border-b pb-2 pl-2 pr-4 pt-0 text-left font-medium text-slate-400">
                    Saldo
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
                        "border-b border-slate-200 py-2 pl-2 pr-4",
                      )}
                    >
                      {formatter.format(row.saldo.toNumber())}
                    </td>
                  </tr>
                ))}
                {(basicData == null || basicData?.length === 0) && (
                  <tr>
                    <td
                      colSpan={3}
                      className="border-b border-slate-200 p-4 text-center text-slate-500"
                    >
                      {basicData?.length === 0 ? "brak operacji" : ""}
                    </td>
                  </tr>
                )}
              </tbody>
              {sumaNaleznosci > 0 && (
                <tfoot>
                  <tr>
                    <th></th>
                    <th className="py-2 pl-2 text-right font-normal text-slate-400">
                      Suma należności:
                    </th>

                    <th className="py-2 pl-2 pr-4 text-left font-normal text-red-500">
                      {formatter.format(sumaNaleznosci)}
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
