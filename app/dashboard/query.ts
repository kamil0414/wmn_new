import { getStartDateFromEnv, getEndDateFromEnv } from "@/utils/index";
import prisma from "@/lib/prisma";

const getBasicDataRaw = async () => prisma.saldo.findMany();

export const getBasicData = async () =>
  (await getBasicDataRaw()).map((el) => ({
    ...el,
    zuzycie: el.zuzycie ? el.zuzycie.toNumber() : 0,
  }));

export const getReminders = async () =>
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
