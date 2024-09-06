const US_ACCOUNT_TYPE_OPTIONS = [
    {id: 'at1', value: 'smb', label:'Small/Medium business'},
    {id: 'at2', value: 'corporate', label:'Corporate/Enterprise'},
    {id: 'at3', value: 'federal', label:'Federal government'},
    {id: 'at4', value: 'state', label:'State and local government'},
    {id: 'at5', value: 'education', label:'Education'},
    {id: 'at6', value: 'other', label:'Other'},
]

const CA_ACCOUNT_TYPE_OPTIONS = [
  {id: 'at1', value: 'smb', label:'Small/Medium business'},
  {id: 'at2', value: 'corporate', label:'Corporate/Enterprise'},
  {id: 'at6', value: 'other', label:'Other'},
]

export function getAccountTypes(countryCode){
  return {
    US: US_ACCOUNT_TYPE_OPTIONS,
    CA: CA_ACCOUNT_TYPE_OPTIONS
  }[countryCode];
}

export function isReceiveInsightEmails(locale) {
  return locale && locale.split('_')[1] === 'US'
}




