import React, { useEffect, useRef, useState } from "react";
import Layout from "../components/Layout";
import {
  Dropdown,
  TextField,
  Separator,
  PrimaryButton,
  Checkbox,
  Label,
  MessageBar,
  MessageBarType,
} from "@fluentui/react";
import { formatter } from "../utils";

const AddIncome: React.FC<any> = (props) => {
  const numberSelectbox = useRef<HTMLInputElement>(null);
  const waterMeterDatepicker = useRef<HTMLInputElement>(null);
  const waterMeterValueSelectbox = useRef<HTMLInputElement>(null);
  const operationDatepicker = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchBasicData();
    fetchBlankNumbers();

    if (waterMeterDatepicker) {
      waterMeterDatepicker.current.value = new Date().toISOString().split("T")[0];
      waterMeterDatepicker.current.dispatchEvent(new Event("input", { bubbles: true }));
    }
    
    // @ts-ignore
    setWaterMeterCurrentDate(new Date().toISOString().split("T")[0]);
    if (operationDatepicker) {
      operationDatepicker.current.value = new Date().toISOString().split("T")[0];
      operationDatepicker.current.dispatchEvent(new Event("input", { bubbles: true }));
    }
    // @ts-ignore
    setOperationDate(new Date().toISOString().split("T")[0]);
  }, []);

  const fetchBasicData = () => {
    fetch(`/api/basicData`)
      .then((response) => response.json())
      .then((json) => {
        setBasicData(json);
        if (flat !== 0) {
          setBalance(parseFloat(json[flat - 1]?.saldo));
          setOperationSum(-1 * json[flat - 1]?.saldo);
        }
      });
  };

  const fetchBlankNumbers = () => {
    fetch(`/api/blankNumbers`)
      .then((response) => response.json())
      .then((json) => {
        setBlankNumbers(json);
        if (flat != null && !paymentType) {
          setOperationNumber(Math.max.apply(null, json) + 1);
          if (numberSelectbox) {
            numberSelectbox.current.value = Math.max.apply(null, json) + 1;
            numberSelectbox.current.dispatchEvent(new Event("input", { bubbles: true }));
          }
        }
      });
  };

  const fetchFlatHistory = (flat_number) => {
    fetch(`/api/flatHistory/?flat_number=${flat_number}`)
      .then((response) => response.json())
      .then((json) => setFlatHistory(json));
  };

  const saveWaterMeterValue = () => {
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
          fetchBasicData();
          fetchFlatHistory(flat);
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
          fetchBasicData();
          fetchFlatHistory(flat);
          // fetchAccountBalance();

          if (!paymentType) {
            fetchBlankNumbers();
          }
        } else {
          setShowfeedback2(false);
        }
      })
      .catch(() => {
        setShowfeedback2(false);
      });
  };

  const [accountsBalance, setAccountsBalance] = useState();
  const [basicData, setBasicData] = useState([]);
  const [blankNumbers, setBlankNumbers] = useState();
  const [flat, setFlat] = useState();
  const [paymentType, setPaymentType] = useState();
  const [accountVoucher, setAccountVoucher] = useState();
  const [waterMeterPreviousValue, setWaterMeterPreviousValue] = useState(0);
  const [waterMeterPreviousDate, setWaterMeterPreviousDate] = useState("");
  const [waterMeterPreviousType, setWaterMeterPreviousType] = useState();
  const [waterMeterCurrentValue, setWaterMeterCurrentValue] = useState(0);
  const [waterMeterCurrentDate, setWaterMeterCurrentDate] = useState();
  const [operationNumber, setOperationNumber] = useState();
  const [operationSum, setOperationSum] = useState(0);
  const [operationSumFieldState, setOperationSumFieldState] = useState(false);
  const [defaultOptionChecked, setDefaultOptionChecked] = useState(true);
  const [waterMeterButtonState, setWaterMeterButtonState] = useState(true);
  const [showfeedback, setShowfeedback] = useState(null);
  const [showfeedback2, setShowfeedback2] = useState(null);
  const [flatHistory, setFlatHistory] = useState([]);

  const [operationDate, setOperationDate] = useState();
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

  const flatNumberChanged = (event, options, index) => {
    setFlat(index + 1);
    setBalance(parseFloat(basicData[index]?.saldo));
    setWaterMeterPreviousValue(basicData[index]?.stan_wodomierza);
    setWaterMeterPreviousDate(
      basicData[index]?.data_odczytu_wodomierza.split("T")[0]
    );
    setWaterMeterPreviousType(basicData[index]?.typ_odczytu);
    // @ts-ignore
    setWaterMeterCurrentDate(new Date().toISOString().split("T")[0]);
    setPaymentType(basicData[index]?.platnosc_przelewem);
    setWaterMeterButtonState(true);
    setShowfeedback(null);
    setShowfeedback2(null);
    fetchFlatHistory(index + 1);

    if (basicData[index]?.saldo < 0) {
      setOperationSum(-1 * basicData[index]?.saldo);
    }

    setOperationNumber(
      !basicData[index]?.platnosc_przelewem
        ? Math.max.apply(null, blankNumbers) + 1
        : null
    );

    if (waterMeterValueSelectbox) {
      waterMeterValueSelectbox.current.value = basicData[index]?.stan_wodomierza;
      waterMeterValueSelectbox.current.min = basicData[index]?.stan_wodomierza;
      waterMeterValueSelectbox.current.dispatchEvent(
        new Event("input", { bubbles: true })
      );
    }

    if (numberSelectbox) {
      numberSelectbox.current.value = basicData[index]?.platnosc_przelewem
        ? null
        : Math.max.apply(null, blankNumbers) + 1;

      numberSelectbox.current.placeholder = `numer ${
        basicData[index]?.platnosc_przelewem ? "wyciągu" : "KP"
      }`;
      numberSelectbox.current.dispatchEvent(new Event("input", { bubbles: true }));
    }

    // document.querySelector("#accountVouchersSelectbox").selectedOptions = [0];
    // document.querySelector("#accountVouchersSelectbox").dispatchEvent(new Event("input", { bubbles: true }));
    // document.querySelector("#accountVouchersSelectbox").dispatchEvent(new Event("select", { bubbles: true }));
  };

  const waterMeterValueChanged = (event, value) => {
    setWaterMeterCurrentValue(value.replace(",", "."));
  };

  const waterMeterDateChanged = (event, value) => {
    setWaterMeterCurrentDate(value);
  };

  const operationDateChanged = (event, value) => {
    setOperationDate(value);
  };

  const operationNumberChanged = (event, value) => {
    setOperationNumber(value);
  };

  const Message = () => (
    <MessageBar
      messageBarType={
        showfeedback ? MessageBarType.success : MessageBarType.error
      }
      isMultiline={false}
    >
      {showfeedback ? "Zapisano" : "Wystąpił błąd"}
    </MessageBar>
  );

  const Message2 = () => (
    <MessageBar
      messageBarType={
        showfeedback2 ? MessageBarType.success : MessageBarType.error
      }
      isMultiline={false}
    >
      {showfeedback2 ? "Zapisano" : "Wystąpił błąd"}
    </MessageBar>
  );

  return (
    <Layout>
      <div className="container">
        <Separator alignContent="start">1. Wybierz numer mieszkania</Separator>

        <div className="flex section">
          <Dropdown
            onChange={(event, options, index) =>
              flatNumberChanged(event, options, index)
            }
            placeholder="wybierz numer mieszkania"
            options={basicData.map((obj) => {
              obj["key"] = obj["numer_mieszkania"];
              obj["text"] = obj["numer_mieszkania"];
              return obj;
            })}
          />
        </div>

        <div>
          <Separator alignContent="start">
            2. Podaj odczyt wodomierza (opcjonalnie)
          </Separator>
          {showfeedback != null ? <Message /> : ""}
          <form>
            <div className="flex fw">
              <TextField
                onChange={waterMeterValueChanged}
                max={10000}
                type="number"
                // @ts-ignore
                ref={waterMeterValueSelectbox}
                placeholder="stan wodomierza"
                suffix="m3"
              />
              <TextField
                onChange={waterMeterDateChanged}
                type="date"
                max={
                  new Date(new Date().getFullYear(), 11, 32)
                    .toISOString()
                    .split("T")[0]
                }
                // @ts-ignore
                ref={waterMeterDatepicker}
                placeholder="wybierz datę odczytu"
              />
            </div>

            {waterMeterCurrentValue - waterMeterCurrentValue > 0 && (
              <Label>
                zużycie:{" "}
                {(waterMeterCurrentValue - waterMeterPreviousValue).toFixed(3)}{" "}
                m3
              </Label>
            )}
            {waterMeterPreviousValue > 0 &&
              waterMeterPreviousDate != null &&
              waterMeterPreviousType != null && (
                <Label>
                  ostatni odczyt: {waterMeterPreviousValue} m3 z dnia{" "}
                  {
                    // @ts-ignore
                    waterMeterPreviousDate.slice(0, 10)
                  }{" "}
                  ({waterMeterPreviousType})
                </Label>
              )}

            <div className="flex section buttons">
              <PrimaryButton
                disabled={
                  !(
                    waterMeterCurrentValue > waterMeterPreviousValue &&
                    flat != null &&
                    waterMeterCurrentDate != null &&
                    waterMeterPreviousDate !== waterMeterCurrentDate &&
                    waterMeterButtonState
                  )
                }
                onClick={saveWaterMeterValue}
                id="saveButton"
                text="Zapisz odczyt"
              />
            </div>
          </form>
        </div>

        <Separator alignContent="start">3. Dowód wpłaty</Separator>
        {showfeedback2 != null ? <Message2 /> : ""}
        <form>
          <div className="flex fw">
            {/* <Dropdown
            id="accountVouchersSelectbox"
            placeholder="rodzaj dowodu księgowego"
            options={accountVouchers
              .filter((obj) => obj.do_wplat)
              .map((obj) => {
                obj["key"] = obj["id"];
                obj["text"] = obj["opis"];
                return obj;
              })}
          /> */}

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
            {/* <Link to="/">
            <DefaultButton text="Anuluj" />
          </Link> */}
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
        </form>
        {flat != null && (
          <div>
            {" "}
            <Separator alignContent="start">Kartoteka</Separator>
            <table className="ms-Table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Opis</th>
                  <th className="sum">Należność</th>
                  <th className="sum">Wpłata</th>
                  <th className="sum">Saldo</th>
                </tr>
              </thead>
              <tbody>
                {flatHistory.map((row) => (
                  <tr>
                    <td className="noWrap data">{row.data.split("T")[0]}</td>
                    <td className="description">{row.opis}</td>
                    <td className="noWrap sum">
                      {formatter.format(row.naleznosc)}
                    </td>
                    <td className="noWrap sum">
                      {formatter.format(row.wplata)}
                    </td>
                    <td
                      className={
                        row.saldo < 0 ? "red noWrap sum" : "noWrap sum"
                      }
                    >
                      {formatter.format(row.saldo)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AddIncome;
