export default function formatMoney(amount = 0) {
  const options = {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  };
  const formatter = Intl.NumberFormat("en-US", options);

  // check if it's a clean dollar amount
  if (amount % amount === 0) {
    options.minimumFractionDigits = 0;
  }

  return formatter.format(amount / 100);
}
