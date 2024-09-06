import React from 'react'
import { scrollIntoView } from './utils/scrollIntoView'

/** UI Context */
export const UIContext = React.createContext({
  scrollIntoView: null,
})
UIContext.displayName = 'UIContext'

/** UI Context Provider
 *
 * Renders a provider containing global UI functionality
 * */
export const UIProvider = (props) => (
  <UIContext.Provider value={{ scrollIntoView }}>
    {props.children}
  </UIContext.Provider>
)
