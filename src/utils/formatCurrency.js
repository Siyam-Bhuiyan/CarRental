const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

// formatCurrency(484.71) -> "$484.71", formatCurrency(-96.94) -> "-$96.94"
export function formatCurrency(amount) {
  const value = formatter.format(Math.abs(amount));
  return amount < 0 ? `-${value}` : value;
}

export function roundMoney(amount) {
  return Math.round(amount * 100) / 100;
}

// percent of an amount, rounded to the cent using integer cents (avoids 3.175 -> 3.17 float
// surprises, so the checkout, the stored journey and the charge always agree).
export function percentOf(amount, percent) {
  return Math.round((Math.round(amount * 100) * percent) / 100) / 100;
}
