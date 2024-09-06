import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Field, Panel } from '@insight/toolkit-react'
import Message  from "@insight/toolkit-react/lib/Message/Message"
import { t } from '@insight/toolkit-utils/lib/labels'
import { checkoutGAE } from '@insight/toolkit-utils/lib/analytics'
import { hasStorage, getStorage } from "@insight/toolkit-utils/lib/helpers/storageHelpers";
import { getStatesByCountry, getCountries, fetchNextStep } from '../../../api'
import { validateGuestAddress, saveAddress } from '../../../api/index'
import AddressCreateForm from '../Components/AddressCreateForm'
import { save as saveShoppingRequest } from '../../../state/slices/shoppingRequestSlice'
import { selector_lineLevelSessionInfos } from '../../../state/slices/selectors/lineLevelSessionInfosSelector'
import { selector_shoppingRequest, selector_overrideFields, selector_isFirstTimeAddressCreation, selector_address, selector_cart, selector_cartItemsGAE} from '../../../state/slices/selectors/ShoppingReqeustSelector'
import initialState from '../../../state/initialState'
import { createAddressObject, createInitialFormValues, isValidSapAddress } from '../helpers'
import AddressEditView from '../Components/AddressEditView'
import SuggestedAddressModal from '@insight/toolkit-react/lib/SuggestedAddressModal/SuggestedAddressModal'
import {ADDRESS_TYPE, creationStatusDescriptionText, ROUTES, ADDRESS_VERIFICATION_FAILED, nextStepMap, BILLING_ADDRESS} from '../../../constants'

