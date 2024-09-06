import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'

import { dismissModal } from '@state/display'
import { MODAL_TYPE_MAP } from './types'

export default function ModalRoot() {
    const dispatch = useDispatch()
    const { modalProps, modalType } = useSelector(state => state.display)
    
    if (!modalProps && !modalType) {
        return null
    }

    const onClose = () => {
        if (modalProps.onClose) {
            modalProps.onClose()
        }
        dispatch(dismissModal())
    }

    if (MODAL_TYPE_MAP[modalType]) {
        const props = { ...modalProps, onClose }
        console.log(props)
        return MODAL_TYPE_MAP[modalType]({ ...modalProps, onClose })
    }

    return null
}