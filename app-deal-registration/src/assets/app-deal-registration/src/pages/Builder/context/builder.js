import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState
} from 'react'
import { useDispatch } from 'react-redux'

import { createUniversalTemplate } from '@services/builder'
import { initBuilderState } from '@state/builder'
import { generateBuilderData, getFormName } from '../helpers'
import { useBuilder } from '../hooks'
import { SIDEBAR_MENU_OPTIONS } from '@constants'

const BuilderContext = createContext(null)

export function BuilderProvider({ display, location, purpose, ...rest }) {
    const dispatch = useDispatch()
    const isEdit = !!(location.state && location.state.edit)
    const [activeStep, setActiveStep] = useState(1)
    const [isLoading, setLoading] = useState(true)
    const [groupFilter, setGroupFilter] = useState(SIDEBAR_MENU_OPTIONS.custom)
    
    const dispatchForEdit = () => {
        const { selectedForm } = purpose.getPurpose()
        dispatch(initBuilderState(selectedForm))
    }

    const dispatchForNew = () => {
        const custom = generateBuilderData()
        const universal = createUniversalTemplate(purpose.getPurpose().selectedCountry.region)
        const formData = {
            groupIds: [...universal.groupIds, ...custom.groupIds],
            groups: { ...universal.groups, ...custom.groups },
            inputs: { ...universal.inputs, ...custom.inputs },
            layouts: { ...universal.layouts, ...custom.layouts },
            styles: { ...universal.styles, ...custom.styles }
        }
        dispatch(initBuilderState(formData, true))
    }

    useEffect(() => {
        const savedForm = window.localStorage.getItem(getFormName(purpose.getPurpose()))
        if (savedForm) {
            const onClose = () => {
                const handler = isEdit ? dispatchForEdit : dispatchForNew
                handler()
                setLoading(false)
            }
            const reload = () => {
                dispatch(initBuilderState(JSON.parse(savedForm), true))
                setLoading(false)
            }
            
            const modalProps = { onClose, reload }
            return display.addModal({ modalProps, modalType: 'reload' })
        }

        if (isEdit) {
            dispatchForEdit()
            return setLoading(false)
        }

        dispatchForNew()
        setLoading(false)
    }, [])

    const builder = useBuilder({ activeStep, display, isEdit, purpose, setActiveStep })
    const contextValue = useMemo(() => ({
        activeStep,
        isLoading,
        groupFilter,
        setGroupFilter,
        ...builder
    }), [activeStep, isLoading, groupFilter])

    return <BuilderContext.Provider value={contextValue} {...rest} />
}

export function useBuilderContext() {
    const context = useContext(BuilderContext)
    return context
}
