import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { classNames, fetcher, formatter, usePrevious } from "../utils";
import useSWR, { useSWRConfig } from "swr";
import Link from "next/link";

const AddIncome: React.FC<any> = (props) => {
  const { mutate } = useSWRConfig();

  const [flat, setFlat] = useState(1);
  const prevFlat = usePrevious(flat);

  const { data: basicData, error: basicDataError } = useSWR(
    "/api/basicData",
    fetcher
  );
  const prevBasicData = usePrevious(basicData);

  const { data: blankNumbers, error: blankNumbersError } = useSWR(
    "/api/blankNumbers",
    fetcher
  );
  const prevBlankNumbers = usePrevious(blankNumbers);

  const { data: flatHistory, error: flatHistoryError } = useSWR(
    `/api/flatHistory?flat_number=${flat}`,
    fetcher
  );

  const saveWaterMeterValue = (e) => {
    e.preventDefault();
    fetch(`/api/waterMeters`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        numer_mieszkania: flat,
        data: waterMeterCurrentDate,
        stan: waterMeterCurrentValue,
        typ: 0,
      }),
    })
      .then((response) => {
        if (response.ok) {
          setWaterMeterPreviousValue(waterMeterCurrentValue);
          setWaterMeterPreviousDate(waterMeterCurrentDate);
          setWaterMeterPreviousType(0);
          setWaterMeterCurrentDate(new Date().toISOString().split("T")[0]);
          setWaterMeterCurrentValue(waterMeterCurrentValue);
          mutate("/api/basicData");
          mutate(`/api/flatHistory/?flat_number=${flat}`);
          setWaterMeterButtonState(false);
          setShowfeedback(true);
        } else {
          setShowfeedback(false);
        }
      })
      .catch(() => {
        setShowfeedback(false);
      });
  };

  const saveOperation = (e) => {
    e.preventDefault();
    fetch(`/api/operations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_firmy: flat,
        data: operationDate,
        rodzaj_i_numer_dowodu_ksiegowego: `${
          paymentType ? "Wyciąg nr" : "KP"
        } ${operationNumber}${
          paymentType
            ? ""
            : `/${new Date().getFullYear().toString().slice(2, 4)}`
        }`,
        opis: "Opłaty bieżące",
        kwota: operationSum,
        czy_bank: paymentType,
        id_subkonta: 0, // always 0 for incomes
      }),
    })
      .then((response) => {
        if (response.ok) {
          setShowfeedback2(true);
          mutate("/api/basicData");
          mutate("/api/accountBalance");
          mutate(`/api/flatHistory/?flat_number=${flat}`);

          if (!paymentType) {
            mutate("/api/blankNumbers");
          }
        } else {
          setShowfeedback2(false);
        }
      })
      .catch(() => {
        setShowfeedback2(false);
      });
  };

  const [paymentType, setPaymentType] = useState();

  const [waterMeterPreviousValue, setWaterMeterPreviousValue] = useState(0);
  const [waterMeterPreviousDate, setWaterMeterPreviousDate] = useState("");
  const [waterMeterPreviousType, setWaterMeterPreviousType] = useState(0);
  const [waterMeterCurrentValue, setWaterMeterCurrentValue] = useState(0);
  const [waterMeterCurrentMinValue, setWaterMeterCurrentMinValue] = useState(0);
  const [waterMeterCurrentDate, setWaterMeterCurrentDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [operationNumber, setOperationNumber] = useState();
  const [operationSum, setOperationSum] = useState(0);
  const [operationSumFieldState, setOperationSumFieldState] = useState(false);
  const [defaultOptionChecked, setDefaultOptionChecked] = useState(true);
  const [waterMeterButtonState, setWaterMeterButtonState] = useState(true);
  const [showfeedback, setShowfeedback] = useState(null);
  const [showfeedback2, setShowfeedback2] = useState(null);

  const [operationDate, setOperationDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [balance, setBalance] = useState(0);

  const defaultOptionClick = () => {
    setOperationSum(-1 * balance);
    setOperationSumFieldState(false);
    setDefaultOptionChecked(!defaultOptionChecked);
  };

  const anotherOptionClick = () => {
    setOperationSum(0);
    setOperationSumFieldState(!operationSumFieldState);
    setDefaultOptionChecked(!defaultOptionChecked);
  };

  useEffect(() => {
    const index = flat - 1;

    setWaterMeterCurrentDate(new Date().toISOString().split("T")[0]);
    setOperationDate(new Date().toISOString().split("T")[0]);
    setWaterMeterButtonState(true);
    setShowfeedback(null);
    setShowfeedback2(null);

    if (basicData != null) {
      if (blankNumbers?.length > 0) {
        setOperationNumber(
          !basicData[index]?.platnosc_przelewem
            ? Math.max.apply(null, blankNumbers) + 1
            : ""
        );
      }
      if (basicData[index]?.saldo < 0) {
        setOperationSum(-1 * basicData[index]?.saldo);
      } else {
        setOperationSum(0);
      }
      setPaymentType(basicData[index]?.platnosc_przelewem);
      setBalance(parseFloat(basicData[index]?.saldo));

      setWaterMeterPreviousValue(basicData[index]?.stan_wodomierza);
      setWaterMeterPreviousDate(
        basicData[index]?.data_odczytu_wodomierza.split("T")[0]
      );
      setWaterMeterPreviousType(basicData[index]?.typ_odczytu);
      setWaterMeterCurrentMinValue(basicData[index]?.stan_wodomierza);
      setWaterMeterCurrentValue(basicData[index]?.stan_wodomierza);
    }
  }, [basicData, flat, blankNumbers]);

  // const Message = () => (
  //   <MessageBar
  //     messageBarType={
  //       showfeedback ? MessageBarType.success : MessageBarType.error
  //     }
  //     isMultiline={false}
  //   >
  //     {showfeedback ? "Zapisano" : "Wystąpił błąd"}
  //   </MessageBar>
  // );

  // const Message2 = () => (
  //   <MessageBar
  //     messageBarType={
  //       showfeedback2 ? MessageBarType.success : MessageBarType.error
  //     }
  //     isMultiline={false}
  //   >
  //     {showfeedback2 ? "Zapisano" : "Wystąpił błąd"}
  //   </MessageBar>
  // );

  return (
    <Layout>
      <div className="container mx-auto px-4">
        <div className="flex">
          <div>
            <label
              htmlFor="countries"
              className="block text-sm font-medium leading-6 text-gray-900 mt-6"
            >
              1. Wybierz numer mieszkania
            </label>
            <select
              onChange={(e) => setFlat(parseInt(e.target.value))}
              className="block w-full flex-1 rounded-md border-0 mt-2 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
            >
              {/* <option selected>Wybierz numer mieszkania</option> */}
              {basicData?.map((obj) => (
                <option
                  key={obj["numer_mieszkania"]}
                  value={obj["numer_mieszkania"]}
                >
                  {obj["numer_mieszkania"]}
                </option>
              ))}
            </select>
          </div>
        </div>
        <hr className="mt-6"></hr>

        <form>
          <label
            htmlFor="company-website"
            className="block text-sm font-medium leading-6 text-gray-900 mt-6"
          >
            2. Podaj odczyt wodomierza (opcjonalnie)
          </label>
          <div className="flex items-end">
            <div className="mr-1 flex rounded-md shadow-sm grow sm:flex-none">
              <input
                onChange={(e) =>
                  setWaterMeterCurrentValue(
                    parseFloat(e.target.value.replace(",", "."))
                  )
                }
                min={waterMeterCurrentMinValue}
                value={waterMeterCurrentValue}
                type="number"
                name="watermeterCurrentValue"
                id="watermeterCurrentValue"
                className="block w-full flex-1 rounded-l-md border-0 mt-2 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                placeholder="stan wodomierza"
              />
              <span className="inline-flex items-center rounded-none rounded-r-md mt-2 border border-l-0 border-gray-300 px-3 text-gray-500 sm:text-sm">
                m3
              </span>
            </div>

            <div className="mt-2 flex rounded-md shadow-sm grow sm:flex-none">
              <input
                onChange={(e) => setWaterMeterCurrentDate(e.target.value)}
                min={
                  new Date(new Date().getFullYear(), 0, 2)
                    .toISOString()
                    .split("T")[0]
                }
                max={new Date().toISOString().split("T")[0]}
                type="date"
                name="watermeterDate"
                id="watermeterDate"
                value={waterMeterCurrentDate}
                className="block w-full flex-1 rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          {waterMeterCurrentValue - waterMeterPreviousValue > 0 && (
            <span className="block text-sm font-medium leading-6 text-gray-700 my-2">
              zużycie:{" "}
              <strong>
                {(waterMeterCurrentValue - waterMeterPreviousValue).toFixed(3)}{" "}
                m3
              </strong>
            </span>
          )}

          <span className="block text-sm font-medium leading-6 text-gray-700 my-2">
            ostatni odczyt: <strong>{waterMeterPreviousValue} m3</strong> z dnia{" "}
            {waterMeterPreviousDate.slice(0, 10)} ({waterMeterPreviousType})
          </span>

          <div className="flex sm:justify-start justify-end">
            <button
              className="disabled:bg-gray-300 inline-flex justify-center rounded-md bg-sky-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
              disabled={
                !(
                  waterMeterCurrentValue > waterMeterPreviousValue &&
                  flat != null &&
                  waterMeterCurrentDate != null &&
                  waterMeterPreviousDate !== waterMeterCurrentDate &&
                  waterMeterButtonState
                )
              }
              onClick={(e) => saveWaterMeterValue(e)}
              id="saveButton"
            >
              Zapisz odczyt
            </button>
          </div>
        </form>

        <hr className="mt-6"></hr>

        <form>
          <label
            htmlFor="company-website"
            className="block text-sm font-medium leading-6 text-gray-900 mt-6"
          >
            3. Dowód wpłaty
          </label>
          <div className="flex">
            <div className="mt-2 mr-1 flex rounded-md shadow-sm grow sm:flex-none">
              <input
                onChange={(e) => setOperationNumber(e.target.value)}
                min={1}
                max={10000}
                value={operationNumber}
                type="number"
                name="operationNumber"
                id="operationNumber"
                className={classNames(
                  paymentType ? "rounded" : "rounded-l-md",
                  ", block w-full flex-1 border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                )}
                placeholder={`numer ${paymentType ? "wyciągu" : "KP"}`}
              />
              {!paymentType && (
                <span className="inline-flex items-center rounded-none rounded-r-md border border-l-0 border-gray-300 px-3 text-gray-500 sm:text-sm">
                  /{new Date().getFullYear().toString().slice(2, 4)}
                </span>
              )}
            </div>

            <div className="mt-2 flex rounded-md shadow-sm grow sm:flex-none">
              <input
                onChange={(e) => setOperationDate(e.target.value)}
                min={
                  new Date(new Date().getFullYear(), 0, 2)
                    .toISOString()
                    .split("T")[0]
                }
                max={new Date().toISOString().split("T")[0]}
                type="date"
                name="operationDate"
                id="operationDate"
                value={operationDate}
                className="block w-full flex-1 rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          {balance < 0 && (
            <div className="flex items-center mt-4 mb-2">
              <input
                onChange={defaultOptionClick}
                checked={defaultOptionChecked}
                id="default-radio-1"
                type="radio"
                name="default-radio"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2 "
              />
              <label
                htmlFor="default-radio-1"
                className="ml-2 text-sm font-medium text-gray-900 "
              >{`zgodny z naliczeniami (${formatter.format(
                -1 * balance
              )})`}</label>
            </div>
          )}
          <div className="flex items-center mt-2 mb-4">
            <div className="flex items-center mr-2">
              <input
                onChange={anotherOptionClick}
                checked={!defaultOptionChecked || balance >= 0}
                id="default-radio-2"
                type="radio"
                name="default-radio"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2 "
              />
              <label
                htmlFor="default-radio-2"
                className="ml-2 text-sm font-medium text-gray-900 "
              >
                inna kwota
              </label>
            </div>

            {(operationSumFieldState || balance >= 0) && (
              <div className="flex items-center">
                <div className="flex rounded-md shadow-sm">
                  <input
                    onChange={(e) =>
                      setOperationSum(
                        parseFloat(e.target.value.replace(",", "."))
                      )
                    }
                    value={operationSum}
                    type="number"
                    min={0}
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
                  <span className="block text-sm font-medium leading-6 text-gray-900 ml-2">
                    pozostanie do zapłaty: {""}
                    <strong>
                      {formatter.format(-1 * (balance + operationSum))}
                    </strong>
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex sm:justify-start justify-end">
            <Link href="/">
              <button className="mr-2 disabled:bg-gray-300 inline-flex justify-center rounded-md bg-gray-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500">
                Anuluj
              </button>
            </Link>

            <button
              className="disabled:bg-gray-300 inline-flex justify-center rounded-md bg-sky-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
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
              onClick={(e) => saveOperation(e)}
            >
              Zapisz wpłatę
            </button>
          </div>
        </form>

        <hr className="mt-6"></hr>

        <div className="text-sm font-medium text-gray-700 mt-6 mb-2">
          Kartoteka
        </div>

        <div className="not-prose relative bg-slate-50 overflow-hidden ">
          <div className="relative overflow-auto">
            <div className="shadow-sm overflow-hidden my-8">
              <table className="border-collapse table-auto w-full text-sm">
                <thead>
                  <tr>
                    <th className="border-b font-medium pr-2 pl-4 pt-0 pb-2 text-slate-400 text-left">
                      Data
                    </th>
                    <th className="border-b font-medium p-2 pt-0 text-slate-400 text-left">
                      Opis
                    </th>
                    <th className="border-b font-medium p-2 pt-0 text-slate-400 text-left">
                      Należność
                    </th>
                    <th className="border-b font-medium p-2 pt-0 text-slate-400 text-left">
                      Wpłata
                    </th>
                    <th className="border-b font-medium pr-4 pl-2 pt-0 pb-2 text-slate-400 text-left">
                      Saldo
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {flatHistory?.map((row, i) => (
                    <tr key={i}>
                      <td className="border-b border-slate-200 pr-2 pl-4 py-2 text-slate-500">
                        {row.data.split("T")[0]}
                      </td>
                      <td className="border-b border-slate-200 p-2 text-slate-500">
                        {row.opis}
                      </td>
                      <td className="border-b border-slate-200 p-2 text-slate-500">
                        {formatter.format(row.naleznosc)}
                      </td>
                      <td className="border-b border-slate-200 pr-4 pl-2 py-2 text-slate-500">
                        {formatter.format(row.wplata)}
                      </td>
                      <td
                        className={classNames(
                          row.saldo < 0 ? "text-red-500" : "text-slate-500",
                          "border-b border-slate-200 pr-4 pl-2 py-2"
                        )}
                      >
                        {formatter.format(row.saldo)}
                      </td>
                    </tr>
                  ))}
                  {(flatHistory == null || flatHistory?.length === 0) && (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center border-b border-slate-200 p-4 text-slate-500"
                      >
                        {flatHistory?.length === 0
                          ? "brak operacji"
                          : "ładowanie..."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="absolute inset-0 pointer-events-none border border-black/5 rounded-xl"></div>
        </div>
      </div>
    </Layout>
  );
};

export default AddIncome;
