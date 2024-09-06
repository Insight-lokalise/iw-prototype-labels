import { createContext } from 'react'

const UniversalMessageContext = createContext({
  activeMessage: null,
  setActiveMessage: () => {},
})

export default UniversalMessageContext
