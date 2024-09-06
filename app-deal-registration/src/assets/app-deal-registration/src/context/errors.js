import React, {
    createContext,
    useContext,
    useMemo,
    useState
} from 'react'

const ErrorsContext = createContext(null)

export function ErrorsProvider(props) {
    const [currentError, setCurrentError] = useState('')
    const contextValue = useMemo(() => ({
        currentError,
        setCurrentError
    }), [currentError])

    return <ErrorsContext.Provider value={contextValue} {...props} />
}

export function useErrors() {
    const context = useContext(ErrorsContext)
    return context
}