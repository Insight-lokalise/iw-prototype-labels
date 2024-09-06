import React, { Fragment } from "react";
import { AVAILABLE, SAME, UNAVAILABLE } from '@constants'
import {t} from "@insight/toolkit-utils/lib/labels";
import { Icon, Message } from '@insight/toolkit-react'
import PropTypes from "prop-types";

export default function LoginUserNameAvailability(props){
  const { availableUserName } = props
  return (
    <Fragment>
      { availableUserName === UNAVAILABLE &&
        <Message type="error">{t('Username is unavailable')}</Message>
      }
      { availableUserName === AVAILABLE &&
        <Message type="success">{t('Username is available')}</Message>
      }
      {availableUserName === SAME &&
        <Message type="info">{t('Current username')}</Message>
      }
    </Fragment>
  )
}

LoginUserNameAvailability.propTypes = {
  availableUserName: PropTypes.string.isRequired
}
