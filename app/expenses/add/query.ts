import prisma from "@/lib/prisma";

// eslint-disable-next-line import/prefer-default-export
export const categories = async () =>
  prisma.kategoria_opisu.findMany({
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
