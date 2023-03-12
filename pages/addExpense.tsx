import React, { useEffect, useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import Layout from "../components/Layout";
import { fetcher } from "../utils";

const AddExpense: React.FC<any> = (props) => {
  const { mutate } = useSWRConfig();
  const { data: expensesCategory } = useSWR("/api/expensesCategory", fetcher);

  const [showfeedback, setShowfeedback] = useState(null);
  const [showfeedback2, setShowfeedback2] = useState(null);

  const [category, setCategory] = useState(0);
  const [description, setDescription] = useState(0);
  const [company, setCompany] = useState(0);

  const [type, setType] = useState("");
  const [account, setAccount] = useState("");
  const [countRequired, setCountRequired] = useState(true);
  const [cashChecked, setCashChecked] = useState(true);
  const [number, setNumber] = useState("");
  const [date, setDate] = useState("");
  const [count, setCount] = useState(null);
  const [sum, setSum] = useState(null);
  const [comment, setComment] = useState("");

  const categoryObj = expensesCategory?.find((e) => e.id === category) || {};
  const { opisy: descriptions, id_subkonta } = categoryObj;

  const {
    ilosc_wymagana,
    firmy: companies,
    typy_dowodow_ksiegowych,
  } = descriptions?.find((e) => e.id === description) || {};

  useEffect(() => {
    if (descriptions?.length === 1) {
      setDescription(descriptions[0].id);
    } else {
      setDescription(0);
    }

    if (
      descriptions?.length === 1 &&
      descriptions[0].typy_dowodow_ksiegowych?.length === 1
    ) {
      setType(descriptions[0].typy_dowodow_ksiegowych[0].opis);
    } else {
      setType("");
    }

    setAccount(id_subkonta);

    setCompany(0);
    setCountRequired(true);
    setDate("");
    setCount(null);
    setSum(null);
    setNumber("");
    setComment("");
  }, [category, descriptions, id_subkonta]);

  useEffect(() => {
    if (companies?.length === 1) {
      setCompany(companies[0].id);
    } else {
      setCompany(0);
    }
    setCountRequired(ilosc_wymagana);

    if (typy_dowodow_ksiegowych?.length === 1) {
      setType(typy_dowodow_ksiegowych[0].opis);
    } else {
      setType("");
    }

    setDate("");
    setCount(null);
    setSum(null);
    setNumber("");
    setComment("");
  }, [companies, ilosc_wymagana, typy_dowodow_ksiegowych]);

  const saveOperation = (e) => {
    e.preventDefault();
    fetch(`/api/operations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_firmy: company,
        data: date,
        id_opisu: description,
        rodzaj_i_numer_dowodu_ksiegowego: `${
          type === "Wyciąg" ? "Wyciąg nr" : type
        } ${number}`,
        kwota: -1 * sum,
        czy_bank: !cashChecked,
        id_subkonta: account,
        ilosc: count,
        komentarz: comment,
      }),
    })
      .then(() => {
        setShowfeedback(true);
        mutate("/api/accountBalance");
      })
      .catch(() => {
        setShowfeedback(false);
      });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4">
        <form>
          <select
            value={category}
            onChange={(e) => setCategory(parseInt(e.target.value))}
            className="block w-full flex-1 rounded-md border-0 mt-6 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
          >
            <option disabled value={0}>
              wybierz kategorię
            </option>
            {expensesCategory?.map((obj) => (
              <option key={obj.id} value={obj.id}>
                {obj.nazwa}
              </option>
            ))}
            <option value={-1} key={-1}>
              Inna
            </option>
          </select>

          {category !== 0 && (
            <div>
              {" "}
              {descriptions?.length > 1 && (
                <select
                  value={description}
                  onChange={(e) => setDescription(parseInt(e.target.value))}
                  className="block w-full flex-1 rounded-md border-0 mt-2 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                >
                  <option disabled value={0}>
                    wybierz opis
                  </option>
                  {descriptions?.map((obj) => (
                    <option key={obj.id} value={obj.id}>
                      {obj.opis}
                    </option>
                  ))}
                </select>
              )}
              <select
                value={company}
                onChange={(e) => setCompany(parseInt(e.target.value))}
                className="block w-full flex-1 rounded-md border-0 mt-2 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
              >
                <option disabled value={0}>
                  wybierz firmę
                </option>
                {companies?.map((obj) => (
                  <option key={obj.id} value={obj.id}>
                    {obj.nazwa}
                  </option>
                ))}
              </select>
              <div className="flex">
                <input
                  onChange={(e) => setDate(e.target.value)}
                  min={
                    new Date(new Date().getFullYear(), 0, 2)
                      .toISOString()
                      .split("T")[0]
                  }
                  max={
                    new Date(new Date().getFullYear(), 11, 32)
                      .toISOString()
                      .split("T")[0]
                  }
                  type="date"
                  name="date"
                  id="date"
                  value={date}
                  className="block w-full rounded-md border-0 mt-2 mr-2 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                />

                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="block w-full rounded-md border-0 mt-2 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                >
                  <option disabled value="">
                    wybierz typ dowodu ksiegowego
                  </option>
                  {typy_dowodow_ksiegowych?.map((obj) => (
                    <option key={obj.id} value={obj.opis}>
                      {obj.opis}
                    </option>
                  ))}
                </select>

                <input
                  onChange={(e) => setNumber(e.target.value)}
                  value={number}
                  maxLength={100}
                  type="text"
                  autoComplete="off"
                  name="number"
                  id="number"
                  className="block w-full rounded-md border-0 mt-2 ml-2 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                  placeholder="podaj numer dowodu księgowego"
                />
              </div>
              <div className="flex">
                {countRequired && (
                  <input
                    onChange={(e) => setCount(parseFloat(e.target.value))}
                    min={1}
                    max={1000}
                    step="any"
                    type="number"
                    name="count"
                    id="count"
                    value={count}
                    className="block w-full flex-1 rounded-md border-0 mr-2 mt-2 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                    placeholder="wpisz ilość"
                  />
                )}

                <div className="flex rounded-md shadow-sm">
                  <input
                    onChange={(e) =>
                      setSum(parseFloat(e.target.value.replace(",", ".")))
                    }
                    value={sum}
                    type="number"
                    min={0}
                    step="any"
                    name="sum"
                    id="sum"
                    className="block w-full flex-1 rounded-l-md border-0 mt-2 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                    placeholder="wpisz kwotę"
                  />
                  <span className="inline-flex mt-2 items-center rounded-none rounded-r-md border border-l-0 border-gray-300 px-3 text-gray-500 sm:text-sm">
                    zł
                  </span>
                </div>
              </div>
              <textarea
                onChange={(e) => setComment(e.target.value)}
                name="comment"
                id="comment"
                value={comment}
                maxLength={300}
                className="block w-full flex-1 rounded-md border-0 mt-2 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                placeholder="wpisz komentarz (opcjonalnie)"
              />
              <div className="flex flex-col">
                <div className="flex items-center mt-2">
                  <input
                    onChange={() => setCashChecked(true)}
                    checked={cashChecked}
                    id="default-radio-2"
                    type="radio"
                    name="default-radio"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2 "
                  />
                  <label
                    htmlFor="default-radio-2"
                    className="ml-2 text-sm font-medium text-gray-900 "
                  >
                    kasa
                  </label>
                </div>
                <div className="flex items-center mt-2">
                  <input
                    onChange={() => setCashChecked(false)}
                    checked={!cashChecked}
                    id="default-radio-1"
                    type="radio"
                    name="default-radio"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2 "
                  />
                  <label
                    htmlFor="default-radio-1"
                    className="ml-2 text-sm font-medium text-gray-900 "
                  >
                    bank
                  </label>
                </div>
              </div>
            </div>
          )}

          <button
            className="mt-4 disabled:bg-gray-300 inline-flex justify-center rounded-md bg-sky-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
            disabled={
              !(
                company != null &&
                company != 0 &&
                date != null &&
                date !== "" &&
                description != null &&
                description != 0 &&
                type != null &&
                number != null &&
                number !== "" &&
                account != null &&
                sum != null &&
                sum >= 0 &&
                countRequired &&
                count != null &&
                count > 0
              )
            }
            onClick={(e) => saveOperation(e)}
            id="saveButton"
          >
            Zapisz wydatek
          </button>
        </form>
      </div>

      {/* <span >
        {company},{date},{description},`$
        {type === "Wyciąg" ? "Wyciąg nr" : type} ${number}` ,{-1 * sum},
        {!cashChecked ? "bank" : "kasa"},{account}, {count},{comment}
      </span> */}
    </Layout>
  );
};

export default AddExpense;
