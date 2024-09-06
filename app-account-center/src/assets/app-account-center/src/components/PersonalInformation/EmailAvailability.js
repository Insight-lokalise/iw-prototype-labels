import React, { Fragment } from 'react'
import { AVAILABLE, SAME, UNAVAILABLE } from '@constants'
import { t } from '@insight/toolkit-utils/lib/labels'
import { Message } from '@insight/toolkit-react'
import PropTypes from 'prop-types'

export default function EmailAvailability(props) {
  const { availableEmail } = props
  return (
    <Fragment>
      {availableEmail === UNAVAILABLE && (
        <Message type="error">{t('Email address is unavailable')}</Message>
      )}
    </Fragment>
  )
}

EmailAvailability.propTypes = {
  availableEmail: PropTypes.string.isRequired,
}
