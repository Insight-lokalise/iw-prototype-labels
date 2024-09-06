import React, {
  createContext,
  useContext,
  useMemo,
  useReducer
} from 'react'

import { INITIAL_STATE } from './constants'
import TnCReducer from './reducer'
import useDispatcher from './use-dispatcher'

export const TnCContext = createContext({})

export function TnCContextProvider(props) {
  const [state, dispatch] = useReducer(TnCReducer, INITIAL_STATE)
  const {
    getSalesArea,
    getTnCs,
    publishDeleteTnC,
    setDefaultTnC,
    setFormValues,
    setNewTnC,
    setPublishDeleteTNC,
    setSelectedSalesArea,
    setTnCToUpdate,
    setContent,
  } = useDispatcher(dispatch)

  const contextValue = useMemo(() => ({
    actions: {
      getSalesArea,
      getTnCs,
      setDefaultTnC,
      setFormValues,
      setNewTnC,
      setPublishDeleteTNC,
      publishDeleteTnC,
      setSelectedSalesArea,
      setTnCToUpdate,
      setContent },
    ...state
  }), [state])

  return <TnCContext.Provider value={contextValue} {...props} />
}


export function useTnCsContext() {
  return useContext(TnCContext)
}

