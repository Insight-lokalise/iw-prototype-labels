import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef
} from 'react'
import { getUser } from '@api'

const PurposeContext = createContext(null)

export function PurposeProvider(props) {
    const purpose = useRef({
        country: null,
        deal: null,
        form: null,
        manufacturer: null,
        proram: null,
        user: null
    })

    useEffect(() => {
        // This should only run if in prod mode
        getUser()
            .then(user => { purpose.user.current = user })
            // Need to dispatch this error through the Logging service to post to server on error
            .catch(err => {})
    })

    function getPurpose() {
        return purpose.current
    }

    function updatePurpose(newPurpose) {
        purpose.current = { ...purpose.current, ...newPurpose }
    }

    function updatePurposeKey({ key, value }) {
        purpose.current[key] = value
    }

    const contextValue = useMemo(() => ({
        getPurpose,
        updatePurpose,
        updatePurposeKey
    }), [])

    return <PurposeContext.Provider value={contextValue} {...props} />
}

export function usePurpose() {
    const purpose = useContext(PurposeContext)
    return purpose
}