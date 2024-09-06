import React, { useEffect, useState } from 'react'
import { t } from '@insight/toolkit-utils/lib/labels'
import { useDispatch, useSelector } from 'react-redux'
import Panel from '@insight/toolkit-react/lib/Panel/Panel'
import { checkoutGAE } from '@insight/toolkit-utils/lib/analytics'
import { ROUTES } from '../../../constants'
import Message  from "@insight/toolkit-react/lib/Message/Message"
import { hasStorage, getStorage } from "@insight/toolkit-utils/lib/helpers/storageHelpers";
import SuggestedAddressModal from '@insight/toolkit-react/lib/SuggestedAddressModal/SuggestedAddressModal'

import { validateGuestAddress, saveAddress, fetchNextStep } from '../../../api/index'
import { save as saveShoppingRequest } from '../../../state/slices/shoppingRequestSlice'
import {
  selector_address,
  selector_isFirstTimeAddressCreation,
  selector_overrideFields,
  selector_shoppingRequest,
} from '../../../state/slices/selectors/ShoppingReqeustSelector'
import { selector_lineLevelSessionInfos } from '../../../state/slices/selectors/lineLevelSessionInfosSelector'
import { selector_hasShippableItems, selector_cart, selector_cartItemsGAE } from '../../../state/slices/selectors/ShoppingReqeustSelector'
import initialState from '../../../state/initialState'
import { createAddressObject, isValidSapAddress } from '../helpers'

import { getStatesByCountry, getCountries } from '../../../api/getData'
import AddressCreateForm from '../Components/AddressCreateForm'
import AddressEditView from '../Components/AddressEditView'
import {ADDRESS_TYPE, creationStatusDescriptionText, ADDRESS_VERIFICATION_FAILED, nextStepMap,SHIPPING_ADDRESS, STATE} from '../../../constants'
import { fetchTaxAndEWRFeeForTheCartItems } from '../helpers';

