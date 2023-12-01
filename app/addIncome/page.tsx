import prisma from "../../lib/prisma";
import { getStartDateFromEnv, getEndDateFromEnv } from "../../utils";
import AddIncomeForm from "./addIncomeForm";

async function AddIncome() {
  const basicData: any = await prisma.$queryRawUnsafe(
    `select * from PodajDanePomonicze()`,
  );

  const blankNumbers = await prisma.numeryKP.findMany();

  const flatHistory = await prisma.kartoteki.findMany({
    select: {
      id: true,
      data: true,
      naleznosc: true,
      opis: true,
      rodzaj_i_numer_dowodu_ksiegowego: true,
      saldo: true,
      wplata: true,
      numer_mieszkania: true,
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
      basicData={basicData.map((el) => ({
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
      }))}
    />
  );
}

export default AddIncome;
