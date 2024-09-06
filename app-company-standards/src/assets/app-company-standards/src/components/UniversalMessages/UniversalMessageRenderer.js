import React, { useContext } from 'react'

import Message from './Message'
import UniversalMessageContext from './UniversalMessageContext'
// TODO: use Popover once update to packages is complete

export default function UniversalMessageRenderer() {
  const { activeMessage } = useContext(UniversalMessageContext)

  return activeMessage ? <Message message={activeMessage.text} type={activeMessage.type} /> : null
}
