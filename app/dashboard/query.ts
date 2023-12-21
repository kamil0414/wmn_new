import { getStartDateFromEnv, getEndDateFromEnv } from "@/utils/index";
import prisma from "@/lib/prisma";

export const basicDataRaw = await prisma.saldo.findMany();

export const basicData = basicDataRaw.map((el) => ({
  ...el,
  zuzycie: el.zuzycie.toNumber(),
}));

export const reminders = await prisma.przypomnienie.findMany({
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
