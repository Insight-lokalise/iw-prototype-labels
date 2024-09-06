import React from 'react'
import { IWButton } from '../../../../libs/iw-components'
import { t } from '@insight/toolkit-utils/lib/labels'
import { navigateToSection } from '../../../../libs/routes/navigate'
import { enrollmentInfoToUpdate } from './../../../../libs/businessContainerApps/cart/helpers'
import cn from 'classnames'

export const CESCheckoutButtonView = (props) => {
  const {
    enrollmentInfo,
    history,
    isLoading,
    proceedToCheckout,
    secondary,
    quickCheckout,
    setActiveIndex,
    setDigitalDataCheckoutType,
    setIsLoading,
    setQuickCheckout,
    submitEnrollmentValues,
    isLoggedOutDefaultUser,
  } = props
  const checkoutLabel = quickCheckout ? 'Quick checkout' : 'Checkout'

  const proceedToQuickCheckout = async (quickCheckout) => {
    //isLoggedOutDefaultUser - redirect to login page
    setDigitalDataCheckoutType(checkoutLabel)
    if (isLoggedOutDefaultUser) {
      window.location = '/insightweb/login'
      return false
    }
    /****** isLoggedOutDefaultUser */
    setIsLoading(true)
    setQuickCheckout(quickCheckout)
    // Process DEP enrollment
    const { hasEnrollmentInfoToUpdate, optOutPartners, optInPartners } =
      enrollmentInfoToUpdate(enrollmentInfo)
    // Check if cart item contains enrollment information
    if (hasEnrollmentInfoToUpdate) {
      await submitEnrollmentValues({
        enrollments: optInPartners,
        removedIds: optOutPartners,
      })
    }
    const { value } = await proceedToCheckout({ quickCheckout })
    const { checkoutState } = value
    if (checkoutState === 'UNDEFINED') return
    props.fetchPopulateUIFlags()
    await props.getShoppingRequest()
    setIsLoading(false)
    navigateToSection(history, checkoutState, setActiveIndex)
  }

  return (
    <div className="o-grid__item u-1/1 row is-collapse-child hide-for-print">
      <div className="columns">
        <IWButton
          className={cn(
            { hollow: secondary && !quickCheckout },
            'expanded cart-summary__button'
          )}
          disabled={isLoading || enrollmentInfo?.isCheckoutDisabled}
          data-testid="quickcheckout"
          onClick={() => proceedToQuickCheckout(quickCheckout)}
        >
          {t(checkoutLabel)}
        </IWButton>
      </div>
    </div>
  )
}

export default CESCheckoutButtonView
