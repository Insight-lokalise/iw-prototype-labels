import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { selector_isEnableCreditCardMessage } from "./selectors"
import { t } from '@insight/toolkit-utils/lib/labels'
import "./CreditCardMessage.scss"

export const creditCardMessage = t('* Any orders placed with Insight that are paid for using a credit card, may be subject to a credit card merchant fee applied to the total value of the order.  This fee will be calculated based on the lowest % applied across credit card merchants at the time of the order being processed.')

const CreditCardMessage = ({ isShowMsg, paymentType }) => {
    if(!isShowMsg) return null
    if(paymentType) {
      return (
        <div id="cc-msg-id" className='column small-12 medium-10 large-10'>
          <div className="cc-msg">{creditCardMessage}</div>
        </div>
      )
    }
    return (
      <div id="cc-msg-id" className="row expanded is-collapse-child">
        <div className="columns small-12 medium-11 large-11 cc-msg">
          {creditCardMessage}
        </div>
      </div>
    )
}

CreditCardMessage.propTypes = {
    paymentType: PropTypes.number
}

const mapStateToProps = (state, ownProps) => ({
    isShowMsg: selector_isEnableCreditCardMessage(state, ownProps)
})

export default connect(mapStateToProps)(CreditCardMessage)
