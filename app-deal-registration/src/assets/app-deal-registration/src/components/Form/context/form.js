import { createContext, useContext } from 'react'

export const FormContext = createContext(null)

export const useFormContext = () => {
    const context = useContext(FormContext)
    return context
}