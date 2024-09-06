import React, { createContext } from 'react'
import { useUserSession } from '../hooks/useUserSession'

/** Session Context
 *
 * Used to store the state of the current session
 * */
export const SessionContext = createContext({
  /** The current session user */
  user: null,
})

/** Session Context Provider
 *
 * Renders the current state of the session adding the responses to the context
 * */
export const SessionContextProvider = ({ children }) => {
  const [user, loading] = useUserSession()
  // Prevent rendering when loading the user session
  if (loading) return null
  return (
    <SessionContext.Provider
      value={{
        user,
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}
