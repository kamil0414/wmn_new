import { InferGetServerSidePropsType } from "next";
import Layout from "../components/Layout";
import prisma from "../lib/prisma";
import { classNames, formatter } from "../utils";

function Index({
  basicData,
}: InferGetServerSidePropsType<typeof getStaticProps>) {
  return (
    <Layout>
      <div className="container mx-auto px-4">
        <div className="mb-2 mt-6 text-sm font-medium text-gray-700">
          Salda mieszkań
        </div>
        <div className="not-prose relative overflow-hidden bg-slate-50 ">
          <div className="relative overflow-auto">
            <div className="my-8 shadow-sm">
              <table className="w-full table-auto border-collapse text-sm">
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
                      className="hover:bg-gray-200 focus:bg-gray-200"
                    >
                      <td className="border-b border-slate-200 py-2 pl-4 pr-2 text-slate-500">
                        {row.numer_mieszkania}
                      </td>
                      <td className="border-b border-slate-200 p-2 text-slate-500">
                        {row.data
                          ? new Date(row.data).toLocaleDateString()
                          : "-"}
                      </td>
                      <td
                        className={classNames(
                          row.saldo < 0 ? "text-red-500" : "text-slate-500",
                          "border-b border-slate-200 py-2 pl-2 pr-4",
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
                        className="border-b border-slate-200 p-4 text-center text-slate-500"
                      >
                        {basicData?.length === 0 ? "brak operacji" : ""}
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

export const getStaticProps = async () => {
  const basicData = await prisma.salda.findMany();
  return { props: { basicData: JSON.parse(JSON.stringify(basicData)) } };
};

export default Index;
