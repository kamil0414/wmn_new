"use client";

import React, { useEffect, useOptimistic, useRef, useState } from "react";
import {
  getEndDateFromEnv,
  getStartDateFromEnv,
  classNames,
  formatter,
} from "@/utils/index";
import { deleteIncome, saveIncome, saveWater } from "./actions";

interface FlatHistoryInterface {
  id: number;
  data: Date;
  naleznosc: number;
  opis: string | null;
  typ_dowodu_ksiegowego: string | null;
  numer_dowodu_ksiegowego: string | null;
  saldo: number;
  wplata: number;
  numer_mieszkania: number;
  poprzedni_odczyt_wodomierza?: number;
  odczyt_wodomierza?: number;
  data_poprzedniego_odczytu_wodomierza: Date | null;
  data_odczytu_wodomierza: Date | null;
  stawka?: number;
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
  const [loading, setLoading] = useOptimistic(false, (state) => !state);
  const sumInput = useRef<HTMLInputElement>(null);
  const waterMeterInput = useRef<HTMLInputElement>(null);
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

  // const naleznosciRazem = flatHistory
  //   .filter((el) => el.numer_mieszkania === flat)
  //   .map((el) => el.naleznosc)
  //   .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  // const wplatyRazem = flatHistory
  //   .filter((el) => el.numer_mieszkania === flat)
  //   .map((el) => el.wplata)
  //   .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  // const { saldo } = flatHistory
  //   .filter((el) => el.numer_mieszkania === flat)
  //   .slice(-1)[0];

  const saveWaterMeterValue = async () => {
    const response = await saveWater({
      numer_mieszkania: flat,
      data: new Date(waterMeterCurrentDate),
      stan: waterMeterCurrentValue,
      typ: 0,
    });

    if (response?.message) {
      alert(response?.message);
    } else {
      setWaterMeterPreviousValue(waterMeterCurrentValue);
      setWaterMeterPreviousDate(waterMeterCurrentDate);
      setWaterMeterPreviousType(0);
      setWaterMeterCurrentDate(getEndDateFromEnv().toISOString().split("T")[0]);
      setWaterMeterCurrentValue(waterMeterCurrentValue);
      setWaterMeterButtonState(false);
    }
  };

