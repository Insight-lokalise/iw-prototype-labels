export const clickedClass = "c-contracts__button--clicked c-button c-button--secondary"
export const unclickedClass = "c-contracts__button--unclicked c-button c-button--secondary"
export const freqOptions = [
  'Select One', 'Daily', 'Weekly', 'Bi-weekly', 'Monthly'
]
export const day = [
  'Select One', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
]

export const regions = [
  'Select One', 'NA', 'EMEA', 'APAC'
]

export const timezones = {
  NA: {
    regionCodes: [2400, 2500, 4100],
    timeZones: [
      {
        id: "default",
        text: "Please Select",
        name: "default",
      },
      {
        id: "Pacific/Honolulu",
        text: "Hawaii",
        name: "Pacific/Honolulu",
      },
      {
        id: "GMT-08:00",
        text: "Alaska Daylight savings Time",
        name: "GMT-08:00",
      },
      {
        id: "GMT-07:00",
        text: "Pacific Daylight savings Time",
        name: "GMT-07:00",
      },
      {
        id: "GMT-06:00",
        text: "Mountain Daylight savings Time",
        name: "GMT-06:00",
      },
      {
        id: "GMT-05:00",
        text: "Central Daylight savings Time",
        name: "GMT-05:00",
      },
      {
        id: "GMT-04:00",
        text: "Eastern Daylight savings Time",
        name: "GMT-04:00",
      },
      {
        id: "GMT-03:00",
        text: "Atlantic Daylight savings Time",
        name: "GMT-03:00",
      }
    ]
  },
  EMEA: {
    regionCodes: [7000, 7200, 7300, 7600, 7700, 7800, 8000, 8100, 8200, 8300, 8400],
    timeZones: [
      {
        id: "default",
        text: "Please Select",
        name: "default",
      },
      {
        id: "Europe/Dublin",
        text: "Irish Standard Time",
        name: "Europe/Dublin",
      },
      {
      id: "Etc/UTC",
      text: "Coordinated Universal Time",
      name: "Etc/UTC"
      },
      {
      id: "GMT",
      text: "Greenwich Mean Time",
      name: "GMT"
      },
      {
      id: "GMT+01:00",
      text: "British Summer Time",
      name: "GMT+01:00"
      },
      {
      id: "CET",
      text: "Central European Time",
      name: "CET"
      },
      {
      id: "GMT+02:00",
      text: "Central European Summer Time",
      name: "GMT+02:00"
      },
      {
      id: "EET",
      text: "Eastern European Time",
      name: "EET"
      },
      {
      id: "GMT+03:00",
      text: "Eastern European Summer Time",
      name: "GMT+03:00"
      },
      {
      id: "WET",
      text: "Western European Time",
      name: "WET"
      },
      {
      id: "Etc/GMT-1",
      text: "Western European Summer Time",
      name: "Etc/GMT-1"
      },
      {
      id: "Europe/Moscow",
      text: "Moscow Standard Time",
      name: "Europe/Moscow"
      }
    ]
  },
  APAC: {
    regionCodes: [6100, 6200, 6300, 6500, 6600],
    timeZones: [
      {
        id: "default",
        text: "Please Select",
        name: "default",
      },
      {
      id: "IST",
      text: "Indian Standard Time",
      name: "IST"
      },
      {
      id: "Asia/Shanghai",
      text: "China Standard Time",
      name: "Asia/Shanghai"
      },
      {
      id: "Asia/Tokyo",
      text: "Japan Standard Time",
      name: "Asia/Tokyo"
      },
      {
      id: "Asia/Singapore",
      text: "Singapore Time",
      name: "Asia/Singapore"
      },
      {
      id: "Asia/Hong_Kong",
      text: "Hong Kong Time",
      name: "Asia/Hong_Kong"
      },
      {
      id: "Australia/Sydney",
      text: "Australian Eastern Standard Time",
      name: "Australia/Sydney"
      },
      {
      id: "GMT+11:00",
      text: "Australian Eastern Daylight Time",
      name: "GMT+11:00"
      },
      {
      id: "Australia/Adelaide",
      text: "Australian Central Standard Time",
      name: "Australia/Adelaide"
      },
      {
      id: "GMT+10:30",
      text: "Australian Central Daylight Time",
      name: "GMT+10:30"
      },
      {
      id: "Australia/Perth",
      text: "Australian Western Standard Time",
      name: "Australia/Perth"
      },
      {
      id: "Pacific/Norfolk",
      text: "Norfolk Time",
      name: "Pacific/Norfolk"
      },
      {
      id: "Indian/Christmas",
      text: "Christmas Island Standard Time",
      name: "Indian/Christmas"
      },
      {
      id: "Indian/Cocos",
      text: "Cocos (Keeling) Islands Standard Time",
      name: "Indian/Cocos"
      },
      {
      id: "Pacific/Auckland",
      text: "New Zealand Standard Time",
      name: "Pacific/Auckland"
      },
      {
      id: "GMT+13:00",
      text: "New Zealand Daylight Time",
      name: "GMT+13:00"
      },
      {
      id: "Pacific/Chatham",
      text: "Chatham Island Standard Time",
      name: "Pacific/Chatham"
      },
      {
      id: "GMT+13:45",
      text: "Chatham Island Daylight Time",
      name: "GMT+13:45"
      }
    ]
  }
}

export const min = [
  'Select One', '00', '15', '30', '45'
]

export const delimiterOptions = [
  'Select One', 'Space', 'Tab', 'Comma', 'Pipe', 'OCI5'
]

export const PAGES = {
  CONTRACTS: 'contracts',
  OCCURRENCES: 'occurrences',
  DELIVERY: 'setup-delivery',
  CATALOG: 'catalog-info'
}

export const RUN_COUNT_LIMIT = 30000000
