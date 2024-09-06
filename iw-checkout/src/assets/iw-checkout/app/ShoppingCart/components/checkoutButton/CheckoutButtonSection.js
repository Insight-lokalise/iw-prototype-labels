import React, { Fragment, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils/lib/labels'
import CheckoutButton from './CheckoutButton'
import {
  selector_hasQuickCheckoutPermission,
  selector_isLimitedUser,
} from '../../../../libs/User/selectors'
import CESCheckoutButton from './CESCheckoutButton'
import {
  setDigitalDataCheckoutType
} from "../../../../libs/businessContainerApps/cartSummary/actions/cartSummaryActions";

export const CheckoutButtonSection = (props) => {
  const [state, setState] = useState({ isLoading: false })

  const setIsLoading = (isLoading) => setState({ isLoading })
  const { enableQuickCheckout, isCES, isLimitedUser, isLoggedOutDefaultUser } =
    props
  const isCESLimitedUser = isLimitedUser && isCES

  if (!isCES && !isLoggedOutDefaultUser) {
    return (
      <Fragment>
        {props.enableQuickCheckout && (
          <CheckoutButton
            {...props}
            setIsLoading={setIsLoading}
            isLoading={state.isLoading}
            quickCheckout
          />
        )}

        <CheckoutButton //rendered for non CES users
          {...props}
          setIsLoading={setIsLoading}
          isLoading={state.isLoading}
          secondary={props.enableQuickCheckout}
          enableAddShippingButton
        />
      </Fragment>
    )
  }

  const renderCheckout = () => {
    if (isCESLimitedUser) {
      return (
        <Fragment>
          {enableQuickCheckout ? (
            <>
              <CESCheckoutButton
                {...props}
                setIsLoading={setIsLoading}
                isLoading={state.isLoading}
                quickCheckout
              />
              <CESCheckoutButton
                {...props}
                setIsLoading={setIsLoading}
                isLoading={state.isLoading}
                quickCheckout={false}
                secondary
              />
            </>
          ) : (
            <CESCheckoutButton
              {...props}
              setIsLoading={setIsLoading}
              isLoading={state.isLoading}
            />
          )}
        </Fragment>
      )
    } else {
      return (
        <Fragment>
          {isCES ? (
            <>
              <CESCheckoutButton
                {...props}
                setIsLoading={setIsLoading}
                isLoading={state.isLoading}
                quickCheckout
              />
              <CESCheckoutButton
                {...props}
                setIsLoading={setIsLoading}
                isLoading={state.isLoading}
                quickCheckout={false}
                secondary
              />
            </>
          ) : (
            <CESCheckoutButton
              {...props}
              setIsLoading={setIsLoading}
              isLoading={state.isLoading}
            />
          )}
        </Fragment>
      )
    }
  }
  return (
    <Fragment>
      {renderCheckout()}
      {!isLimitedUser && isCES && (
        <div className="o-grid__item u-1/1 row is-collapse-child hide-for-print c-cart-summary-simple__quicktext">
          <div className="columns">
            {t('*Quick checkout will use default options.')}
          </div>
        </div>
      )}
    </Fragment>
  )
}

function mapStateToProps(state) {
  return {
    enableQuickCheckout: selector_hasQuickCheckoutPermission(state),
    isLimitedUser: selector_isLimitedUser(state),
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
      setDigitalDataCheckoutType(checkoutType) {
        dispatch(setDigitalDataCheckoutType(checkoutType))
      },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutButtonSection)

CheckoutButtonSection.propTypes = {
  showRequiredRequestorGroupMessage: PropTypes.func,
}
