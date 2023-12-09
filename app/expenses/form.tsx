"use client";

import { useEffect, useRef, useState } from "react";
import { getStartDateFromEnv, getEndDateFromEnv } from "@/utils/index";
import { upsertExpense } from "./actions";

interface expensesCategory {
  id_subkonta: number;
  czy_zawsze_bank: boolean;
  id: number;
  opisy: {
    opis: string;
    id: number;
    ilosc_wymagana: boolean;
    firmy: {
      id: number;
      nazwa: string;
    }[];
    typy_dowodow_ksiegowych: {
      opis: string;
      id: number;
    }[];
    jednostka_miary: string | null;
  }[];
  nazwa: string;
}

function ExpenseForm({
  expensesCategory,
  id,
  selectedCategory,
  selectedDescription,
  selectedCompany,
  selectedDate,
  selectedType,
  selectedNumber,
  selectedCount,
  selectedSum,
  selectedComment,
  selectedCash,
}: {
  expensesCategory: expensesCategory[];
  id?: number;
  selectedCategory?: number;
  selectedDescription?: number;
  selectedCompany?: number;
  selectedDate?: string;
  selectedType?: number;
  selectedNumber?: string;
  selectedCount?: number;
  selectedSum?: number;
  selectedComment?: string;
  selectedCash?: boolean;
}) {
  const [category, setCategory] = useState(selectedCategory ?? 0);
  const [description, setDescription] = useState(selectedDescription ?? 0);
  const [company, setCompany] = useState(selectedCompany ?? 0);
  const [otherCompanyName, setOtherCompanyName] = useState("");

  const [date, setDate] = useState(selectedDate ?? "");
  const [type, setType] = useState(selectedType ?? 2);
  const [number, setNumber] = useState(selectedNumber ?? "");

  const [count, setCount] = useState(selectedCount ?? 0);
  const [sum, setSum] = useState(selectedSum ?? 0);

  const [comment, setComment] = useState(selectedComment ?? "");

  const [cashChecked, setCashChecked] = useState(selectedCash ?? true);

  const [account, setAccount] = useState(0);
  const [countRequired, setCountRequired] = useState(false);
  const [unit, setUnit] = useState<string | null>("");

  const sumInput = useRef<HTMLInputElement>(null);

  const {
    opisy: descriptions,
    id_subkonta,
    czy_zawsze_bank,
  } = expensesCategory?.find((expense) => expense.id === category) || {
    opisy: [],
    id_subkonta: 0,
  };

  const {
    ilosc_wymagana,
    firmy: companies,
    typy_dowodow_ksiegowych,
    jednostka_miary,
  } = descriptions?.find((e) => e.id === description) || {
    ilosc_wymagana: false,
    firmy: [],
    typy_dowodow_ksiegowych: [],
    jednostka_miary: null,
  };

  useEffect(() => {
    if (descriptions?.length === 1) {
      setDescription(descriptions[0].id);
    } else {
      setDescription(selectedDescription ?? 0);
    }
    if (sumInput.current) {
      sumInput.current.value = selectedSum?.toString() ?? "0";
    }
  }, [selectedDescription, descriptions]);

  useEffect(() => {
    setOtherCompanyName("");
  }, [description]);

  useEffect(() => {
    setAccount(id_subkonta);
  }, [id_subkonta]);

  useEffect(() => {
    setCashChecked(!czy_zawsze_bank);
  }, [czy_zawsze_bank]);

  useEffect(() => {
    setCountRequired(ilosc_wymagana);
    if (!ilosc_wymagana) {
      setCount(0);
    }
  }, [ilosc_wymagana]);

  useEffect(() => {
    if (companies?.length === 1) {
      setCompany(companies[0].id);
    } else {
      setCompany(selectedCompany ?? 0);
    }
  }, [companies, selectedCompany]);

  useEffect(() => {
    if (typy_dowodow_ksiegowych?.length === 1) {
      setType(typy_dowodow_ksiegowych[0].id);
    } else {
      setType(selectedType ?? 2);
    }
  }, [selectedType, typy_dowodow_ksiegowych]);

  useEffect(() => {
    setUnit(jednostka_miary);
  }, [jednostka_miary]);

  const saveOperation = () => {
    upsertExpense({
      id,
      id_firmy: company,
      data: new Date(date),
      id_opisu: description,
      id_typu_dowodu_ksiegowego: type,
      numer_dowodu_ksiegowego: number,
      kwota: -1 * sum,
      czy_bank: !cashChecked,
      id_subkonta: account,
      ilosc: count,
      komentarz: comment,
      nazwaNowejFirmy: otherCompanyName,
    }).then(() => {
      setCategory(0);
    });
  };

  return (
    <form action={saveOperation}>
      <select
        value={category}
        onChange={(e) => setCategory(parseInt(e.target.value, 10))}
        className="mt-6 block w-full flex-1 rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
      >
        <option disabled value={0}>
          wybierz kategorię
        </option>
        {expensesCategory?.map((obj) => (
          <option key={obj.id} value={obj.id}>
            {obj.nazwa}
          </option>
        ))}
      </select>

      {category !== 0 && (
        <div>
          {descriptions?.length > 1 && (
            <select
              value={description}
              onChange={(e) => setDescription(parseInt(e.target.value, 10))}
              className="mt-2 block w-full flex-1 rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
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
          <div className="flex">
            <select
              value={company}
              onChange={(e) => setCompany(parseInt(e.target.value, 10))}
              className="mt-2 block w-full flex-1 rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
            >
              <option disabled value={0}>
                wybierz firmę
              </option>
              {companies?.map((obj) => (
                <option key={obj.id} value={obj.id}>
                  {obj.nazwa}
                </option>
              ))}
              <option value={-1} key="Inna">
                Inna
              </option>
            </select>
            {company === -1 && (
              <input
                onChange={(e) => setOtherCompanyName(e.target.value)}
                autoComplete="off"
                placeholder="wpisz nazwę firmy"
                type="text"
                name="otherCompany"
                id="otherCompany"
                value={otherCompanyName}
                className="ml-2 mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
              />
            )}
          </div>
          <div className="flex">
            <input
              onChange={(e) => setDate(e.target.value)}
              min={getStartDateFromEnv()?.toISOString().split("T")[0]}
              max={getEndDateFromEnv()?.toISOString().split("T")[0]}
              type="date"
              name="date"
              id="date"
              value={date}
              className="mr-2 mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
            />

            <select
              value={type}
              onChange={(e) => setType(parseInt(e.target.value))}
              className="mt-2 block w-full rounded-l-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
            >
              <option disabled value={0}>
                wybierz typ dowodu ksiegowego
              </option>
              {typy_dowodow_ksiegowych?.map((obj) => (
                <option key={obj.id} value={obj.id}>
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
              className="mt-2 block w-full rounded-r-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
              placeholder="podaj numer dowodu księgowego"
            />
          </div>
          <div className="flex">
            {countRequired && (
              <div className="flex">
                <input
                  onChange={(e) => setCount(parseFloat(e.target.value))}
                  onKeyDown={(evt) =>
                    ["e", "E", "+", "-"].includes(evt.key) &&
                    evt.preventDefault()
                  }
                  min={1}
                  max={1000}
                  step="any"
                  type="number"
                  name="count"
                  id="count"
                  value={count}
                  className="mt-2 block w-full flex-1 rounded-l-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                  placeholder="wpisz ilość"
                />
                <span className="mr-2 mt-2 inline-flex items-center rounded-none rounded-r-md border border-l-0 border-gray-300 px-3 text-gray-500 sm:text-sm">
                  {unit}
                </span>
              </div>
            )}

            <div className="flex">
              <input
                ref={sumInput}
                onChange={(e) =>
                  setSum(parseFloat(e.target.value.replace(",", ".")))
                }
                onKeyDown={(evt) =>
                  ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()
                }
                autoComplete="off"
                type="number"
                min={0}
                step="any"
                name="sum"
                id="sum"
                className="mt-2 block w-full flex-1 rounded-l-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                placeholder="wpisz kwotę"
              />
              <span className="mt-2 inline-flex items-center rounded-none rounded-r-md border border-l-0 border-gray-300 px-3 text-gray-500 sm:text-sm">
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
            className="mt-2 block w-full flex-1 rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
            placeholder="wpisz komentarz (opcjonalnie)"
          />
          <div className="flex flex-col">
            {!czy_zawsze_bank && (
              <div className="mt-2 flex items-center">
                <input
                  onChange={() => setCashChecked(true)}
                  checked={cashChecked}
                  id="default-radio-2"
                  type="radio"
                  name="default-radio"
                  className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 "
                />
                <div className="ml-2 text-sm font-medium text-gray-900 ">
                  kasa
                </div>
              </div>
            )}
            <div className="mt-2 flex items-center">
              <input
                onChange={() => setCashChecked(false)}
                checked={!cashChecked}
                id="default-radio-1"
                type="radio"
                name="default-radio"
                className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 "
              />
              <div className="ml-2 text-sm font-medium text-gray-900 ">
                bank
              </div>
            </div>
          </div>
        </div>
      )}
      <button
        type="submit"
        className="mt-4 inline-flex justify-center rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 disabled:bg-gray-300"
        disabled={
          !(
            company != null &&
            company !== 0 &&
            (company !== -1 ||
              (company === -1 &&
                otherCompanyName != null &&
                otherCompanyName !== "")) &&
            date != null &&
            date !== "" &&
            description != null &&
            description !== 0 &&
            type != null &&
            number != null &&
            number !== "" &&
            account != null &&
            sum != null &&
            sum > 0 &&
            (!countRequired || (countRequired && count != null && count > 0))
          )
        }
        id="saveButton"
      >
        {`${id ? "Zapisz" : "Dodaj"} wydatek`}
      </button>
    </form>
  );
}
export default ExpenseForm;
