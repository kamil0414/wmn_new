import { getStartDateFromEnv, getEndDateFromEnv } from "@/utils/index";
import prisma from "@/lib/prisma";

export const accruals = async () =>
  prisma.naliczenie.aggregate({
    _sum: {
      woda: true,
      smieci: true,
    },
    where: {
      data: {
        gte: getStartDateFromEnv(),
        lte: getEndDateFromEnv(7),
      },
      is_deleted: false,
    },
  });

export const expensesHistory = async () =>
  prisma.operacja.findMany({
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
      OR: [
        {
          kwota: {
            lte: 0,
          },
        },
        {
          id_opisu: {
            in: [11, 21, 25],
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
        numer_dowodu_ksiegowego: "asc",
      },
      {
        firma: {
          nazwa: "asc",
        },
      },
    ],
  });

export const media = async () =>
  prisma.opis.findMany({
    select: {
      id: true,
      opis: true,
    },
    where: {
      czy_media: true,
    },
  });

export const plans = async () =>
  prisma.plan.groupBy({
    by: ["id_opisu"],
    _sum: {
      kwota: true,
    },
    where: {
      termin_platnosci: {
        gte: getStartDateFromEnv(),
        lte: getEndDateFromEnv(7),
      },
      is_deleted: false,
    },
  });
