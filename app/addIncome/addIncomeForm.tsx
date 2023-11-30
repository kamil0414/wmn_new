"use client";

import { useEffect, useRef, useState } from "react";
import {
  getEndDateFromEnv,
  getStartDateFromEnv,
  classNames,
  formatter,
} from "../../utils";
import { deleteIncome, saveIncome, saveWater } from "./actions";

interface FlatHistoryInterface {
  id: number;
  data: Date;
  naleznosc: number;
  opis: string | null;
  saldo: number;
  wplata: number;
  numer_mieszkania: number;
  isDuplicated: boolean;
}

function AddIncomeForm({
  basicData,
  blankNumbers,
  flatHistory,
}: {
  basicData: any[];
  blankNumbers: number[];
  flatHistory: FlatHistoryInterface[];
}) {
  const sumInput = useRef<HTMLInputElement>(null);
  const [flat, setFlat] = useState(1);

  const [waterMeterCurrentDate, setWaterMeterCurrentDate] = useState(
    getEndDateFromEnv().toISOString().split("T")[0],
  );
  const [paymentType, setPaymentType] = useState(false);
  const [waterMeterPreviousValue, setWaterMeterPreviousValue] = useState(0);
  const [waterMeterPreviousDate, setWaterMeterPreviousDate] = useState("");
  const [waterMeterPreviousType, setWaterMeterPreviousType] = useState(0);
  const [waterMeterCurrentValue, setWaterMeterCurrentValue] = useState(0);
  const [waterMeterCurrentMinValue, setWaterMeterCurrentMinValue] = useState(0);

  const [operationNumber, setOperationNumber] = useState("");
  const [operationSum, setOperationSum] = useState(0);
  const [operationSumFieldState, setOperationSumFieldState] = useState(false);
  const [defaultOptionChecked, setDefaultOptionChecked] = useState(true);
  const [waterMeterButtonState, setWaterMeterButtonState] = useState(true);

  const [operationDate, setOperationDate] = useState(
    getEndDateFromEnv().toISOString().split("T")[0],
  );
  const [balance, setBalance] = useState(0);

  const naleznosciRazem = flatHistory
    .filter((el) => el.numer_mieszkania === flat)
    .map((el) => el.naleznosc)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  const wplatyRazem = flatHistory
    .filter((el) => el.numer_mieszkania === flat)
    .map((el) => el.wplata)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  const { saldo } = flatHistory
    .filter((el) => el.numer_mieszkania === flat)
    .slice(-1)[0];

  const saveWaterMeterValue = () => {
    saveWater({
      numer_mieszkania: flat,
      data: new Date(waterMeterCurrentDate),
      stan: waterMeterCurrentValue,
      typ: 0,
    }).then(() => {
      setWaterMeterPreviousValue(waterMeterCurrentValue);
      setWaterMeterPreviousDate(waterMeterCurrentDate);
      setWaterMeterPreviousType(0);
      setWaterMeterCurrentDate(getEndDateFromEnv().toISOString().split("T")[0]);
      setWaterMeterCurrentValue(waterMeterCurrentValue);
      setWaterMeterButtonState(false);
    });
  };

  const saveOperation = () => {
    saveIncome({
      id_firmy: flat,
      data: new Date(operationDate),
      id_opisu: 22,
      rodzaj_i_numer_dowodu_ksiegowego: `${
        paymentType ? "Wyciąg nr" : "KP"
      } ${operationNumber}${
        paymentType
          ? ""
          : `/${getEndDateFromEnv().getFullYear().toString().slice(2, 4)}`
      }`,
      kwota: operationSum,
      czy_bank: paymentType,
      id_subkonta: 0,
    });
  };

  const defaultOptionClick = () => {
    setOperationSum(-1 * balance);
    if (sumInput.current) {
      sumInput.current.value = (-1 * balance).toString();
    }
    setOperationSumFieldState(false);
    setDefaultOptionChecked(!defaultOptionChecked);
  };

  const anotherOptionClick = () => {
    setOperationSum(0);
    if (sumInput.current) {
      sumInput.current.value = "0";
    }
    setOperationSumFieldState(!operationSumFieldState);
    setDefaultOptionChecked(!defaultOptionChecked);
  };

  useEffect(() => {
    const index = flat - 1;

    setWaterMeterCurrentDate(getEndDateFromEnv().toISOString().split("T")[0]);
    setOperationDate(getEndDateFromEnv().toISOString().split("T")[0]);
    setWaterMeterButtonState(true);

    if (basicData != null) {
      if (blankNumbers?.length > 0) {
        setOperationNumber(
          !basicData[index]?.platnosc_przelewem
            ? Math.max.apply(null, blankNumbers) + 1
            : "",
        );
      }
      if (basicData[index]?.saldo < 0) {
        setOperationSum(-1 * (basicData[index]?.saldo ?? 0));
        if (sumInput.current) {
          sumInput.current.value = (
            -1 * (basicData[index]?.saldo ?? 0)
          ).toString();
        }
      } else {
        setOperationSum(0);
        if (sumInput.current) {
          sumInput.current.value = "0";
        }
      }
      setPaymentType(basicData[index]?.platnosc_przelewem);
      setBalance(parseFloat(basicData[index]?.saldo));

      setWaterMeterPreviousValue(basicData[index]?.stan_wodomierza);
      setWaterMeterPreviousDate(
        basicData[index]?.data_odczytu_wodomierza.split("T")[0],
      );
      setWaterMeterPreviousType(basicData[index]?.typ_odczytu);
      setWaterMeterCurrentMinValue(basicData[index]?.stan_wodomierza);
      setWaterMeterCurrentValue(basicData[index]?.stan_wodomierza);
    }
  }, [basicData, flat, blankNumbers]);

  const deleteConfirm = (id: number) => {
    if (confirm("Usunąć wpłatę?")) {
      deleteIncome(id);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex ">
        <div>
          <div className="mt-6 block text-sm font-medium leading-6 text-gray-900 print:hidden">
            1. Wybierz numer mieszkania
          </div>
          <div className="rounded-md shadow-sm">
            <select
              onChange={(e) => setFlat(parseInt(e.target.value, 10))}
              className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
            >
              {basicData?.map((obj) => (
                <option key={obj.numer_mieszkania} value={obj.numer_mieszkania}>
                  {obj.numer_mieszkania}
                </option>
              ))}
            </select>{" "}
          </div>
        </div>
      </div>
      <hr className="mt-4 print:hidden" />

      <form className="print:hidden" action={saveWaterMeterValue}>
        <div className="mt-4 block text-sm font-medium leading-6 text-gray-900">
          2. Podaj odczyt wodomierza (opcjonalnie)
        </div>
        <div className="flex">
          <div className="mr-2 mt-2 flex grow rounded-md shadow-sm sm:flex-none">
            <input
              onChange={(e) =>
                setWaterMeterCurrentValue(
                  parseFloat(e.target.value.replace(",", ".")),
                )
              }
              min={waterMeterCurrentMinValue}
              step="any"
              value={waterMeterCurrentValue}
              type="number"
              name="watermeterCurrentValue"
              id="watermeterCurrentValue"
              className="w-full rounded-l-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
              placeholder="stan wodomierza"
            />
            <span className="inline-flex items-center rounded-none rounded-r-md border border-l-0 border-gray-300 px-3 text-gray-500 sm:text-sm">
              m3
            </span>
          </div>
          <div className="rounded-md shadow-sm">
            <input
              onChange={(e) => setWaterMeterCurrentDate(e.target.value)}
              min={waterMeterPreviousDate.slice(0, 10)}
              max={getEndDateFromEnv().toISOString().split("T")[0]}
              type="date"
              name="watermeterDate"
              id="watermeterDate"
              value={waterMeterCurrentDate}
              className="mt-2 inline-flex w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        {waterMeterCurrentValue - waterMeterPreviousValue > 0 && (
          <span className="my-2 block text-sm font-medium leading-6 text-gray-700">
            zużycie:{" "}
            <strong>
              {(waterMeterCurrentValue - waterMeterPreviousValue).toFixed(3)} m3
            </strong>
          </span>
        )}

        <span className="my-2 block text-sm font-medium leading-6 text-gray-700">
          ostatni odczyt: <strong>{waterMeterPreviousValue} m3</strong> z dnia{" "}
          {waterMeterPreviousDate.slice(0, 10)} ({waterMeterPreviousType})
        </span>

        <div className="flex justify-end sm:justify-start">
          <button
            type="submit"
            className="inline-flex justify-center rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 disabled:bg-gray-300"
            disabled={
              !(
                waterMeterCurrentValue > waterMeterPreviousValue &&
                flat != null &&
                waterMeterCurrentDate != null &&
                waterMeterPreviousDate !== waterMeterCurrentDate &&
                waterMeterButtonState
              )
            }
            id="saveButton"
          >
            Zapisz odczyt
          </button>
        </div>
      </form>

      <hr className="mt-4 print:hidden" />

      <form className="print:hidden" action={saveOperation}>
        <div className="mt-4 block text-sm font-medium leading-6 text-gray-900">
          3. Dowód wpłaty
        </div>
        <div className="flex">
          <div className="mr-2 mt-2 flex grow rounded-md shadow-sm sm:flex-none">
            <input
              onChange={(e) => setOperationNumber(e.target.value)}
              min={1}
              max={10000}
              value={operationNumber}
              type="number"
              name="operationNumber"
              id="operationNumber"
              className={classNames(
                paymentType ? "rounded-md" : "rounded-l-md",
                ", w-full border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6",
              )}
              placeholder={`numer ${paymentType ? "wyciągu" : "KP"}`}
            />
            {!paymentType && (
              <span className="inline-flex items-center rounded-none rounded-r-md border border-l-0 border-gray-300 px-3 text-gray-500 sm:text-sm">
                /{getEndDateFromEnv().getFullYear().toString().slice(2, 4)}
              </span>
            )}
          </div>
          <div className="rounded-md shadow-sm">
            <input
              onChange={(e) => setOperationDate(e.target.value)}
              min={getStartDateFromEnv().toISOString().split("T")[0]}
              max={getEndDateFromEnv().toISOString().split("T")[0]}
              type="date"
              name="operationDate"
              id="operationDate"
              value={operationDate}
              className="mt-2 inline-flex rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        {balance < 0 && (
          <div className="mb-2 mt-4 flex items-center">
            <input
              onChange={defaultOptionClick}
              checked={defaultOptionChecked}
              id="default-radio-1"
              type="radio"
              name="default-radio"
              className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 "
            />
            <label
              htmlFor="default-radio-1"
              className="ml-2 text-sm font-medium text-gray-900 "
            >{`zgodny z saldem (${formatter.format(-1 * balance)})`}</label>
          </div>
        )}
        <div className="mb-4 mt-2 flex items-center">
          <div className="mr-2 flex items-center">
            <input
              onChange={anotherOptionClick}
              checked={!defaultOptionChecked || balance >= 0}
              id="default-radio-2"
              type="radio"
              name="default-radio"
              className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 "
            />
            <div className="ml-2 text-sm font-medium text-gray-900 ">
              inna kwota
            </div>
          </div>

          {(operationSumFieldState || balance >= 0) && (
            <div className="flex items-center">
              <div className="flex rounded-md shadow-sm">
                <input
                  ref={sumInput}
                  onChange={(e) =>
                    setOperationSum(
                      parseFloat(e.target.value.replace(",", ".")),
                    )
                  }
                  type="number"
                  min={0}
                  step="any"
                  name="operationValue"
                  id="operationValue"
                  className="block w-full flex-1 rounded-l-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                  placeholder="wpisz kwotę"
                />
                <span className="inline-flex items-center rounded-none rounded-r-md border border-l-0 border-gray-300 px-3 text-gray-500 sm:text-sm">
                  zł
                </span>
              </div>

              {operationSum > 0 && balance + operationSum < 0 && (
                <span className="ml-2 block text-sm font-medium leading-6 text-gray-900">
                  pozostanie do zapłaty:{" "}
                  <strong>
                    {formatter.format(-1 * (balance + operationSum))}
                  </strong>
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end sm:justify-start">
          <button
            type="submit"
            className="inline-flex justify-center rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 disabled:bg-gray-300"
            disabled={
              !(
                flat != null &&
                operationDate != null &&
                paymentType != null &&
                operationNumber != null &&
                operationNumber !== "" &&
                operationSum != null &&
                operationSum > 0
              )
            }
          >
            Zapisz wpłatę
          </button>
        </div>
      </form>

      <hr className="mt-4 print:hidden" />

      <div className="mb-2 mt-4 text-left text-sm font-medium text-gray-700">
        Kartoteka
      </div>

      <div className="not-prose relative overflow-hidden bg-slate-50">
        <div className="relative overflow-auto">
          <div className="my-8 shadow-sm">
            <table className="w-full table-fixed border-collapse text-sm print:text-sm">
              <tbody className="bg-white">
                {flatHistory
                  .filter((el) => el.numer_mieszkania === flat)
                  .map((el, index, array) => {
                    const isDuplicated = array
                      .slice(0, index)
                      .some(
                        (prevEl) => prevEl.data.getTime() === el.data.getTime(),
                      );
                    return { ...el, isDuplicated };
                  })
                  .map((row) => (
                    <>
                      {!row.isDuplicated ? (
                        <tr key={`head_${row.id}`}>
                          <td
                            colSpan={3}
                            className="border-b border-slate-200 bg-slate-50 px-4 py-2.5 font-semibold"
                          >
                            {row.data.toLocaleDateString("pl-PL", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </td>
                        </tr>
                      ) : (
                        ""
                      )}
                      <tr
                        key={row.id}
                        className={classNames(
                          row.wplata !== 0 && "bg-sky-50",
                          " hover:bg-gray-100 focus:bg-gray-100",
                        )}
                      >
                        <td
                          className={classNames(
                            row.wplata !== 0 && "text-sky-800",
                            "min-h-[57px] border-b border-slate-200 p-2 pl-6 text-left font-medium",
                          )}
                        >
                          {formatter.format(row.wplata - row.naleznosc)}
                        </td>
                        <td className="border-b border-slate-200 p-2 text-xs print:whitespace-nowrap sm:pl-6">
                          {row.opis}
                        </td>

                        <td className="border-b border-slate-200 p-2">
                          <div className="align-center flex flex-col items-end">
                            {row.wplata > 0 ? (
                              <form
                                className="mb-1 text-right"
                                action={() => deleteConfirm(row.id)}
                              >
                                <button
                                  type="submit"
                                  className="font-medium text-sky-600"
                                >
                                  Usuń
                                </button>
                              </form>
                            ) : (
                              ""
                            )}
                            <div
                              className={classNames(
                                row?.saldo < 0 ? "text-red-500" : "",
                                "text-right text-xs ",
                              )}
                            >
                              S:&nbsp;{formatter.format(row?.saldo)}
                            </div>
                          </div>
                        </td>
                      </tr>
                    </>
                  ))}
                {/* {flatHistory != null && flatHistory?.length !== 0 && (
                  <tr>
                    <td className="p-4 text-right ">
                      {" "}
                      {formatter.format(wplatyRazem - naleznosciRazem) ===
                      formatter.format(saldo)
                        ? "SUMA"
                        : "BŁĄD SUM"}
                    </td>
                    <td className="p-2 text-right ">
                      {formatter.format(naleznosciRazem)}
                    </td>
                    <td className="p-2 py-2 text-right text-sm">
                      {formatter.format(wplatyRazem)}
                    </td>
                  </tr>
                )} */}
                {(flatHistory == null || flatHistory?.length === 0) && (
                  <tr>
                    <td
                      colSpan={5}
                      className="border-b border-slate-200 p-4 text-center "
                    >
                      {flatHistory?.length === 0 ? "brak operacji" : ""}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 rounded-xl border border-black/5" />
      </div>
    </div>
  );
}

export default AddIncomeForm;
