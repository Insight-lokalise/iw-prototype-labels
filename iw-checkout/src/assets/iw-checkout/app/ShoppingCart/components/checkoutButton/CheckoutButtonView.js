import PropTypes from 'prop-types'
import cn from 'classnames'
import React from 'react'

import { t } from '@insight/toolkit-utils/lib/labels'
import { navigateToSection } from '../../../../libs/routes/navigate'
import { IWButton } from '../../../../libs/iw-components'
import {enrollmentInfoToUpdate} from './../../../../libs/businessContainerApps/cart/helpers'

const CheckoutButtonView = (props) => {
    const {
        enableAddShippingButton,
        enrollmentInfo,
        freightTax,
        history,
        haltUserProgressFromCart,
        hasSavedRequestorGroup,
        isB2BUser,
        isB2BTransfer,
        isLoggedIn,
        isLoading,
        isLimitedUser,
        quickCheckout,
        secondary,
        setActiveIndex,
        setDigitalDataCheckoutType,
        setIsLoading,
        submitEnrollmentValues,
        taxIsPending,
        userInformation,
        userRequiresApproval,
    } = props
    const addShipping = t('Add Shipping')
    const checkoutDestLabel = quickCheckout ? 'Quick checkout' : (isB2BTransfer ? 'Submit' : 'Checkout')
    const showAddShippingButton = (enableAddShippingButton && isB2BUser && freightTax)

    function validateCart(e) {
        const isValidCheckout = !(isLoggedIn && userInformation && userRequiresApproval && !hasSavedRequestorGroup)
        if (isValidCheckout) {
            return true
        } else {
            if (!hasSavedRequestorGroup || props.numberOfRequestorGroups > 0) {
                props.showRequiredRequestorGroupMessage()
            }
            e.preventDefault()
            e.stopPropagation()
            return false
        }
    }

    function proceedToCheckout(quickCheckout, e) {
        setIsLoading(true)
        setDigitalDataCheckoutType(checkoutDestLabel)
        const {hasEnrollmentInfoToUpdate, optOutPartners, optInPartners} = enrollmentInfoToUpdate(enrollmentInfo)
        if (!validateCart(e)) {
            setIsLoading(false)
            return false;
        }else{
            hasEnrollmentInfoToUpdate ? submitEnrollmentValues({enrollments: optInPartners , removedIds: optOutPartners }).then(() => {
                triggerCheckout(e)
            }) : triggerCheckout(e)
        }
    }

    function triggerCheckout(e){
        props.setQuickCheckout(quickCheckout)
        if (!validateCart(e)) return false;
        if (!isLoggedIn) {
            window.location = '/insightweb/login'
            return false;
        }

        const maybeSaveSpla = props.isUsagePeriodReportableCart
            ? props.saveSPLAUsage(props.usageReportingHistory.monthToReport)
            : Promise.resolve()

        maybeSaveSpla.then(()=>{
            props.proceedToCheckout({quickCheckout})
                .then(({value})=>{
                    const { checkoutState } = value
                    if(checkoutState === 'UNDEFINED') return
                    props.fetchPopulateUIFlags()
                    props.getShoppingRequest().then(()=>{
                        setIsLoading(false)
                        if(isB2BUser){
                            redirect(history, '/cartTransferPage' , setActiveIndex)
                            const { eProcType, extrinsic, token } = props.b2bProps
                            return props.triggerTransferCartAfterGetCart({ cancel: false, eProcType, extrinsic, token })
                        }else {
                            navigateToSection(history, checkoutState ,setActiveIndex)
                        }
                    })
                })
        })
    }

    function onAddShippingClick(e) {
        if (!validateCart(e)) return false;
        const maybeSaveSpla = props.isUsagePeriodReportableCart
            ? props.saveSPLAUsage(props.usageReportingHistory.monthToReport)
            : Promise.resolve()
        maybeSaveSpla
                .then(()=>{
                    props.proceedToCheckout({quickCheckout})
                    .then(({value})=>{
                        const { checkoutState } = value
                        if(checkoutState === 'UNDEFINED') return
                        props.fetchPopulateUIFlags()
                        props.getShoppingRequest().then(()=>{
                            const { checkoutState } = value
                            navigateToSection(history, checkoutState ,setActiveIndex)
                        })
                    })
                })
    }

    return !haltUserProgressFromCart &&
            <div className="row is-collapse-child hide-for-print">
                <div className="columns">
                    { showAddShippingButton &&
                        <span>
                            <IWButton alt={addShipping} title={addShipping} className="hollow small expanded cart-summary__button"
                                onClick={onAddShippingClick}>
                                {addShipping}
                            </IWButton>
                            <hr className="cart-summary__hline"/>
                        </span>
                    }
                    <IWButton className={cn({ 'hollow': secondary && !quickCheckout && !isB2BUser && !isLimitedUser }, 'expanded cart-summary__button')}
                        onClick={isB2BTransfer ? initiateClientPunchout : proceedToCheckout.bind(null, quickCheckout)}
                        disabled={taxIsPending || enrollmentInfo.isCheckoutDisabled || isLoading}>
                        {t(checkoutDestLabel)}
                    </IWButton>
                </div>
            </div>
}

function initiateClientPunchout() {
    var ele = document.querySelector('#hiddenFormSubmit')
    ele.submit()
}

function redirect(history, pathname, setActiveIndex) {
    history.push({ pathname })
    setActiveIndex('SBP', 0)
    setActiveIndex('LineLevel', 0)
}


CheckoutButtonView.propTypes = {
    b2bLoginInfo: PropTypes.object.isRequired,
    enrollmentInfo: PropTypes.object.isRequired,
    fetchTransferCart: PropTypes.func.isRequired,
    freightTax: PropTypes.bool.isRequired,
    haltUserProgressFromCart: PropTypes.bool.isRequired,
    hasSavedRequestorGroup: PropTypes.bool.isRequired,
    isB2BTransfer: PropTypes.bool,
    isB2BUser: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isUsagePeriodReportableCart: PropTypes.bool,
    numberOfRequestorGroups: PropTypes.number,
    saveSPLAUsage: PropTypes.func.isRequired,
    secondary: PropTypes.bool,
    setDigitalDataCheckoutType: PropTypes.func.isRequired,
    setIsB2BTransferPage: PropTypes.func.isRequired,
    usageReportingHistory: PropTypes.object.isRequired,
    userInformation: PropTypes.object,
    userRequiresApproval: PropTypes.bool.isRequired,
    enableAddShippingButton: PropTypes.bool.isRequired,
    quickCheckout: PropTypes.bool.isRequired,
}

CheckoutButtonView.defaultProps = {
    enableAddShippingButton: false,
    quickCheckout: false,
    secondary: false,
}


export default CheckoutButtonView
