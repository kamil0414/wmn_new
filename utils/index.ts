import { useEffect, useRef } from "react";

export const formatter = new Intl.NumberFormat("pl-PL", {
  style: "currency",
  currency: "PLN",
});

export const classNames = (...classes) => classes.filter(Boolean).join(' ')  

export const fetcher = (apiURL: string) => fetch(apiURL).then((res) => res.json())

export const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value; 
  },[value]); 
  return ref.current; 
}