import { v4 as uuidv4 } from "uuid";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 ">
      <div className="flex">
        <div>
          <div className="mt-6 block text-sm font-medium leading-6 text-slate-900 print:hidden">
            1. Wybierz numer mieszkania
          </div>
          <div className="rounded-md shadow-sm">
            <select
              disabled
              className="mt-2 block w-full rounded-md border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
            >
              <option>1</option>
            </select>
          </div>
        </div>
      </div>
      <hr className="mt-4 print:hidden" />

      <form className="print:hidden">
        <div className="mt-4 block text-sm font-medium leading-6 text-slate-900">
          2. Podaj odczyt wodomierza (opcjonalnie)
        </div>
        <div className="flex gap-x-2">
          <div className="mt-2 flex w-[135px] rounded-md shadow-sm sm:flex-none">
            <input
              disabled
              step="any"
              type="number"
              className="w-full rounded-l-md border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
              placeholder="stan wodomierza"
            />
            <span className="inline-flex rounded-none rounded-r-md border border-l-0 border-slate-300 px-3 pt-2 text-slate-500 sm:text-sm">
              m<sub>3</sub>
            </span>
          </div>
          <div className="rounded-md shadow-sm">
            <input
              disabled
              type="date"
              value={new Date().toISOString().split("T")[0]}
              className="mt-2 inline-flex w-[135px] rounded-md border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <span className="my-2 flex items-center text-sm font-medium leading-6 text-slate-700">
          ostatni odczyt:&nbsp;
          <div className="my-1.5 h-2 w-80 animate-pulse rounded bg-slate-200" />
        </span>

        <div className="flex justify-end sm:justify-start">
          <button
            type="submit"
            disabled
            className="inline-flex justify-center rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 disabled:bg-slate-300"
          >
            Zapisz odczyt
          </button>
        </div>
      </form>

      <hr className="mt-4 print:hidden" />

      <form className="print:hidden">
        <div className="mt-4 block text-sm font-medium leading-6 text-slate-900">
          3. Dowód wpłaty
        </div>
        <div className="flex gap-x-2">
          <div className="mt-2 rounded-md shadow-sm">
            <input
              disabled
              type="number"
              placeholder="numer wyciągu"
              className="w-[135px] border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
            />
          </div>
          <div className="rounded-md shadow-sm">
            <input
              disabled
              type="date"
              value={new Date().toISOString().split("T")[0]}
              className="mt-2 inline-flex w-[135px] rounded-md border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div className="mb-2 mt-4 flex items-center">
          <input
            disabled
            checked
            type="radio"
            className="h-4 w-4 border-slate-300 bg-slate-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
          />
          <label
            htmlFor="default-radio-1"
            className="ml-2 flex text-sm font-medium text-slate-900"
          >
            zgodny z saldem&nbsp;
            <div className="my-1.5 h-2 w-16 animate-pulse rounded bg-slate-200" />
          </label>
        </div>

        <div className="mb-4 mt-2 flex items-center">
          <div className="mr-2 flex items-center">
            <input
              disabled
              type="radio"
              className="h-4 w-4 border-slate-300 bg-slate-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <div className="ml-2 text-sm font-medium text-slate-900">
              inna kwota
            </div>
          </div>
        </div>

        <div className="flex justify-end sm:justify-start">
          <button
            disabled
            type="submit"
            className="inline-flex justify-center rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 disabled:bg-slate-300"
          >
            Zapisz wpłatę
          </button>
        </div>
      </form>

      <div className="relative mb-2 mt-6 overflow-hidden">
        <div className="relative overflow-auto">
          <div className="my-8 overflow-hidden shadow-sm">
            <table className="w-full table-fixed border-collapse text-sm print:text-sm">
              <thead>
                <tr>
                  <td colSpan={3} className="border-b border-slate-100">
                    <div className="flex items-center justify-between  px-5 pb-8">
                      <div className="text-base font-semibold">Kartoteka</div>
                    </div>
                  </td>
                </tr>
              </thead>
              <tbody className="bg-white">
                {Array.from({ length: 5 }).map(() => (
                  <>
                    <tr>
                      <td
                        colSpan={3}
                        className="border-b border-slate-200 bg-slate-50 px-4 py-2.5 font-semibold"
                      >
                        <div className="my-1.5 h-2 w-24 animate-pulse rounded bg-slate-200" />
                      </td>
                    </tr>
                    <tr
                      key={uuidv4()}
                      className="hover:bg-gray-100 focus:bg-gray-100"
                    >
                      <td className="border-b border-slate-200 p-2 pl-6">
                        <div className="inline-flex flex-col items-start">
                          <div className="mb-1 font-medium">
                            <div className="my-1.5 h-2 w-20 animate-pulse rounded bg-slate-200" />
                          </div>
                          <div className="text-xs">
                            <div className="my-1.5 h-2 w-14 animate-pulse rounded bg-slate-200" />
                          </div>
                        </div>
                      </td>
                      <td className="border-b border-slate-200 p-2 print:whitespace-nowrap sm:pl-6">
                        <div className="my-1.5 h-2 w-24 animate-pulse rounded bg-slate-200" />
                      </td>
                      <td className="border-b border-slate-200 p-2">
                        <div className="align-center flex flex-col items-end">
                          <div className="flex flex-col items-end text-right text-xs">
                            <div className="my-1.5 h-2 w-10 animate-pulse rounded bg-slate-200" />
                            <div className="my-1.5 h-2 w-14 animate-pulse rounded bg-slate-200" />
                          </div>
                        </div>
                      </td>
                    </tr>
                  </>
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