  const saveOperation = async () => {
    setLoading(true);
    const response = await saveIncome({
      id_firmy: flat,
      data: new Date(operationDate),
      id_opisu: 22,
      id_typu_dowodu_ksiegowego: paymentType ? 1 : 0,
      numer_dowodu_ksiegowego: `${operationNumber}${
        !paymentType
          ? `/${getEndDateFromEnv().getFullYear().toString().slice(2, 4)}`
          : ""
      }`,
      kwota: operationSum,
      czy_bank: paymentType,
      id_subkonta: 0,
    });

    if (response?.message) {
      alert(response?.message);
    }
    setLoading(false);
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
            ? (Math.max.apply(null, blankNumbers) + 1).toString()
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flat]);

  const deleteConfirm = async (id: number, isWaterBill: boolean) => {
    if (confirm(`Usunąć ${!isWaterBill ? "wpłatę" : "naliczenie"}?`)) {
      const response = await deleteIncome(id, isWaterBill);

      if (response?.message) {
        alert(response?.message);
      }
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex">
        <div>
          <div className="mt-6 block text-sm font-medium leading-6 text-slate-900 print:hidden">
            1. Wybierz numer mieszkania
          </div>
          <div className="rounded-md shadow-sm">
            <select
              onChange={(e) => setFlat(parseInt(e.target.value, 10))}
              className="mt-2 block w-full rounded-md border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
            >
              {basicData?.map((obj) => (
                <option key={obj.numer_mieszkania} value={obj.numer_mieszkania}>
                  {obj.numer_mieszkania}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <hr className="mt-4 print:hidden" />

      <form className="print:hidden" action={saveWaterMeterValue}>
        <div className="mt-4 block text-sm font-medium leading-6 text-slate-900">
          2. Podaj odczyt wodomierza (opcjonalnie)
        </div>
        <div className="flex gap-x-2">
          <div className="mt-2 flex w-[135px] rounded-md shadow-sm sm:flex-none">
            <input
              ref={waterMeterInput}
              onChange={(e) =>
                setWaterMeterCurrentValue(parseFloat(e.target.value))
              }
              onKeyDown={(evt) =>
                ["e", "E", "+", "-", "."].includes(evt.key) &&
                evt.preventDefault()
              }
              min={waterMeterCurrentMinValue}
              step="any"
              value={waterMeterCurrentValue}
              type="number"
              name="watermeterCurrentValue"
              id="watermeterCurrentValue"
              className="w-full rounded-l-md border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
              placeholder="stan wodomierza"
            />
            <span className="inline-flex rounded-none rounded-r-md border border-l-0 border-slate-300 px-3 pt-2 text-slate-500 sm:text-sm">
              m<sub>3</sub>
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
              className="mt-2  inline-flex w-[135px] rounded-md border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        {waterMeterCurrentValue - waterMeterPreviousValue > 0 && (
          <span className="my-2 block text-sm font-medium leading-6 text-slate-700">
            zużycie:{" "}
            <strong>
              {(waterMeterCurrentValue - waterMeterPreviousValue).toFixed(3)} m3
            </strong>
          </span>
        )}

        <span className="my-2 block text-sm font-medium leading-6 text-slate-700">
          ostatni odczyt: <strong>{waterMeterPreviousValue} m3</strong> z dnia{" "}
          {waterMeterPreviousDate.slice(0, 10)} ({waterMeterPreviousType})
        </span>

        <div className="flex justify-end sm:justify-start">
          <button
            type="submit"
            className="inline-flex justify-center rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 disabled:bg-slate-300 print:hidden"
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
        <div className="mt-4 block text-sm font-medium leading-6 text-slate-900">
          3. Dowód wpłaty
        </div>
        <div className="flex">
          <div className="mr-2 mt-2 flex w-[135px] rounded-md shadow-sm sm:flex-none">
            <input
              onChange={(e) => setOperationNumber(e.target.value)}
              onKeyDown={(evt) =>
                ["e", "E", "+", "-", "."].includes(evt.key) &&
                evt.preventDefault()
              }
              min={1}
              max={10000}
              value={operationNumber}
              type="number"
              name="operationNumber"
              id="operationNumber"
              className={classNames(
                paymentType ? "rounded-md" : "rounded-l-md",
                "w-full border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6",
              )}
              placeholder={`numer ${paymentType ? "wyciągu" : "KP"}`}
            />
            {!paymentType && (
              <span className="inline-flex items-center rounded-none rounded-r-md border border-l-0 border-slate-300 px-3 text-slate-500 sm:text-sm">
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
              className="mt-2 inline-flex w-[135px] rounded-md border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
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
              className="h-4 w-4 border-slate-300 bg-slate-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <label
              htmlFor="default-radio-1"
              className="ml-2 text-sm font-medium text-slate-900"
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
              className="h-4 w-4 border-slate-300 bg-slate-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <div className="ml-2 text-sm font-medium text-slate-900">
              inna kwota
            </div>
          </div>

          {(operationSumFieldState || balance >= 0) && (
            <div className="flex items-center">
              <div className="flex rounded-md shadow-sm">
                <input
                  ref={sumInput}
                  onChange={(e) => setOperationSum(parseFloat(e.target.value))}
                  onKeyDown={(evt) =>
                    ["e", "E", "+", "-", "."].includes(evt.key) &&
                    evt.preventDefault()
                  }
                  type="number"
                  min={0}
                  step="any"
                  name="operationValue"
                  id="operationValue"
                  className="block w-full flex-1 rounded-l-md border-0 py-1.5 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                  placeholder="wpisz kwotę"
                />
                <span className="inline-flex items-center rounded-none rounded-r-md border border-l-0 border-slate-300 px-3 text-slate-500 sm:text-sm">
                  zł
                </span>
              </div>

              {operationSum > 0 && balance + operationSum < 0 && (
                <span className="ml-2 block text-sm font-medium leading-6 text-slate-900">
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
            className="inline-flex justify-center rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 disabled:bg-slate-300 print:hidden"
            disabled={
              !(
                flat != null &&
                operationDate != null &&
                paymentType != null &&
                operationNumber != null &&
                operationNumber !== "" &&
                operationSum != null &&
                operationSum > 0
              ) || loading
            }
          >
            Zapisz wpłatę
          </button>
        </div>
      </form>

      <div className="relative mb-2 mt-6 overflow-hidden">
        <div className="relative overflow-auto">
          <div className="my-8 overflow-hidden shadow-sm">
            <table className="w-full table-fixed border-collapse text-sm print:text-sm">
              <thead>
                <tr>
                  <td colSpan={3} className="border-b border-slate-100">
                    <div className="flex items-center justify-between  px-5 pb-8">
                      <div className="text-base font-semibold">Kartoteka</div>
                    </div>
                  </td>
                </tr>
              </thead>
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
                    <React.Fragment key={row.id}>
                      {!row.isDuplicated ? (
                        <tr>
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
                          "hover:bg-gray-100 focus:bg-gray-100",
                        )}
                      >
                        <td className="border-b border-slate-200 p-2 pl-6">
                          <div className="inline-flex flex-col items-start">
                            <div
                              className={classNames(
                                row.wplata !== 0 && "text-sky-800",
                                "mb-1 font-medium",
                              )}
                            >
                              {formatter.format(row.wplata - row.naleznosc)}
                            </div>
                            <div
                              className={classNames(
                                row.saldo < 0
                                  ? "text-red-500"
                                  : "text-slate-500",
                                "text-xs",
                              )}
                            >
                              {formatter.format(row.saldo)}
                            </div>
                          </div>
                        </td>
                        <td className="border-b border-slate-200 p-2 print:whitespace-nowrap sm:pl-6">
                          <div className="mb-1 flex grow items-center gap-x-2">
                            <div>{row.opis}</div>
                            {row.poprzedni_odczyt_wodomierza &&
                              row.odczyt_wodomierza && (
                                <span className="inline-flex items-center rounded-md bg-sky-50 px-2 py-1 text-xs font-medium text-sky-700 ring-1 ring-inset ring-sky-700/10">
                                  {Math.round(
                                    (row.odczyt_wodomierza -
                                      row.poprzedni_odczyt_wodomierza) *
                                      1000,
                                  ) / 1000}
                                  m<sup>3</sup>
                                </span>
                              )}
                          </div>

                          <div className="text-xs text-slate-500">
                            {row.data_poprzedniego_odczytu_wodomierza &&
                              row.data_odczytu_wodomierza && (
                                <>
                                  {row.data_poprzedniego_odczytu_wodomierza?.toLocaleDateString(
                                    "pl-PL",
                                    {
                                      year: "numeric",
                                      month: "numeric",
                                      day: "numeric",
                                    },
                                  )}
                                  {" - "}
                                  {row.data_odczytu_wodomierza?.toLocaleDateString(
                                    "pl-PL",
                                    {
                                      year: "numeric",
                                      month: "numeric",
                                      day: "numeric",
                                    },
                                  )}
                                </>
                              )}
                            {row.poprzedni_odczyt_wodomierza &&
                              row.odczyt_wodomierza &&
                              row.stawka && (
                                <>
                                  {" ("}
                                  {row.odczyt_wodomierza}
                                  {" - "}
                                  {row.poprzedni_odczyt_wodomierza}
                                  {") x "}
                                  {row.stawka}
                                </>
                              )}
                          </div>
                        </td>

                        <td className="border-b border-slate-200 p-2">
                          <div className="align-center flex flex-col items-end">
                            {row.wplata > 0 ||
                            row.odczyt_wodomierza === waterMeterCurrentValue ? (
                              <form
                                className="mb-1 text-right print:hidden"
                                action={() =>
                                  deleteConfirm(
                                    row.id,
                                    row.odczyt_wodomierza ===
                                      waterMeterCurrentValue,
                                  )
                                }
                              >
                                <button
                                  type="submit"
                                  className="font-medium text-red-600"
                                >
                                  Usuń
                                </button>
                              </form>
                            ) : (
                              ""
                            )}
                            <div className="text-right text-xs">
                              {row.typ_dowodu_ksiegowego}{" "}
                              {row.numer_dowodu_ksiegowego}
                            </div>
                          </div>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                {/* {flatHistory != null && flatHistory?.length !== 0 && (
                  <tr>
                    <td className="p-4 text-right">
                      {""}
                      {formatter.format(wplatyRazem - naleznosciRazem) ===
                      formatter.format(saldo)
                        ?"SUMA"
                        :"BŁĄD SUM"}
                    </td>
                    <td className="p-2 text-right">
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
                      className="border-b border-slate-200 p-4 text-center"
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
