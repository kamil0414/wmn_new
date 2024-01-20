import { getStartDateFromEnv, getEndDateFromEnv } from "@/utils/index";
import prisma from "@/lib/prisma";

export const basicDataRaw = async () => prisma.saldo.findMany();

export const basicData = async () =>
  (await basicDataRaw()).map((el) => ({
    ...el,
    zuzycie: el.zuzycie ? el.zuzycie.toNumber() : 0,
  }));

export const reminders = async () =>
  prisma.przypomnienie.findMany({
    where: {
      data: {
        gte: getStartDateFromEnv(),
        lte: getEndDateFromEnv(7),
      },
      is_deleted: false,
      czy_wykonane: false,
    },
    orderBy: {
      data: "asc",
    },
  });
