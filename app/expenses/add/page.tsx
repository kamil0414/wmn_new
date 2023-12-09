import prisma from "@/lib/prisma";
import ExpenseForm from "../form";

async function AddExpense() {
  const expensesCategory = await prisma.kategoria_opisu.findMany({
    select: {
      id: true,
      nazwa: true,
      id_subkonta: true,
      czy_zawsze_bank: true,
      opisy: {
        select: {
          id: true,
          opis: true,
          ilosc_wymagana: true,
          jednostka_miary: true,
          firmy: {
            select: {
              id: true,
              nazwa: true,
            },
            orderBy: [
              {
                nazwa: "asc",
              },
            ],
          },
          typy_dowodow_ksiegowych: {
            select: {
              id: true,
              opis: true,
            },
            orderBy: [
              {
                opis: "asc",
              },
            ],
          },
        },
        orderBy: [
          {
            opis: "asc",
          },
        ],
      },
    },
    where: {
      AND: [
        {
          nazwa: {
            not: "Bilans otwarcia",
          },
        },
        {
          czy_wydatek: true,
        },
      ],
    },
    orderBy: [
      {
        nazwa: "asc",
      },
    ],
  });

  return (
    <div className="container mx-auto px-4">
      <ExpenseForm expensesCategory={expensesCategory} />
    </div>
  );
}
export default AddExpense;
