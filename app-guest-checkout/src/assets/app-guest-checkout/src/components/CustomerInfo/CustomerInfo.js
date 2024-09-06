import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getCurrentLocale } from '@insight/toolkit-utils/lib/helpers'
import {
  hasStorage,
  getStorage,
} from '@insight/toolkit-utils/lib/helpers/storageHelpers'
import { Panel, Summary } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils/lib/labels'
import { validateEmail } from '@insight/toolkit-utils/lib/helpers/validators'
import { setCookie } from '@insight/toolkit-utils/lib/helpers/cookieHelpers'
import {
  selector_shoppingRequest,
  selector_cart,
  selector_warrantyContactInfo,
} from '../../state/slices/selectors/ShoppingReqeustSelector'
import { selector_lineLevelSessionInfos } from '../../state/slices/selectors/lineLevelSessionInfosSelector'
import { CustomerInfoForm } from './CustomerInfoForm'
import CustomerInfoModal from './CustomerInfoModal'
import {
  checkIfExistingUser,
  createCustomerInfo,
  fetchNextStep,
} from '../../api'
import { nextStepMap } from '@constants'
import { save as saveShoppingRequest } from '../../state/slices/shoppingRequestSlice'
import { save as saveLineLevelSessionInfos } from '../../state/slices/lineLevelSessionInfosSlice'
import { Helmet } from 'react-helmet'

export default function CustomerInfo() {
  const dispatch = useDispatch()
  const [showModal, setShowModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [customerInfoFieldValues, setCustomerInfoFieldValues] = useState(null)
  const locale = getCurrentLocale('insight_current_locale')
  const cart = useSelector((cartData) => selector_cart(cartData))
  const shoppingRequest = useSelector(selector_shoppingRequest)
  const lineLevelSessionInfos = useSelector(selector_lineLevelSessionInfos)
  const warrantyInfo = useSelector(selector_warrantyContactInfo)

  const updateState = (shoppingRequest, lineLevelSessionInfos) => {
    dispatch(saveShoppingRequest(shoppingRequest))
    dispatch(saveLineLevelSessionInfos(lineLevelSessionInfos))
  }
  const onSubmit = async (values) => {
    const payload = { ...values, locale }
    //1.check if email exist
    setIsLoading(true)
    const isExistingUser = await checkIfExistingUser(values?.email)
    setIsLoading(false)
    //2. handle cases based on response
    if (isExistingUser) {
      setIsLoading(false)
      setShowModal(true)
      setCustomerInfoFieldValues(values)
    } else {
      setIsLoading(true)
      await createCustomerAndPopulateUICall(payload)
      setIsLoading(false)
    }
  }
  const validateForm = (values) => {
    const errors = {}
    const phoneNumRegExp =
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
    if (!values.firstName) {
      errors.firstName = t('Please enter first name.')
    }
    if (!values.lastName) {
      errors.lastName = t('Please enter last name.')
    }
    if (!values.phoneNumber || !phoneNumRegExp.test(values.phoneNumber)) {
      errors.phoneNumber = t('Please enter a valid Phone.')
    }
    if (!values.email || !validateEmail(values.email)) {
      errors.email = t('Please enter a valid email address.')
    }
    return errors
  }
  const onSignIn = () => (window.location = '/insightweb/login')
  const onGuestCheckout = async () => {
    setIsLoading(true)
    await createCustomerAndPopulateUICall(customerInfoFieldValues)
    setIsLoading(false)
  }
  const onClose = () => setShowModal(false)

  const createCustomerAndPopulateUICall = async (formDetails) => {
    const userObject = {
      firstName: formDetails.firstName,
      lastName: formDetails.lastName,
      email: formDetails.email,
      phone: formDetails.phoneNumber,
    }
    const warrantyName = warrantyInfo?.name.split(/ (.*)/, 2)
    const warrantyObject = {
      firstName: warrantyInfo ? warrantyName[0] : formDetails.firstName,
      lastName: warrantyInfo ? warrantyName[1] : formDetails.lastName,
      email: warrantyInfo ? warrantyInfo.email : formDetails.email,
      phone: warrantyInfo ? warrantyInfo.phone : formDetails.phoneNumber,
    }

    const customerInfo = await createCustomerInfo({
      user: userObject,
      warrantyContact: warrantyObject,
      licenseContact: userObject,
      shoppingRequest,
      lineLevelSessionInfos,
      locale,
      loginTypeId: 10,
      ips: false,
      sewp: false,
      loginAs: false,
    })
    updateState(
      customerInfo.shoppingRequest,
      customerInfo.lineLevelSessionInfos
    )
    const quickCheckoutRequested = hasStorage('quickCheckoutRequested')
      ? getStorage('quickCheckoutRequested')
      : false
    const { checkoutState } = await fetchNextStep({
      source: 'CUSTOMER_INFO',
      quickCheckoutRequested,
      shoppingRequest: customerInfo.shoppingRequest,
      lineLevelSessionInfos: customerInfo.lineLevelSessionInfos,
    })
    window.location = `/insightweb${nextStepMap[checkoutState]}`
  }

  setCookie('guest-checkout-enabled', true)

  return (
    <div className="o-grid">
      <Helmet>
        <title>{t('Customer information')}</title>
        <meta name="description" content={t('Customer information page')} />
      </Helmet>
      <div className="o-grid__item c-guest-checkout_customer-info">
        <div className="c-guest-checkout_customer-info--header">
          <h2 className="u-text-bold u-h5 u-margin-bot-none title">
            {t('Customer information')}
          </h2>
        </div>
        <Panel className="c-guest-checkout-panel">
          <Panel.Body>
            <CustomerInfoForm
              isLoading={isLoading}
              onSubmit={onSubmit}
              validateForm={validateForm}
            />
            {showModal && (
              <CustomerInfoModal
                isOpen={showModal}
                onClose={onClose}
                onSignIn={onSignIn}
                onGuestCheckout={onGuestCheckout}
                isLoading={isLoading}
              />
            )}
          </Panel.Body>
        </Panel>
      </div>
      <div className="c-app-quote-details__top__summary o-grid__item u-1/4@desktop u-2/5@tablet u-1/1">
        <Summary
          currencyCode={shoppingRequest?.soldTo?.currencyCode}
          subtotal={cart?.summary?.subTotal}
          showEstimateMessage={true}
        />
      </div>
    </div>
  )
}
