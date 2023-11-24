import { useEffect, useRef } from "react";

export const formatter = new Intl.NumberFormat("pl-PL", {
  style: "currency",
  currency: "PLN",
});

export const classNames = (...classes) => classes.filter(Boolean).join(" ");

export const fetcher = (apiURL: string) =>
  fetch(apiURL).then((res) => res.json());

export const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};

export const getEndDateFromEnv = () => {
  const envYear = process.env.NEXT_PUBLIC_YEAR;
  if (
    envYear &&
    envYear !== "" &&
    envYear !== new Date().getFullYear().toString()
  ) {
    return new Date(Date.UTC(parseInt(envYear, 10), 11, 31));
  }
  return new Date();
};

export const getStartDateFromEnv = () => {
  const envYear = process.env.NEXT_PUBLIC_YEAR;
  const year =
    envYear && envYear !== ""
      ? parseInt(envYear, 10)
      : new Date().getFullYear();
  return new Date(Date.UTC(year, 0, 1));
};

export const endDate = getEndDateFromEnv().toISOString().split("T")[0];
