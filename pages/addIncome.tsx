import React, { Fragment, useEffect, useState } from "react";
import Layout from "../components/Layout";
// import {
//   TextField,
//   Separator,
//   PrimaryButton,
//   Checkbox,
//   Label,
//   MessageBar,
//   MessageBarType,
// } from "@fluentui/react";
import { classNames, fetcher, formatter, usePrevious } from "../utils";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import useSWR, { useSWRConfig } from "swr";

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

  const saveOperation = () => {
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
          mutate(`/api/flatHistory/?flat_number=${flat}`);
          mutate("/api/accountBalance");

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
  const [accountVoucher, setAccountVoucher] = useState();

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

  const operationValueChanged = (event, value) => {
    setOperationSum(parseFloat(value.replace(",", ".")));
  };

  useEffect(() => {
    if (prevFlat !== flat && prevFlat != null) {
      setWaterMeterCurrentDate(new Date().toISOString().split("T")[0]);
      setWaterMeterButtonState(true);
      setShowfeedback(null);
      setShowfeedback2(null);
    }

    const index = flat - 1;

    if (prevBasicData !== basicData && basicData.length > 0) {
      setBalance(parseFloat(basicData[index]?.saldo));

      setWaterMeterPreviousValue(basicData[index]?.stan_wodomierza);
      setWaterMeterPreviousDate(
        basicData[index]?.data_odczytu_wodomierza.split("T")[0]
      );
      setWaterMeterPreviousType(basicData[index]?.typ_odczytu);
      setWaterMeterCurrentValue(basicData[index]?.stan_wodomierza);
      setWaterMeterCurrentMinValue(basicData[index]?.stan_wodomierza);

      setPaymentType(basicData[index]?.platnosc_przelewem);

      if (basicData[index]?.saldo < 0) {
        setOperationSum(-1 * basicData[index]?.saldo);
      }

      if (prevBlankNumbers !== blankNumbers && blankNumbers.length > 0) {
        setOperationNumber(
          !basicData[index]?.platnosc_przelewem
            ? Math.max.apply(null, blankNumbers) + 1
            : null
        );
        // numberSelectbox.current.value = basicData[index]?.platnosc_przelewem
        //   ? null
        //   : Math.max.apply(null, blankNumbers) + 1;
        // numberSelectbox.current.placeholder = `numer ${
        //   basicData[index]?.platnosc_przelewem ? "wyciągu" : "KP"
        // }`;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basicData, flat, blankNumbers]);

  const operationDateChanged = (event, value) => {
    setOperationDate(value);
  };

  const operationNumberChanged = (event, value) => {
    setOperationNumber(value);
  };

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
        {basicData && (
          <Listbox value={flat} onChange={setFlat}>
            {({ open }) => (
              <>
                <Listbox.Label className="block text-sm font-medium leading-6 text-gray-700 mt-6">
                  1. Wybierz numer mieszkania
                </Listbox.Label>
                <div className="relative mt-2">
                  <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 sm:text-sm sm:leading-6">
                    <span className="ml-3 block truncate">{flat}</span>

                    <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                      <ChevronUpDownIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>

                  <Transition
                    show={open}
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {basicData.map((obj) => (
                        <Listbox.Option
                          key={obj["numer_mieszkania"]}
                          className={({ active }) =>
                            classNames(
                              active
                                ? "bg-sky-600 text-white"
                                : "text-gray-900",
                              "relative cursor-default select-none py-2 pl-3 pr-9"
                            )
                          }
                          value={obj["numer_mieszkania"]}
                        >
                          {({ selected, active }) => (
                            <>
                              <span
                                className={classNames(
                                  selected ? "font-semibold" : "font-normal",
                                  "ml-3 block truncate"
                                )}
                              >
                                {obj["numer_mieszkania"]}
                              </span>

                              {selected ? (
                                <span
                                  className={classNames(
                                    active ? "text-white" : "text-sky-600",
                                    "absolute inset-y-0 right-0 flex items-center pr-4"
                                  )}
                                >
                                  <CheckIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </>
            )}
          </Listbox>
        )}
        <form>
          <div className="flex items-end">
            <div>
              <label
                htmlFor="company-website"
                className="block text-sm font-medium leading-6 text-gray-900 mt-3"
              >
                2. Podaj odczyt wodomierza (opcjonalnie)
              </label>
              <div className="mt-2 mr-1 flex rounded-md shadow-sm">
                <input
                  onChange={(e) =>
                    setWaterMeterCurrentValue(
                      parseFloat(e.target.value.replace(",", "."))
                    )
                  }
                  min={waterMeterCurrentMinValue}
                  max={10000}
                  value={waterMeterCurrentValue}
                  type="number"
                  name="watermeterCurrentValue"
                  id="watermeterCurrentValue"
                  className="block w-full flex-1 rounded-l-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                  placeholder="stan wodomierza"
                />
                <span className="inline-flex items-center rounded-none rounded-r-md border border-l-0 border-gray-300 px-3 text-gray-500 sm:text-sm">
                  m3
                </span>
              </div>
            </div>
            <div>
              <div className="mt-2 flex rounded-md shadow-sm">
                <input
                  onChange={(e) => setWaterMeterCurrentDate(e.target.value)}
                  max={
                    new Date(new Date().getFullYear(), 11, 32)
                      .toISOString()
                      .split("T")[0]
                  }
                  type="date"
                  name="watermeterDate"
                  id="watermeterDate"
                  value={waterMeterCurrentDate}
                  className="block w-full flex-1 rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>

          {waterMeterCurrentValue - waterMeterPreviousValue > 0 && (
            <span className="block text-sm font-medium leading-6 text-gray-700 my-3">
              zużycie:{" "}
              {(waterMeterCurrentValue - waterMeterPreviousValue).toFixed(3)} m3
            </span>
          )}
          {waterMeterPreviousValue > 0 &&
            waterMeterPreviousDate != null &&
            waterMeterPreviousType != null && (
              <span className="block text-sm font-medium leading-6 text-gray-700 my-3">
                ostatni odczyt: {waterMeterPreviousValue} m3 z dnia{" "}
                {waterMeterPreviousDate.slice(0, 10)} ({waterMeterPreviousType})
              </span>
            )}

          <div className="flex section buttons">
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

        {flatHistory && (
          <div>
            <div className="text-sm font-medium text-gray-700 my-4">
              Kartoteka
            </div>

            <div className="not-prose relative bg-slate-50 overflow-hidden ">
              <div className="relative overflow-auto">
                <div className="shadow-sm overflow-hidden my-8">
                  <table className="border-collapse table-auto w-full text-sm">
                    <thead>
                      <tr>
                        <th className="border-b font-medium p-4 pt-0 text-slate-400 text-left">
                          Data
                        </th>
                        <th className="border-b font-medium p-4 pt-0 text-slate-400 text-left">
                          Opis
                        </th>
                        <th className="border-b font-medium p-4 pt-0 text-slate-400 text-left">
                          Należność
                        </th>
                        <th className="border-b font-medium p-4 pt-0 text-slate-400 text-left">
                          Wpłata
                        </th>
                        <th className="border-b font-medium p-4 pt-0 text-slate-400 text-left">
                          Saldo
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {flatHistory.map((row, i) => (
                        <tr key={i}>
                          <td className="border-b border-slate-200 p-4 text-slate-500">
                            {row.data.split("T")[0]}
                          </td>
                          <td className="border-b border-slate-200 p-4 text-slate-500">
                            {row.opis}
                          </td>
                          <td className="border-b border-slate-200 p-4 text-slate-500">
                            {formatter.format(row.naleznosc)}
                          </td>
                          <td className="border-b border-slate-200 p-4 text-slate-500">
                            {formatter.format(row.wplata)}
                          </td>
                          <td
                            className={classNames(
                              row.saldo < 0 ? "text-red-500" : "text-slate-500",
                              "border-b border-slate-200 p-4"
                            )}
                          >
                            {formatter.format(row.saldo)}
                          </td>
                        </tr>
                      ))}
                      {flatHistory.length === 0 && (
                        <tr>
                          <td
                            colSpan={5}
                            className="text-center border-b border-slate-200 p-4 text-slate-500"
                          >
                            brak operacji
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
        )}

        {/* <Separator alignContent="start">3. Dowód wpłaty</Separator>
        {showfeedback2 != null ? <Message2 /> : ""}
        <form>
          <div className="flex fw">
            <Dropdown
            id="accountVouchersSelectbox"
            placeholder="rodzaj dowodu księgowego"
            options={accountVouchers
              .filter((obj) => obj.do_wplat)
              .map((obj) => {
                obj["key"] = obj["id"];
                obj["text"] = obj["opis"];
                return obj;
              })}
          />

            <TextField
              onChange={operationNumberChanged}
              max={1000}
              type="number"
              suffix={
                paymentType
                  ? ""
                  : `/${new Date().getFullYear().toString().slice(2, 4)}`
              }
              placeholder="numer dowodu księgwego"
              // @ts-ignore
              ref={numberSelectbox}
            />
            <TextField
              onChange={operationDateChanged}
              type="date"
              max={
                new Date(new Date().getFullYear(), 11, 32)
                  .toISOString()
                  .split("T")[0]
              }
              placeholder="wybierz datę wpłaty"
              // @ts-ignore
              ref={operationDatepicker}
            />
          </div>

          <div className="options section">
            {balance < 0 && (
              <Checkbox
                id="defaultCheckbox"
                checked={defaultOptionChecked}
                onChange={defaultOptionClick}
                label={`zgodny z naliczeniami (${-1 * balance} zł)`}
              />
            )}
            <div className="flex">
              <Checkbox
                onChange={anotherOptionClick}
                checked={!defaultOptionChecked || balance >= 0}
                className="another"
                label="inna kwota"
              />
              {(operationSumFieldState || balance >= 0) && (
                <div>
                  <TextField
                    onChange={operationValueChanged}
                    type="number"
                    id="operationValue"
                    placeholder="wpisz kwotę"
                    suffix="zł"
                  />
                  {operationSum > 0 && balance + operationSum < 0 && (
                    <Label>
                      pozostanie do zapłaty {-1 * (balance + operationSum)} zł
                    </Label>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex section buttons">
            <Link to="/">
            <DefaultButton text="Anuluj" />
          </Link>
            <PrimaryButton
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
              onClick={saveOperation}
              id="saveButton"
              text="Zapisz wpłatę"
            />
          </div>
        </form> */}
      </div>
    </Layout>
  );
};

export default AddIncome;
