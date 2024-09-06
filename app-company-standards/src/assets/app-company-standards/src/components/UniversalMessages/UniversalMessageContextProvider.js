import React, { useReducer } from 'react'
import PropTypes from 'prop-types'

import UniversalMessageContext from './UniversalMessageContext'

function messageContextProviderReducer(state, { type, payload }) {
  switch (type) {
    case 'SET_ACTIVE_MESSAGE':
      return { ...state, activeMessage: payload.activeMessage }
    case 'RESET':
      return payload
    default:
      return state
  }
}

export default function UniversalMessageContextProvider(props) {
  const [messageContextState, messageContextDispatch] = useReducer(messageContextProviderReducer, {
    activeMessage: null,
    setActiveMessage,
  })

  function setActiveMessage(activeMessage, activeMessageProps = {}) {
    messageContextDispatch({ type: 'SET_ACTIVE_MESSAGE', payload: { activeMessage, activeMessageProps } })
    setTimeout(() => messageContextDispatch({ type: 'SET_ACTIVE_MESSAGE', payload: {} }), 5000)
  }

  return (
    <UniversalMessageContext.Provider value={messageContextState}>{props.children}</UniversalMessageContext.Provider>
  )
}

UniversalMessageContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
