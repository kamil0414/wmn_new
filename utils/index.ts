export const formatter = new Intl.NumberFormat("pl-PL", {
  style: "currency",
  currency: "PLN",
});

export const classNames = (...classes) => classes.filter(Boolean).join(' ')  

export const fetcher = (apiURL: string) => fetch(apiURL).then((res) => res.json())