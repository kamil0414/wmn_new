import { formatter } from "@/utils/index";
import Links from "./links";
import Menu from "./menu";

async function getData() {
  const res = await fetch(`${process.env.API_URL}api/operationSums`, {
    headers: {
      Authorization: `Barer ${btoa(
        `${process.env.USER}:${process.env.PASSWORD}`,
      )}`,
    },
    next: { tags: ["operationSums"], revalidate: 0 },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

async function OHeader() {
  const operationSums = await getData();

  const accountState = parseFloat(operationSums[1]?._sum.kwota);
  const cashState = parseFloat(operationSums[0]?._sum.kwota);

  return (
    <nav className="sticky top-0 z-10 bg-gray-800 print:hidden">
      <div className="max-w-8xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <Menu />
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="hidden sm:block">
              <div className="flex space-x-4">
                <Links />
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <div id="header" className="flex gap-x-3 sm:gap-x-5">
              <div className="text-gray-300">
                <span className="text-xs">K: </span>
                <span className="text-sm font-semibold">
                  {formatter.format(cashState)}
                </span>
              </div>
              <div className="text-gray-300">
                <span className="text-xs">B: </span>
                <span className="text-sm font-semibold">
                  {formatter.format(accountState)}
                </span>
              </div>
              <div className="text-gray-300">
                <span className="text-xs">R: </span>
                <span className="text-sm font-semibold">
                  {formatter.format(accountState + cashState)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default OHeader;
