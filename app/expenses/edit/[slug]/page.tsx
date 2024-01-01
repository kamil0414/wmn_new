import prisma from "@/lib/prisma";
import ExpenseForm from "../../form";
import { categories } from "./query";

async function EditExpense({ params }: { params: { slug: string } }) {
  const id = parseInt(params.slug, 10);

  const record = await prisma.operacja.findFirst({
    where: {
      id,
    },
    select: {
      id_firmy: true,
      data: true,
      id_typu_dowodu_ksiegowego: true,
      numer_dowodu_ksiegowego: true,
      ilosc: true,
      kwota: true,
      komentarz: true,
      czy_bank: true,
      opis_pow: {
        select: {
          id: true,
          opis: true,
          kategoria_opisu: {
            select: {
              id: true,
              nazwa: true,
            },
          },
        },
      },
    },
  });

  return (
    <div className="container mx-auto px-4">
      <ExpenseForm
        className="mt-6"
        categories={await categories()}
        id={id}
        selectedCategory={record?.opis_pow?.kategoria_opisu.id}
        selectedDescription={record?.opis_pow?.id}
        selectedCompany={record?.id_firmy}
        selectedDate={
          record?.data ? new Date(record?.data).toISOString().split("T")[0] : ""
        }
        selectedType={record?.id_typu_dowodu_ksiegowego}
        selectedNumber={record?.numer_dowodu_ksiegowego}
        selectedCount={record?.ilosc?.toNumber()}
        selectedSum={-1 * (record?.kwota.toNumber() ?? 0)}
        selectedComment={record?.komentarz ?? ""}
        selectedCash={!record?.czy_bank}
      />
    </div>
  );
}
export default EditExpense;
