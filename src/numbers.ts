// Round Number
export function round(number: number, precision = 0): number {
  return parseFloat(Number(number).toFixed(precision))
}