import React from 'react'
import PropTypes from 'prop-types'

import { IWButton } from '../'

// see shippingAddressForm.js for implementation.
// DON'T FORGET TO PASS IN {...this.props} or you wont have the necessary redux form functions
export default function IWForm(props) {
  const classNameOfButton = props.buttonClassName || 'section__button no-margin-bot'
  return (
    <form onSubmit={props.handleSubmit(props.onSubmit)}>
      <div>{props.children}</div>
      <div className="column">
        <IWButton className={classNameOfButton} type="submit">
          {props.buttonText}
        </IWButton>
      </div>
    </form>
  )
}

IWForm.propTypes = {
  buttonClassName: PropTypes.string,
  buttonText: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
}
