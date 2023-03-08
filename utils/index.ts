export const formatter = new Intl.NumberFormat("pl-PL", {
  style: "currency",
  currency: "PLN",
});

export const classNames = (...classes) => classes.filter(Boolean).join(' ')  
