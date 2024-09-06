import React, { useReducer } from 'react'
import PropTypes from 'prop-types'

import ModalContext from './ModalContext'

function modalContextProviderReducer(state, { type, payload }) {
  switch (type) {
    case 'SET_ACTIVE_MODAL':
      return { ...state, activeModal: payload.activeModal, activeModalProps: payload.activeModalProps }
    case 'RESET':
      return payload
    default:
      return state
  }
}

export default function ModalContextProvider(props) {
  const [modalContextState, modalContextDispatch] = useReducer(modalContextProviderReducer, {
    activeModal: null,
    activeModalProps: {},
    closeModal,
    setActiveModal,
  })

  function closeModal() {
    modalContextDispatch({ type: 'SET_ACTIVE_MODAL', payload: { activeModal: null, activeModalProps: {} } })
  }

  function setActiveModal(activeModal, activeModalProps = {}) {
    modalContextDispatch({ type: 'SET_ACTIVE_MODAL', payload: { activeModal, activeModalProps } })
  }

  return <ModalContext.Provider value={modalContextState}>{props.children}</ModalContext.Provider>
}

ModalContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
