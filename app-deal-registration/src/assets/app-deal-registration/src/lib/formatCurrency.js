export default function formatCurrencyValue (value) {
  if (value !== "") {
    const num = Number.parseFloat(value).toFixed(2)
    return num
  }
  return value
}
