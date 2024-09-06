import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef
} from 'react'
import LogRocket from 'logrocket'

import { getUser } from '@api'
import { IS_DEV } from '@lib'

const PurposeContext = createContext(null)

let currentUser = null

export function PurposeProvider(props) {
    const purpose = useRef({
        selectedCountry: null,
        selectedDeal: null,
        selectedForm: null,
        selectedManufacturer: null,
        selectedProgram: null,
        currentUser: {
            employeeID: '1093',
            name: 'test'
        }
    })
    useEffect(() => {
        if (currentUser) {
            return
        }

        const resolver = promise => promise.then(user => {
            currentUser = user
            purpose.current.currentUser = user
            if (!IS_DEV) {
                LogRocket.init('7quqok/dealreg')
                LogRocket.info(`Environment is ${process.env.NODE_ENV}`)
                LogRocket.identify(user.name)
            }
        }).catch(err => {})

        if (process.env.NODE_ENV && process.env.NODE_ENV === 'development') {
            return resolver(Promise.resolve({ employeeID: '1093', name: 'test' }))
        }

        resolver(getUser())
    }, [])

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
