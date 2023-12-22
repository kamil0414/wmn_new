import { getStartDateFromEnv, getEndDateFromEnv } from "@/utils/index";
import prisma from "@/lib/prisma";

// eslint-disable-next-line import/prefer-default-export
export const incomesHistory = await prisma.operacja.findMany({
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
    AND: [
      {
        kwota: {
          gte: 0,
        },
      },
      {
        id_opisu: {
          notIn: [11, 21, 25],
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
      numer_dowodu_ksiegowego: "desc",
    },
    {
      firma: {
        nazwa: "asc",
      },
    },
  ],
});