function BillingAddress({
  id,
  toggleAccordion,
  countryCode,
  initiallyExpanded
}) {
  const [useShippingAddress, setUseShippingAddress] = useState(false)
  const [values, setValues] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [enteredAddress, setEnteredAddress] = useState({})
  const [userInputAddress, setUserInputAddress] = useState(null)
  const [suggestedAddressList, setSuggestedAddressList] = useState([])
  const dispatch = useDispatch()

  const  cart  = useSelector(cartData => selector_cart(cartData))
  const cartItemsGAE = useSelector(cartItems => selector_cartItemsGAE(cartItems))
  const shoppingRequest = useSelector(selector_shoppingRequest)
  const shippingAddress = useSelector((state) => selector_address(state, ADDRESS_TYPE.SHIPPING))
  const lineLevelSessionInfos = useSelector(selector_lineLevelSessionInfos)
  const billingAddress = useSelector((state) => selector_address(state, ADDRESS_TYPE.BILLING))
  const isFirstTimeAddressCreation = useSelector((state) =>
    selector_isFirstTimeAddressCreation(state, ADDRESS_TYPE.BILLING)
  )
  const [addressMsg, setAddressMsg] = useState({type:'', textMessage:''})
  const [isBillingAddressCreation, setIsBillingAddressCreation] = useState(Object.keys(billingAddress).length === 0)

  const [overrideFields, setOverrideFields] = useState(
    useSelector((state) => selector_overrideFields(state, ADDRESS_TYPE.BILLING))
  )

  useEffect(() => {
    //if same address is used for billing, when shipping changes update billing
    if (useShippingAddress) {
      setValues(initialValues)
    }
    if(initiallyExpanded[0] === BILLING_ADDRESS){
      checkoutGAE({step: 3,
        cart: cart.summary,
        cartItems: cartItemsGAE,
        isSaveAsQuote: false,
        isOrderTemplate: false,
        isQuickCheckout: false,
        overridePageTitle: ROUTES['SHOPPING_INFO'].name
      });
    }
  }, [shippingAddress, initiallyExpanded])

  useEffect( () => {
    const billing =  shoppingRequest?.billing || {};
    if (Object.keys(billing)?.length !== 0) {
      const address = billing?.address;
      setValues({ ...address,
        companyName: billing?.companyName,
        attention: billing?.attentionLine,
        street1: address?.address1,
        street2: address?.address2,
        phoneNum: billing?.phone })
    }
  },[shoppingRequest])

   const initialValues = createInitialFormValues(shippingAddress)
   const inValidAddress = (address = {}) => !(address?.city  || address?.region || address?.postalcode)
  const clearAddressValidationMsg = () => setAddressMsg({type:'', textMessage:''})
  const handleContinueClick = (address) => {
    checkoutGAE({step: 3,
      cart: cart.summary,
      cartItems: cartItemsGAE,
      isSaveAsQuote: false,
      isOrderTemplate: false,
      isQuickCheckout: false,
      overridePageTitle: ROUTES['SHOPPING_INFO'].name
    });
    const addressPayload = {inputAddress:address,suggestions:[]}
    if (isFirstTimeAddressCreation || isBillingAddressCreation) {
      clearAddressValidationMsg()
      setIsLoading(true)
      validateGuestAddress(addressPayload).then((data) => {
        if(data?.creationStatusDescription === ADDRESS_VERIFICATION_FAILED || inValidAddress(data?.suggestions[0])){
          return setAddressMsg({
            type: 'error',
            textMessage: creationStatusDescriptionText.ADDRESS_VERIFICATION_FAILED
          })
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
        companyName: address?.companyName,
      })
    }
  }

  const onCancelAddAddress = () => {
    setIsBillingAddressCreation(false)
    clearAddressValidationMsg()
  }
  const updateState = (shoppingRequest) =>
    dispatch(saveShoppingRequest(shoppingRequest))

  const handleAddressEditInModal = () => {
    setAddModalOpen(false)
  }
  const handleNextStep = async () => {
    const quickCheckoutRequested = hasStorage('quickCheckoutRequested')? getStorage('quickCheckoutRequested'): false
    const { checkoutState } = await fetchNextStep({
      source: 'BILLING',
      quickCheckoutRequested,
      shoppingRequest,
      lineLevelSessionInfos
    })
    const [url, hash] = nextStepMap[checkoutState]?.split('#')
    if(!!hash) {
      toggleAccordion(hash)
    }else{
      window.location = `/insightweb${url}`
    }
  }
  const suggestedModalSubmit = async (selectedIndex, selectedAddress) => {
    const defaultAddressObj = initialState.billing  //based on address payload structure
    //create models for shippping and billing addresses
    const addressObject = createAddressObject(defaultAddressObj.address, selectedAddress)
    const addressPayload = {...defaultAddressObj, address: addressObject, ...overrideFields }
    const makeSaveAddressCall = async () => {
      return await saveAddress(
        shoppingRequest,
        lineLevelSessionInfos,
        JSON.stringify(addressPayload),
        ADDRESS_TYPE.BILLING
      )
    }
    const makeCallToUpdateState = (shoppingRequestObject) => {
      //update redux store with updated shoppingReq
      updateState(shoppingRequestObject)
      setIsLoading(false)
      //isBillingAddressCreation && setIsBillingAddressCreation(false)
      handleNextStep()
    }
    const userSelectedAddress = {
      ...selectedAddress,
      addressAlreadyVerified: true,
      address1: selectedAddress?.street1,
      address2: selectedAddress?.street2,
    }
    const addressToCreate = {
      inputAddress:userSelectedAddress,
      suggestions:suggestedAddressList
    }
    setIsLoading(true)
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
    }else {
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

  const toggleUseShippingAddress = () => {
    // Set the values based on the old boolean to prevent possible race conditions
    if (!useShippingAddress) {
      setUseShippingAddress(true)
      setValues(initialValues)
    } else {
      setUseShippingAddress(false)
      setValues(null)
    }
  }
  const hasMsg = (addressMsg?.textMessage && addressMsg.type) || false
  return (
    <section className='billing-address-section'>
    <div className="o-grid">
      <div className="o-grid__item">
        {/* { Key change is to remount the AddressForm and force population by the new "initialValues" } */}
        <div
          className="o-grid__item c-guest-checkout_info"
          key={
            useShippingAddress ? 'useShippingAddress' : 'enterBillingAddress'
          }
        >
          <Panel>
            <Panel.Body>
              <div className="o-grid">
                <div className="o-grid__item">
                  <Message className="billing-address-section__message" size='small' type="alert">
                    {t(`If you're paying with a credit, corporate or procurement card, the address you provide must match the card's billing address where statements are sent.`)}
                  </Message>
                </div>
              </div>

              {isFirstTimeAddressCreation && <Field
                fieldComponent="Checkbox"
                id="sameAsShipping"
                name="sameAsShipping"
                onChange={toggleUseShippingAddress}
                checked={useShippingAddress}
                checkboxLabel={t('Same as shipping')}
              />}
              {!isBillingAddressCreation ? (
                <AddressEditView
                  selectedAddress={billingAddress}
                  isDefault={true}
                  toggleAccordion={toggleAccordion}
                  id={id}
                  isFirstTimeAddressCreation={isFirstTimeAddressCreation}
                  setOverrideFields={setOverrideFields}
                  overrideFields={overrideFields}
                  saveAddress={saveAddress}
                  setIsAddressCreation={setIsBillingAddressCreation}
                  onClick={handleNextStep}
                  addressType={ADDRESS_TYPE.BILLING}
                />
              )
              :
              <>
              {hasMsg && <Message type={addressMsg.type}>{addressMsg.textMessage}</Message>}
              <AddressCreateForm
                countryCode={countryCode}
                getStatesByCountry={getStatesByCountry}
                getCountries={getCountries}
                onSubmit={handleContinueClick}
                initialValues={isFirstTimeAddressCreation? { ...values, fieldsDisabled: useShippingAddress }: null}
                onCancel={onCancelAddAddress}
                isFirstTimeAddressCreation={isFirstTimeAddressCreation}
              />
              </>}
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

export default BillingAddress
