import React from 'react'
import PropTypes from 'prop-types'
import { Message as MessageComponent } from '@insight/toolkit-react'

import { MESSAGE_TYPES } from './'

export default function Message({ message, type }) {
  return (
    <div className="o-grid o-grid--justify-right">
      <div className="o-grid__item u-3/5">
        <MessageComponent className="c-cs-message u-font-size-small" type={type.toLowerCase()} ariaLive="polite">
          {message}
        </MessageComponent>
      </div>
    </div>
  )
}

Message.propTypes = {
  message: PropTypes.node.isRequired,
  type: PropTypes.oneOf(Object.keys(MESSAGE_TYPES)).isRequired,
}
