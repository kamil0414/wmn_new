import prisma from "@/lib/prisma";
import { getStartDateFromEnv, getEndDateFromEnv } from "@/utils/index";
import AddIncomeForm from "./form";

async function AddIncome() {
  const basicData: any = await prisma.$queryRawUnsafe(
    `select * from PodajDanePomonicze()`,
  );

  const blankNumbers = await prisma.numerKP.findMany();

  const flatHistory = await prisma.kartoteka.findMany({
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

  return (
    <AddIncomeForm
      basicData={basicData.map((el: any) => ({
        ...el,
        razem: el.razem.toNumber(),
        saldo: el.saldo.toNumber(),
        data_odczytu_wodomierza: el.data_odczytu_wodomierza.toISOString(),
        stan_wodomierza: el.stan_wodomierza.toNumber(),
      }))}
      blankNumbers={blankNumbers.map((el) => el.nr)}
      flatHistory={flatHistory.map((el) => ({
        ...el,
        naleznosc: el.naleznosc.toNumber(),
        saldo: el.saldo.toNumber(),
        wplata: el.wplata.toNumber(),
        poprzedni_odczyt_wodomierza: el.poprzedni_odczyt_wodomierza?.toNumber(),
        odczyt_wodomierza: el.odczyt_wodomierza?.toNumber(),
      }))}
    />
  );
}

export default AddIncome;
