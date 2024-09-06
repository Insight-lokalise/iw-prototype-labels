import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Field, Form } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils';
import { hasStorage, getStorage } from "@insight/toolkit-utils/lib/helpers/storageHelpers";
import { validateEmail } from "@insight/toolkit-utils/lib/helpers/validators";
import { getCurrentLocale } from '@insight/toolkit-utils/lib/helpers'
import { US_PHONE_NUMBER_PATTERN, nextStepMap } from '@constants'
import {
  selector_orderMetaData,
  selector_shoppingRequest,
  selector_warrantyContactInfo,
  selector_userInfo
} from '../../state/slices/selectors/ShoppingReqeustSelector'
import { selector_lineLevelSessionInfos } from '../../state/slices/selectors/lineLevelSessionInfosSelector'
import { createCustomerInfo, fetchNextStep  } from '../../api'
import {save as saveShoppingRequest} from "../../state/slices/shoppingRequestSlice";
import {save as saveLineLevelSessionInfos} from "../../state/slices/lineLevelSessionInfosSlice";

export default function OrderInfo({ toggleAccordion }) {
  const dispatch = useDispatch()
  const isLoading = false;
  const userInfo = useSelector(selector_userInfo)
  const warrantyInfo = useSelector(selector_warrantyContactInfo)
  const warrantyInfoName = warrantyInfo.name.split(";")[0].trim() + warrantyInfo?.name.split(";")[1] || ''
  const shoppingRequest = useSelector(selector_shoppingRequest)
  const lineLevelSessionInfos = useSelector(selector_lineLevelSessionInfos)
  const locale = getCurrentLocale('insight_current_locale')
  const initialValues = {
    name: warrantyInfoName,
    email: warrantyInfo.email,
    phoneNumber: warrantyInfo.phone
  }

  const updateState = (shoppingRequest, lineLevelSessionInfos) => {
    dispatch(saveShoppingRequest(shoppingRequest))
    dispatch(saveLineLevelSessionInfos(lineLevelSessionInfos))
  }

  const toggleOrRedirect = async ({ shoppingRequest, lineLevelSessionInfos }) => {
    const quickCheckoutRequested = hasStorage('quickCheckoutRequested')? getStorage('quickCheckoutRequested'): false
    const { checkoutState } = await fetchNextStep({
      source: 'HEADER_LEVEL',
      quickCheckoutRequested,
      shoppingRequest,
      lineLevelSessionInfos,
    })
    const [url, hash] = nextStepMap[checkoutState]?.split('#')
    if(!!hash) {
      toggleAccordion(hash)
    }else{
      window.location = `/insightweb${url}`
    }
  }

  const onSubmit = async (values) => {
    if( values.name === userInfo.name && values.email === userInfo.email && values.phoneNumber === userInfo.phone ){
      await toggleOrRedirect({ shoppingRequest, lineLevelSessionInfos })
    }else{
      const userContactInfo = userInfo.name.split(';')
      const userObject = {
        firstName: userContactInfo?.[0].trim() || '',
        lastName: userContactInfo?.[1].trim() || '',
        email: userInfo.email,
        phone: userInfo.phone
      }
      const warrantyContactInfo = values.name.split(';')
      const warrantyObject = {
        firstName: warrantyContactInfo[0]?.trim() || '',
        lastName: warrantyContactInfo[1]?.trim() || '',
        email: values.email,
        phone: values.phoneNumber
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
        loginAs: false
      })
      updateState(customerInfo.shoppingRequest, customerInfo.lineLevelSessionInfos)
      await toggleOrRedirect({
        shoppingRequest: customerInfo.shoppingRequest,
        lineLevelSessionInfos: customerInfo.lineLevelSessionInfos
      })
    }
  }

  const validateForm = (values) => {
    const phoneNumRegExp = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
    const errors = {}
    if (!values.name) {
      errors.name = t('Please enter name')
    }
    if(!values.phoneNumber || !phoneNumRegExp.test(values.phoneNumber)) {
      errors.phoneNumber = t('Please enter a valid Phone.')
    }
    if(!values.email || !validateEmail(values.email )) {
      errors.email = t('Please enter a valid email address.')
    }
    return errors
  }

  return(
    <div className='o-grid'>
      <div className='o-grid__item'>
        <p>{t('To authorize warranty purchases. our partners require certain contact information for warranty purchases on insight.com')}</p>
        <div className='c-guest-checkout__order-form'>
          <Form
            initialValues={initialValues}
            onSubmit={onSubmit}
            validate={validateForm}
            skipValidateOnMount
            validateOnBlur
            render={({handleSubmit}) => (
              <form onSubmit={handleSubmit} noValidate className="c-form" aria-labelledby="personalInfoHeading">
                <fieldset className="c-form__group" data-private="true">
                  <div className="o-grid o-grid--gutters-small">
                    <Field
                      fieldComponent='Text'
                      name='name'
                      label={t('Name')}
                      type="text"
                      aria-required="true"
                      required
                      minLength={1}
                      maxLength={40}
                      showErrorIcon
                      className='o-grid__item  u-1/1 u-1/3@desktop u-margin-bot'
                      data-testid={'name-input'}
                    />
                    <Field
                      fieldComponent='Text'
                      name='phoneNumber'
                      label={t('Phone')}
                      type="tel"
                      pattern={US_PHONE_NUMBER_PATTERN}
                      aria-required="true"
                      minLength={1}
                      maxLength={14}
                      required
                      showErrorIcon
                      className="o-grid__item  u-1/1 u-1/3@desktop u-margin-bot"
                      data-testid={'phone-number-input'}
                    />
                    <Field
                      fieldComponent='Text'
                      name='email'
                      label={t('Email')}
                      type="email"
                      aria-required="true"
                      required
                      showErrorIcon
                      className="o-grid__item  u-1/1 u-1/3@desktop u-margin-bot"
                      data-testid={'email-input'}
                    />
                  </div>
                </fieldset>
                <div className='c-guest-checkout__button'>
                  <Button
                    color="primary"
                    isLoading={isLoading}
                    data-testid='personal-info-save-btn'
                    onClick={handleSubmit}
                  >
                    {t('Continue')}
                  </Button>
                </div>
              </form>
            )}
          />
        </div>
      </div>
    </div>
  )
}

OrderInfo.propTypes = {
  id: PropTypes.number,
  hasSellRequirements: PropTypes.bool.isRequired,
  toggleAccordion: PropTypes.func.isRequired
}

OrderInfo.defaultProps = {
  id: 0
}
