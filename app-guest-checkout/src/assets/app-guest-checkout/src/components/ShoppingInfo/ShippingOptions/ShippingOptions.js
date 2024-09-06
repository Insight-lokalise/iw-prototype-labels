import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Panel from '@insight/toolkit-react/lib/Panel/Panel'
import Button from '@insight/toolkit-react/lib/Button/Button'
import { Icon } from '@insight/toolkit-react';
import ButtonGroup from '@insight/toolkit-react/lib/ButtonGroup/ButtonGroup'
import Loading from '@insight/toolkit-react/lib/Loading/Loading'
import Form from '@insight/toolkit-react/lib/Form/Form'
import { t } from '@insight/toolkit-utils/lib/labels'
import { hasStorage, getStorage } from "@insight/toolkit-utils/lib/helpers/storageHelpers";
import { groupByCarrier, normalizeCarrierValue, normalizeEmailPayload} from '../helpers'
import { selector_cartItems } from '../../../state/slices/selectors/ShoppingReqeustSelector'

import CarrierOptionsDisplay from './CarrierOptions'
import NotificationEmails from './NotificationEmails'
import { save as saveShoppingRequest } from '../../../state/slices/shoppingRequestSlice'
import {ADDRESS_TYPE} from '../../../constants'
import {
  selector_shoppingRequest,
  selector_shoppingRequestShipping,
  selector_additionalShippingNotificationEmail
} from '../../../state/slices/selectors/ShoppingReqeustSelector'
import { selector_lineLevelSessionInfos } from '../../../state/slices/selectors/lineLevelSessionInfosSelector'

import {getShippingCarriers, saveAddress, persistCartSummary, fetchNextStep, fetchTaxAndEWRFee} from '../../../api'
import { CARRIER_OPTION_MESSAGE, nextStepMap, BACKORDER_MESSAGE } from '@constants'
import { fetchTaxAndEWRFeeForTheCartItems } from '../helpers'

