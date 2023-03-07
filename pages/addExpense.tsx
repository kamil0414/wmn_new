import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { PostProps } from "../components/Post";
import {
  Dropdown,
  TextField,
  PrimaryButton,
  Checkbox,
  MessageBar,
  MessageBarType,
  DefaultButton,
} from "@fluentui/react";
import Link from "next/link";

const AddExpense: React.FC<PostProps> = (props) => {
  useEffect(() => {
    fetchCompanies();
    fetchSubaccounts();
    fetchAccountVouchers();
    document.querySelector("#date").value = new Date()
      .toISOString()
      .split("T")[0];
    document
      .querySelector("#date")
      .dispatchEvent(new Event("input", { bubbles: true }));
  }, []);

  const fetchCompanies = () => {
    fetch(`/api/companies`)
      .then((response) => response.json())
      .then((json) => {
        setCompanies(json);
      });
  };

  const fetchSubaccounts = () => {
    fetch(`/api/subaccounts`)
      .then((response) => response.json())
      .then((json) => {
        setSubaccounts(json);
      });
  };

  const fetchAccountVouchers = () => {
    fetch(`/api/accountVouchers?onlyIncomes=${false}`)
      .then((response) => response.json())
      .then((json) => setAccountVouchers(json));
  };

  const [showfeedback, setShowfeedback] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [subaccounts, setSubaccounts] = useState([]);
  const [accountVouchers, setAccountVouchers] = useState([]);
  const [cashCheckboxChecked, setCashCheckboxChecked] = useState(true);

  const [companyId, setCompanyId] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState(null);
  const [type, setType] = useState(null);
  const [number, setNumber] = useState(null);
  const [account, setAccount] = useState(null);
  const [sum, setSum] = useState(null);

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

  const saveOperation = () => {
    fetch(`/api/operations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_firmy: companyId,
        data: date,
        opis: description,
        rodzaj_i_numer_dowodu_ksiegowego: `${
          type === "Wyciąg" ? "Wyciąg nr" : type
        } ${number}`,
        kwota: -1 * sum,
        czy_bank: !cashCheckboxChecked,
        id_subkonta: account,
      }),
    })
      .then(() => {
        setShowfeedback(true);
        fetchAccountBalance();
      })
      .catch(() => {
        setShowfeedback(false);
      });
  };

  const toggleCashOptionClick = () => {
    setCashCheckboxChecked(!cashCheckboxChecked);
  };

  const companyChanged = (event, option, index) => {
    setCompanyId(option.id);
  };

  const dateChanged = (event, value) => {
    setDate(value);
  };

  const descriptionChanged = (event, value) => {
    setDescription(value);
  };

  const typeChanged = (event, options, index) => {
    setType(options.text);
  };

  const numberChanged = (event, value) => {
    setNumber(value);
  };

  const accountChanged = (event, options, index) => {
    setAccount(index + 1);
  };

  const sumChanged = (event, value) => {
    setSum(value);
  };

  return (
    <Layout>
      <div className="container">
        {showfeedback != null ? <Message /> : ""}
        <form>
          <div className="flex fw section">
            <Dropdown
              onChange={(event, options, index) =>
                companyChanged(event, options, index)
              }
              placeholder="wybierz firmę"
              options={companies.map((obj) => {
                obj["key"] = obj["id"];
                obj["text"] = obj["nazwa"];
                return obj;
              })}
            />
            <TextField
              onChange={dateChanged}
              id="date"
              type="date"
              max={
                new Date(new Date().getFullYear(), 11, 32)
                  .toISOString()
                  .split("T")[0]
              }
              placeholder="wybierz datę"
            />
          </div>
          <div className="flex fw section">
            <Dropdown
              onChange={(event, options, index) =>
                typeChanged(event, options, index)
              }
              placeholder="wybierz typ dowodu"
              id="expenseType"
              options={accountVouchers.map((obj) => {
                obj["key"] = obj["id"];
                obj["text"] = obj["opis"];
                return obj;
              })}
            />
            <TextField
              onChange={numberChanged}
              type="text"
              autoComplete="off"
              placeholder="wpisz numer dowodu"
              id="expenseText"
            />
          </div>
          <div className="flex fw section">
            <TextField
              onChange={descriptionChanged}
              type="text"
              id="description"
              placeholder="wpisz opis"
            />
          </div>
          <div className="flex fw section">
            <Dropdown
              onChange={(event, options, index) =>
                accountChanged(event, options, index)
              }
              placeholder="wybierz subkonto"
              id="account"
              options={subaccounts}
            />
            <TextField
              onChange={sumChanged}
              type="number"
              id="sum"
              placeholder="wpisz kwotę"
              suffix="zł"
            />
          </div>
          <div className="options section">
            <Checkbox
              id="cashCheckbox"
              checked={cashCheckboxChecked}
              onChange={toggleCashOptionClick}
              label="kasa"
            />
            <Checkbox
              id="bankCheckbox"
              checked={!cashCheckboxChecked}
              onChange={toggleCashOptionClick}
              label="bank"
            />
          </div>
          <div className="flex section buttons">
            <Link href="/">
              <DefaultButton text="Anuluj" />
            </Link>
            <PrimaryButton
              disabled={
                !(
                  companyId != null &&
                  date != null &&
                  description != null &&
                  type != null &&
                  number != null &&
                  account != null &&
                  sum != null &&
                  sum >= 0
                )
              }
              onClick={saveOperation}
              id="saveButton"
              text="Zapisz wydatek"
            />
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddExpense;
