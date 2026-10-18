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
