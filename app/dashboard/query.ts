import { getStartDateFromEnv, getEndDateFromEnv } from "@/utils/index";
import prisma from "@/lib/prisma";

export const basicData = await prisma.saldo.findMany();

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
