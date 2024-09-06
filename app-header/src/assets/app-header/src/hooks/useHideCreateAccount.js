import { useContext } from 'react'

import IAHeaderContext from '../context/IAHeaderContext'

export default function useHideCreateAccount() {
  const { 
    headerInfo: { locale } 
  } = useContext(IAHeaderContext)

  const countryCode = locale.toUpperCase().split('_')[1]
  const hideCreateAccountLocaleMap = {
    "IE": true,
    "SE": true,
    "NL": true,
  }  
  return hideCreateAccountLocaleMap[countryCode] ? true : false
}