const ShippingOptions = ({ toggleAccordion }) => {
  const shoppingRequest = useSelector(selector_shoppingRequest)
  const lineLevelSessionInfos = useSelector(selector_lineLevelSessionInfos)
  const additionalShippingNotificationEmails = useSelector(selector_additionalShippingNotificationEmail)
  const cartItems  = useSelector(selector_cartItems)
  const displayEmails = additionalShippingNotificationEmails.reduce((acc,cur) => [...acc, {value: cur,  error: undefined}],[])
  const [emails, setEmails] = useState(displayEmails)
  const [loading, setIsLoading] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const [isCarrierOptionSelected, setIsCarrierOptionSelected] = useState(true)
  const [carrierTabData, setCarrierTabData] = useState()
  const [carrierOptions, setCarrierOptions] = useState([])
  const [allCarriers, setAllCarriers] = useState()
  const [defaultCarrierOption, setDefaultCarrierOption] = useState()
  const shoppingRequestShipping = useSelector(selector_shoppingRequestShipping)
  const [isCarrierOptionsSaving, setIsCarrierOptionsSaving] = useState(false);

  const dispatch = useDispatch()
  useEffect(() => {
    let shippingCarriers = {};
    const getCarriers = async () => {
      setIsLoading(true)
      const data = await getShippingCarriers(shoppingRequest)
      shippingCarriers = {
        slsCarriers: data?.slsCarriers,
        carriers: data?.carriers,
      }

      const carriers = shippingCarriers?.carriers
      const slsCarriers = shippingCarriers?.slsCarriers
      const allCarriersModified = Array.isArray(carriers) &&  [...slsCarriers,...carriers]
      setAllCarriers(allCarriersModified)

      const carriersWithValue = !!allCarriersModified?.length &&  allCarriersModified?.map(option => ({
        ...option,
        value: normalizeCarrierValue(option),
      }))

      const carrierTabDataModified = groupByCarrier(carriersWithValue, 'carrier');
      setCarrierTabData(carrierTabDataModified);
      const optionsProps = Object.keys(carrierTabDataModified).map((key, index) => {
        return carrierTabDataModified[key];
      });
      setCarrierOptions(optionsProps[0])
      setDefaultCarrierOption(shoppingRequest?.shipping?.carrier);
    }
    const makeCarrierCall = shoppingRequest?.shipping
    makeCarrierCall && Object.keys(makeCarrierCall).length && getCarriers();
  }, [shoppingRequestShipping])

  useEffect( () => {
    if(defaultCarrierOption && Object.keys(defaultCarrierOption).length !== 0 && carrierOptions.length !== 0) {
      setCarrierOptions(prvCarriers => prvCarriers.map( carrierItem => {
        carrierItem.defaultCarrier =  defaultCarrierOption?.description === carrierItem?.conditionDescription
        return carrierItem;
      }));
      setIsLoading(false);
    }
  }, [defaultCarrierOption]);

  const calculateBackOrder = (cartItems) => (
    cartItems.some(cartItem => {
      const { quantity, availableStock: { regular, unlimited } } = cartItem
      if(quantity > regular && !unlimited) {
        return true
      }
      return false
    })
  )

  const showBackOrder = calculateBackOrder(cartItems)

  const createSelectedOption = (displayedOptions, selectedOption) => {
    return displayedOptions?.find(option => (option?.conditionDescription || option.shippingCondition) === selectedOption )
  }
  const createCarrierOption = (carrierTabData, { name, option, saturday }) => {
    if (!carrierTabData[name]) return undefined
    const availableOption = carrierTabData[name].find(optionData => optionData.shippingCode === option)
    return {
        description: availableOption && availableOption.shippingCondition,
        name,
        option,
        price: availableOption && availableOption.price,
        saturday: saturday || !!(availableOption && Number(availableOption.saturdayDelivery)),
    }
}

  const handleCarrierSelection = ( selectedValue) => {
    const selectedOption =  createSelectedOption(carrierOptions, selectedValue)?.value
    const parsedValue = JSON.parse(selectedOption)
    const option = createCarrierOption(carrierTabData, parsedValue)
    setSelectedOption(option)
    isCarrierOptionValid(option);
  }

  const isCarrierOptionValid = (option) => {
    Object.keys(option).length !== 0 ? setIsCarrierOptionSelected(true) : setIsCarrierOptionSelected(false);
    return Object.keys(option).length !== 0
  }

  const isShippingOptionsFormValid = () => {
    let isNotificationEmailsValid =  emails.every( item => item.error === undefined );
    return isNotificationEmailsValid && isCarrierOptionValid(selectedOption);
  }
  const createCarrierPayload = (obj) => ({
    name: obj?.name,
    option: obj?.option,
    saturday: obj?.saturday,
    description: obj?.description,
  })
  const onSubmit = async (e) => {
    try {
      //should fetch selected carrier call?
      e.preventDefault()
      if (isShippingOptionsFormValid()) {
        setIsCarrierOptionsSaving(true);
        const shoppingRequestData = await fetchTaxAndEWRFeeForTheCartItems(shoppingRequest, dispatch);
        shoppingRequestData && dispatch(saveShoppingRequest(shoppingRequestData));
        const modifiedEmails = emails.map(email => email.value)
        const {data: updatedShoppingReq} = await saveAddress(
          shoppingRequestData,
          lineLevelSessionInfos,
          JSON.stringify({
            carrier: createCarrierPayload(selectedOption),
            additionalShippingNotificationEmail: normalizeEmailPayload(modifiedEmails)
          }),
          ADDRESS_TYPE.SHIPPING
        )
        dispatch(saveShoppingRequest(updatedShoppingReq))

        const modifiedShoppingRequestInst = {
          "shoppingRequest": updatedShoppingReq,
          "request": JSON.stringify({shippingCost: selectedOption?.price}),
        }

        const {data: modifiedShoppingRequest} = await persistCartSummary(modifiedShoppingRequestInst)
        dispatch(saveShoppingRequest(modifiedShoppingRequest))
        const quickCheckoutRequested = hasStorage('quickCheckoutRequested')? getStorage('quickCheckoutRequested'): false
        const { checkoutState } = await fetchNextStep({
          source: 'CARRIER',
          quickCheckoutRequested,
          shoppingRequest: modifiedShoppingRequest,
          lineLevelSessionInfos
        })
        const [url, hash] = nextStepMap[checkoutState]?.split('#')
        if(!!hash) {
          toggleAccordion(hash)
        }else{
          window.location = `/insightweb${url}`
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsCarrierOptionsSaving(false);
    }
  }


  return loading ? (
   <div className={'loader-alignment'}><Loading size="large" /></div>
  ) : (
    <div className="o-grid__item c-guest-checkout_info">
      <Panel>
        <Panel.Body>
          <div className="o-grid">
            <div className="o-grid__item u-1/1">
              {showBackOrder &&
                (<span className={`o-grid o-grid--center c-stock--error u-margin-bot-small`}>
                  <span className="o-grid__item o-grid__item--shrink c-stock__icon">
                    <span className="o-grid o-grid--full-height">
                      <Icon size="small" icon= 'alert' type= 'error' />
                    </span>
                  </span>
                  <span className="o-grid__item o-grid__item--shrink u-text-bold">
                    {t(BACKORDER_MESSAGE)}
                  </span>
                </span>)
              }
              <div className="o-grid__item u-1/1 u-margin-bot">
                <Form
                  onSubmit={() => { }}
                  skipValidateOnMount
                  render={({ handleSubmit }) => (
                    <form
                      onSubmit={handleSubmit}
                      className="c-login-form u-margin-bot"
                      aria-labelledby="loginHeading"
                    >
                      {!isCarrierOptionSelected && <div className="c-form__error carrier_error__message">
                        <span> <Icon
                          color="primary"
                          icon="information-circled"
                          title="error"
                          type="error"
                        /> {CARRIER_OPTION_MESSAGE} </span>
                      </div> }
                      <CarrierOptionsDisplay
                        carriers={carrierOptions}
                        getSelectedValue={handleCarrierSelection}
                        defaultCarrierOption={defaultCarrierOption}
                      />
                      <hr />
                      <NotificationEmails setEmails={setEmails} emails={emails}/>
                    </form>
                  )}
                />
              </div>
              <ButtonGroup align="right">
                <Button
                  color="primary"
                  type="submit"
                  data-testid="continue-btn"
                  onClick={onSubmit}
                  isLoading={isCarrierOptionsSaving}
                >
                  {t('Continue')}
                </Button>
              </ButtonGroup>
            </div>
          </div>
        </Panel.Body>
      </Panel>
    </div>
  )
}
export default ShippingOptions
