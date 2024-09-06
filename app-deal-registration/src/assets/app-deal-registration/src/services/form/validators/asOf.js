export function asOf() {
  return value => {
    const today = new Date((new Date()).toString().substring(0, 15))
    if (value && (new Date(value) < today)) {
      return 'Sorry, this date needs to be today or later'
    }
  }
}

export function asOfDDMMYYYY() {
  return value => {
    if (value) {
      const fdate = value.substring(3,5) + '/' + value.substring(0,2) + '/' + value.substring(6,10)
      return asOf()(fdate)
    }
  }
}
