import { v4 as uuidv4 } from "uuid";

export default function Loading() {
  return (
    <div className="container mx-auto px-4">
      <div className="mb-2 mt-6 text-sm font-medium text-gray-700">
        Salda mieszkań
      </div>
      <div className="relative overflow-hidden bg-slate-50 ">
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
                    Zużycie wody w m3
                  </th>
                </tr>
              </thead>
              <tbody className="animate-pulse bg-white">
                {Array.from({ length: 9 }).map(() => (
                  <tr key={uuidv4()}>
                    <td className="border-b border-slate-200 py-2 pl-4 pr-2">
                      <div className="my-1.5 h-2 w-4 rounded bg-slate-200" />
                    </td>
                    <td className="border-b border-slate-200 p-2 ">
                      <div className="my-1.5 h-2 w-20 rounded bg-slate-200" />
                    </td>
                    <td className="border-b border-slate-200 p-2 ">
                      <div className="my-1.5 h-2 w-20 rounded bg-slate-200" />
                    </td>
                    <td className="border-b border-slate-200 p-2 ">
                      <div className="my-1.5 h-2 w-20 rounded bg-slate-200" />
                    </td>
                    <td className="border-b border-slate-200 py-2 pl-2 pr-4">
                      <div className="my-1.5 h-2 w-10 rounded bg-slate-200" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 rounded-xl border border-black/5" />
      </div>
    </div>
  );
}
