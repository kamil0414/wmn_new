import AddIncomeForm from "./form";
import { basicData, blankNumbers, flatHistory } from "./query";

async function AddIncome() {
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
        stawka: el.stawka?.toNumber(),
      }))}
    />
  );
}

export default AddIncome;
