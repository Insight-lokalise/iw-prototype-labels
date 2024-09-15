import React, { createContext, useContext, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { addToast, dismissToast } from '@state/display'

const DisplayContext = createContext(null)

export function DisplayProvider(props) {
    const dispatch = useDispatch()

    const contextValue = useMemo(() => ({
        addToast: toast => dispatch(addToast(toast)),
        dismissToast: id => dispatch(dismissToast(id))
    }), [])

    return <DisplayContext.Provider value={contextValue} {...props} />
}

export function useDisplay() {
    const context = useContext(DisplayContext)
    return context
}