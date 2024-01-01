import { getStartDateFromEnv, getEndDateFromEnv } from "@/utils/index";
import prisma from "@/lib/prisma";

export const basicData: any = async () =>
  prisma.$queryRawUnsafe(`select * from PodajDanePomonicze()`);

export const blankNumbers = async () => prisma.numerKP.findMany();

export const flatHistory = async () =>
  prisma.kartoteka.findMany({
    select: {
      id: true,
      data: true,
      naleznosc: true,
      opis: true,
      typ_dowodu_ksiegowego: true,
      numer_dowodu_ksiegowego: true,
      saldo: true,
      wplata: true,
      numer_mieszkania: true,
      poprzedni_odczyt_wodomierza: true,
      odczyt_wodomierza: true,
      data_poprzedniego_odczytu_wodomierza: true,
      data_odczytu_wodomierza: true,
      stawka: true,
    },
    where: {
      data: {
        gte: getStartDateFromEnv(),
        lte: new Date(
          Math.max(
            getEndDateFromEnv().setDate(10),
            getEndDateFromEnv().getTime(),
          ),
        ),
      },
    },
    orderBy: [{ numer_mieszkania: "asc" }, { data: "desc" }, { opis: "desc" }],
  });
