const padTo2Digits = (num) => num.toString().padStart(2, '0')

export const formatDate = (date) => `${[
  date.getFullYear(),
  padTo2Digits(date.getMonth() + 1),
  padTo2Digits(date.getDate()),
].join('-')
  }`

export const parseTimeToUTCFormat = (date) => `${[
  padTo2Digits(date.getUTCHours()),
  padTo2Digits(date.getUTCMinutes()),
  padTo2Digits(date.getUTCSeconds()),
].join(':')
  }`
