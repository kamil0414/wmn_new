"use client";

import { useEffect, useRef, useState } from "react";
import {
  getStartDateFromEnv,
  getEndDateFromEnv,
  classNames,
} from "@/utils/index";
import { upsertExpense } from "./actions";

interface Company {
  id: number;
  nazwa: string;
}

interface Type {
  opis: string;
  id: number;
}

interface Description {
  opis: string;
  id: number;
  ilosc_wymagana: boolean;
  firmy: Company[];
  typy_dowodow_ksiegowych: Type[];
  jednostka_miary: string | null;
}

interface Category {
  id_subkonta: number;
  czy_zawsze_bank: boolean;
  id: number;
  opisy: Description[];
  nazwa: string;
}

function ExpenseForm({
  className,
  categories,
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
  className?: string;
  categories: Category[];
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
  const [category, setCategory] = useState(selectedCategory ?? -1);
  const [description, setDescription] = useState(selectedDescription ?? -1);
  const [company, setCompany] = useState(selectedCompany ?? -1);
  const [otherCompanyName, setOtherCompanyName] = useState("");

  const [date, setDate] = useState(selectedDate ?? "");
  const [type, setType] = useState(selectedType ?? -1);
  const [number, setNumber] = useState(selectedNumber ?? "");

  const [count, setCount] = useState(selectedCount ?? 0);
  const [sum, setSum] = useState(selectedSum ?? 0);

  const [comment, setComment] = useState(selectedComment ?? "");

  const [cashChecked, setCashChecked] = useState(selectedCash ?? true);

  const [descriptions, setDescriptions] = useState<Description[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [types, setTypes] = useState<Type[]>([]);

  const [alwaysBank, setAlwaysBank] = useState(false);
  const [account, setAccount] = useState(0);
  const [countRequired, setCountRequired] = useState(false);
  const [unit, setUnit] = useState<string | null>("");

  const sumInput = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (sumInput.current) {
      sumInput.current.value = selectedSum?.toString() ?? "0";
    }
  }, [selectedSum]);

  useEffect(() => {
    const { opisy, id_subkonta, czy_zawsze_bank } = categories?.find(
      (expense) => expense.id === category,
    ) || {
      opisy: [],
      id_subkonta: 0,
      czy_zawsze_bank: false,
    };

    setDescriptions(opisy);
    setAccount(id_subkonta);
    setAlwaysBank(czy_zawsze_bank);
    if (czy_zawsze_bank) {
      setCashChecked(false);
    }
  }, [categories, category]);

  useEffect(() => {
    const { ilosc_wymagana, firmy, typy_dowodow_ksiegowych, jednostka_miary } =
      descriptions?.find((e) => e.id === description) || {
        ilosc_wymagana: false,
        firmy: [],
        typy_dowodow_ksiegowych: [],
        jednostka_miary: null,
      };

    setCountRequired(ilosc_wymagana);
    if (!ilosc_wymagana) {
      setCount(0);
    } else {
      setCount(selectedCount ?? 0);
    }
    setCompanies(firmy);
    setTypes(typy_dowodow_ksiegowych);
    setUnit(jednostka_miary);
  }, [descriptions, description, selectedCount]);

  useEffect(() => {
    if (descriptions?.length === 1) {
      setDescription(descriptions[0].id);
    } else if (
      selectedDescription &&
      descriptions?.find((e) => e.id === selectedDescription)
    ) {
      setDescription(selectedDescription);
    } else if (
      !description ||
      !descriptions?.find((e) => e.id === description)
    ) {
      setDescription(-1);
    }
  }, [selectedDescription, description, descriptions]);

  useEffect(() => {
    setOtherCompanyName("");
  }, [description]);

  useEffect(() => {
    if (company === -2) {
      return;
    } else if (companies?.length === 1) {
      setCompany(companies[0].id);
    } else if (
      selectedCompany &&
      companies?.find((e) => e.id === selectedCompany)
    ) {
      setCompany(selectedCompany);
    } else if (!company || !companies?.find((e) => e.id === company)) {
      setCompany(-1);
    }
  }, [selectedCompany, company, companies]);

  useEffect(() => {
    if (types?.length === 1) {
      setType(types[0].id);
    } else if (selectedType && types?.find((e) => e.id === selectedType)) {
      setType(selectedType);
    } else if (!type || !types?.find((e) => e.id === type)) {
      setType(-1);
    }
  }, [selectedType, type, types]);

  // after form submit clear sum field
  useEffect(() => {
    if (sumInput.current) {
      sumInput.current.value = sum.toString();
    }
  }, [sum]);

  const saveOperation = async () => {
    const response = await upsertExpense({
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
    });

    if (response?.message) {
      alert(response?.message);
    } else {
      setCategory(-1);
      setDate("");
      setNumber("");
      setSum(0);
      setComment("");
    }
  };

  return (
    <form
      action={saveOperation}
      className={classNames(
        className ?? "",
        "flex flex-col gap-y-3 sm:gap-y-2",
      )}
    >
      <select
        value={category}
        onChange={(e) => setCategory(parseInt(e.target.value, 10))}
        className="rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
      >
        <option disabled value={-1}>
          wybierz kategorię
        </option>
        {categories?.map((obj) => (
          <option key={obj.id} value={obj.id}>
            {obj.nazwa}
          </option>
        ))}
      </select>

      {category !== -1 && (
        <div className="flex flex-col gap-y-3 sm:gap-y-2">
          {descriptions?.length > 1 && (
            <select
              value={description}
              onChange={(e) => setDescription(parseInt(e.target.value, 10))}
              className="rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
            >
              <option disabled value={-1}>
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
              className="w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
            >
              <option disabled value={-1}>
                wybierz firmę
              </option>
              {companies?.map((obj) => (
                <option key={obj.id} value={obj.id}>
                  {obj.nazwa}
                </option>
              ))}
              <option value={-2} key="Inna">
                Inna
              </option>
            </select>
            {company === -2 && (
              <input
                onChange={(e) => setOtherCompanyName(e.target.value)}
                autoComplete="off"
                placeholder="wpisz nazwę firmy"
                type="text"
                name="otherCompany"
                id="otherCompany"
                value={otherCompanyName}
                className="ml-2 w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
              />
            )}
          </div>
          <div className="flex gap-x-2">
            <input
              onChange={(e) => setDate(e.target.value)}
              min={getStartDateFromEnv()?.toISOString().split("T")[0]}
              max={getEndDateFromEnv()?.toISOString().split("T")[0]}
              type="date"
              name="date"
              id="date"
              value={date}
              className="rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
            />
            <div className="flex w-full">
              <select
                value={type}
                onChange={(e) => setType(parseInt(e.target.value))}
                className="-mr-[1px] w-full rounded-l-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
              >
                <option disabled value={-1}>
                  wybierz typ dowodu ksiegowego
                </option>
                {types?.map((obj) => (
                  <option key={obj.id} value={obj.id}>
                    {obj.opis}
                  </option>
                ))}
              </select>
              <input
                onChange={(e) =>
                  setNumber(e.target.value.replaceAll("  ", " "))
                }
                value={number}
                maxLength={100}
                type="text"
                autoComplete="off"
                name="number"
                id="number"
                className="w-full rounded-r-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                placeholder="podaj numer dowodu księgowego"
              />
            </div>
          </div>
          <div className="flex gap-x-2">
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
                  className="w-full rounded-l-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                  placeholder="wpisz ilość"
                />
                <span className="inline-flex items-center rounded-none rounded-r-md border border-l-0 border-gray-300 px-3 text-gray-500 sm:text-sm">
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
                className="w-full rounded-l-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                placeholder="wpisz kwotę"
              />
              <span className="inline-flex items-center rounded-none rounded-r-md border border-l-0 border-gray-300 px-3 text-gray-500 sm:text-sm">
                zł
              </span>
            </div>
          </div>
          <textarea
            onChange={(e) =>
              setComment(
                e.target.value.replaceAll(" ,", ", ").replaceAll("  ", " "),
              )
            }
            name="comment"
            id="comment"
            value={comment}
            maxLength={300}
            className="rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
            placeholder="wpisz komentarz (opcjonalnie)"
          />
          <div className="mt-2 flex flex-col gap-y-3 sm:gap-y-2">
            {!alwaysBank && (
              <div className="flex items-center">
                <input
                  onChange={() => setCashChecked(true)}
                  checked={cashChecked}
                  id="default-radio-2"
                  type="radio"
                  name="default-radio"
                  className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <div
                  onClick={() => setCashChecked(true)}
                  className="ml-2 cursor-pointer text-sm font-medium text-gray-900"
                >
                  kasa
                </div>
              </div>
            )}
            <div className="flex items-center">
              <input
                onChange={() => setCashChecked(false)}
                checked={!cashChecked}
                id="default-radio-1"
                type="radio"
                name="default-radio"
                className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <div
                onClick={() => setCashChecked(false)}
                className="ml-2 cursor-pointer text-sm font-medium text-gray-900"
              >
                bank
              </div>
            </div>
          </div>
        </div>
      )}
      <button
        type="submit"
        className="mt-2 inline-flex justify-center self-start rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 disabled:bg-gray-300"
        disabled={
          !(
            company != null &&
            company !== -1 &&
            (company !== -2 ||
              (company === -2 &&
                otherCompanyName != null &&
                otherCompanyName !== "")) &&
            date != null &&
            date !== "" &&
            description != null &&
            description !== -1 &&
            type != null &&
            type !== -1 &&
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
