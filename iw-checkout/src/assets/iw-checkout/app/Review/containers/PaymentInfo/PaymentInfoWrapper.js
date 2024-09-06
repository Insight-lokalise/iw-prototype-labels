import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { t } from '@insight/toolkit-utils/lib/labels'
import { getEnvironmentName } from '@insight/toolkit-utils/lib/helpers/getEnvironmentName'
import PaymentInfo from './../../components/PaymentInfo/PaymentInfoSection'
import {
  selector_isB2BUser,
  selector_isEMEA,
} from './../../../../libs/User/selectors'
import { selector_isQuickCheckout } from './../../../../libs/Cart/selectors/shoppingCartView'

function PaymentInfoWrapper(props) {
  const { history, isB2BUser, isEMEA } = props
  const paymentInfoTitle = t('Payment info')
  const testEnvironmentMessage = t(
    '**This is a test environment. This is not a live transaction**'
  )
  const shouldRender = !isB2BUser
  const LOCALHOST = 'localhost'
  const isLocalhost = window.location.origin.includes(LOCALHOST)
  const environment = isLocalhost
    ? LOCALHOST
    : getEnvironmentName(window.location.origin)

  return (
    shouldRender && (
      <section className="section">
        <div className="row expanded section__header is-collapse-child">
          <h3 className="columns shrink section__header-title">
            {paymentInfoTitle}
          </h3>
        </div>
        {environment !== 'prod' && environment !== 'pre' && !isEMEA && (
          <div className="row expanded section__header is-collapse-child section__test_environment">
            <span className="columns shrink">{testEnvironmentMessage}</span>
          </div>
        )}
        <div className="section__body" data-private="true">
          <PaymentInfo className="payment-info" history={history} {...props} />
        </div>
      </section>
    )
  )
}

function mapStateToProps(state) {
  return {
    isB2BUser: selector_isB2BUser(state),
    isQuickCheckout: selector_isQuickCheckout(state),
    isEMEA: selector_isEMEA(state),
  }
}

export default connect(mapStateToProps)(memo(PaymentInfoWrapper))

PaymentInfoWrapper.propTypes = {
  isReadOnly: PropTypes.bool.isRequired,
  isCollapsed: PropTypes.bool.isRequired,
  ownIndex: PropTypes.number.isRequired,
  setActiveIndex: PropTypes.func.isRequired,
  history: PropTypes.object,
  isB2BUser: PropTypes.bool.isRequired,
  redirectToSBPOnEdit: PropTypes.bool,
  isQuickCheckout: PropTypes.bool,
  isEMEA: PropTypes.bool.isRequired,
}