function ShippingAddress({
  id,
  toggleAccordion,
  countryCode,
  setIsAddressCreation,
  isAddressCreation,
  setIsShippingAddressCreated,
  initiallyExpanded
}) {
  const shoppingRequest = useSelector(selector_shoppingRequest)
  const lineLevelSessionInfos = useSelector(selector_lineLevelSessionInfos)
  const isFirstTimeAddressCreation = useSelector((state) =>
    selector_isFirstTimeAddressCreation(state, ADDRESS_TYPE.SHIPPING)
  )
  const hasShippableItems = useSelector(selector_hasShippableItems)
  const [isLoading, setIsLoading] = useState(false)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [enteredAddress, setEnteredAddress] = useState({})
  const [suggestedAddressList, setSuggestedAddressList] = useState([])
  const  cart  = useSelector(cartData => selector_cart(cartData))
  const cartItemsGAE = useSelector(cartItems => selector_cartItemsGAE(cartItems))
  const [userInputAddress, setUserInputAddress] = useState(null)
  const shippingAddress = useSelector((state) =>
  selector_address(state, ADDRESS_TYPE.SHIPPING)
  )

 const [overrideFields, setOverrideFields] = useState(
  useSelector((state) => selector_overrideFields(state, ADDRESS_TYPE.SHIPPING))
)
const [addressMsg, setAddressMsg] = useState({type:'', textMessage:''})

  const dispatch = useDispatch()
  const initialValues = {
    ...shippingAddress
  }
  useEffect(()=>{
    if(initiallyExpanded[0] === SHIPPING_ADDRESS){
    checkoutGAE({step: 2,
      cart: cart.summary,
      cartItems: cartItemsGAE,
      isSaveAsQuote: false,
      isOrderTemplate: false,
      isQuickCheckout: false,
      overridePageTitle: ROUTES['SHOPPING_INFO'].name
    });
  }
  },[initiallyExpanded])
  const updateState = (shoppingRequest) =>
    dispatch(saveShoppingRequest(shoppingRequest))
  //inValidAddress fn - handles scenario where invalid address is sent to BE, the response would have one or all of the properties below as falsy
  const inValidAddress = (address = {}) => !(address?.city  || address?.region || address?.postalcode)
  const clearAddressValidationMsg = () => setAddressMsg({type:'', textMessage:''})

  const handleNextStep = async () => {
    const quickCheckoutRequested = hasStorage('quickCheckoutRequested')? getStorage('quickCheckoutRequested'): false
    const { checkoutState } = await fetchNextStep({
      source: 'SHIPPING',
      quickCheckoutRequested,
      shoppingRequest,
      lineLevelSessionInfos
    })
    const [url, hash] = nextStepMap[checkoutState]?.split('#')
    // for now guestCheckout hasn't enable quick checkout
    // next step will go either review or next accordion
    // will update the logic once guestCheckout enabled quick checkout
    if(!!hash) {
      toggleAccordion(hash)
    }else{
      window.location = `/insightweb${url}`
    }
  }

  const handleContinueClick = (address) => {
    if (isFirstTimeAddressCreation || isAddressCreation) {
      const addressPayload = {inputAddress:address, suggestions:[]}
      clearAddressValidationMsg()
      setIsLoading(true)
      validateGuestAddress(addressPayload).then((data) => {
        if (data?.creationStatusDescription === ADDRESS_VERIFICATION_FAILED || inValidAddress(data?.suggestions[0])) {
          setAddressMsg({
            type: 'error',
            textMessage: creationStatusDescriptionText.ADDRESS_VERIFICATION_FAILED
          })
          return;
        }
        setAddModalOpen(true)
        setSuggestedAddressList(data?.suggestions)
        setUserInputAddress(data?.inputAddress)
        setEnteredAddress(address)
      }).catch((e) => {
        console.error(e)
      }).finally(() => {
        setIsLoading(false)
      })
      //override values are sent with address payload
      setOverrideFields({
        phone: address?.phoneNum,
        attentionLine: address?.attention,
        shipComplete: false,
        companyName: address?.companyName,
      })
    } else {
      handleNextStep()
    }
  }

  const handleAddressEditInModal = () => {
    setAddModalOpen(false)
  }

  const onCancelAddAddress = () => {
    setIsAddressCreation(false)
    clearAddressValidationMsg()
  }

  const suggestedModalSubmit = async (selectedIndex, selectedAddress) => {
    const defaultAddressObj = initialState.shipping
    const addressObject = createAddressObject(defaultAddressObj.address, selectedAddress)
    const addressPayload = { ...defaultAddressObj, address: addressObject, ...overrideFields }
    const makeSaveAddressCall = async() => {
      return await saveAddress(
        shoppingRequest,
        lineLevelSessionInfos,
        JSON.stringify(addressPayload),
        ADDRESS_TYPE.SHIPPING
      )
    }
    const makeCallToUpdateState = async(shoppingRequestObj) => {
      if(!isFirstTimeAddressCreation && addressObject.state === STATE.CALIFORNIA) {
        setIsLoading(true);
        updateShoppingRequestPrices(shoppingRequestObj);
      } else if(!isFirstTimeAddressCreation && addressObject.state !== STATE.CALIFORNIA) {
        const cartItems = shoppingRequestObj.cart.cartItems.map( item => ({...item, ewrFee: 0}));
        const newShoppingRequest = {
          ...shoppingRequestObj,
          cart: { ...shoppingRequestObj.cart,
            cartItems,
            summary: {
              ...shoppingRequestObj.cart.summary, ewrFee: 0
            }
          }
        }
        setIsLoading(true);
        updateShoppingRequestPrices(newShoppingRequest);
      } else {
        updateState(shoppingRequestObj);
        handleNavigation();
      }
    }

    const handleNavigation = () => {
      isAddressCreation && setIsAddressCreation(false)
      setIsShippingAddressCreated(true);
      if (hasShippableItems) {
        toggleAccordion('shipping-options')
      } else {
        toggleAccordion('billing-address')
      }
    }

    const updateShoppingRequestPrices = async(shoppingRequest) => {
      try{
        const shoppingRequestData =  await fetchTaxAndEWRFeeForTheCartItems(shoppingRequest)
        shoppingRequestData &&  updateState(shoppingRequestData);
        handleNavigation();
      } catch(error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    const userSelectedAddress = {
      ...selectedAddress,
      addressAlreadyVerified: true,
      address1: selectedAddress?.street1,
      address2: selectedAddress?.street2,
    }
    const addressToCreate = {
      inputAddress: userSelectedAddress,
      suggestions: suggestedAddressList
    }
    if ((selectedIndex === "USER_ENTERED_ADDRESS")) {
      if(isValidSapAddress(userInputAddress,suggestedAddressList[0] )){
        //save if valid SAP address
        const response = await makeSaveAddressCall()
        makeCallToUpdateState(response?.data)
      }else{
        //send both addresses. The response description msg should be ADDRESS_VERIFICATION_FAILED
        setIsLoading(true)
        const response = await validateGuestAddress(addressToCreate)
        setIsLoading(false)
        return setAddressMsg({
        type: 'error',
        textMessage:t(creationStatusDescriptionText[response?.creationStatusDescription])
      })
      }
    } else {
      //save SAP_SUGGESTED_ADDRESS, no further verification needed
        const response = await makeSaveAddressCall()
        makeCallToUpdateState(response?.data)
    }
  }
  const suggestedAddressObj = suggestedAddressList[0]
  const normalizedSuggestedAddressList = [
    {
      ...suggestedAddressObj,
      street1: suggestedAddressObj?.address1,
      street2: suggestedAddressObj?.address2,
      postalCode: suggestedAddressObj?.postalcode,
    },
  ]
  const hasMsg = (addressMsg?.textMessage && addressMsg?.type) || false
  return (
    <section className='shipping-address-section'>
    <div className="o-grid">
      <div className="o-grid__item">
        <div className="o-grid__item c-guest-checkout_info">
          <Panel>
            <Panel.Body>
              {!isAddressCreation ? (
                <AddressEditView
                  selectedAddress={shippingAddress}
                  isDefault={true}
                  toggleAccordion={toggleAccordion}
                  id={id}
                  overrideFields={overrideFields}
                  isFirstTimeAddressCreation={isFirstTimeAddressCreation}
                  saveAddress={saveAddress}
                  setIsAddressCreation={setIsAddressCreation}
                  onClick={handleNextStep}
                  addressType={ADDRESS_TYPE.SHIPPING}
                />
              ) : (
                <>
                {hasMsg && <Message type={addressMsg.type}>{addressMsg.textMessage}</Message>}
                <AddressCreateForm
                  countryCode={countryCode}
                  getStatesByCountry={getStatesByCountry}
                  getCountries={getCountries}
                  isLoading={isLoading}
                  onSubmit={handleContinueClick}
                  initialValues={isFirstTimeAddressCreation? initialValues: null}
                  onCancel={onCancelAddAddress}
                  isFirstTimeAddressCreation={isFirstTimeAddressCreation}
                />
                </>
              )}
              {addModalOpen && (
                <SuggestedAddressModal
                  onClose={handleAddressEditInModal}
                  suggestedAddressList={normalizedSuggestedAddressList}
                  enteredAddress={enteredAddress || {}}
                  suggestedModalSubmit={suggestedModalSubmit}
                />
              )}
            </Panel.Body>
          </Panel>
        </div>
      </div>
    </div>
    </section>
  )
}

export default ShippingAddress
