import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Message  from '@insight/toolkit-react/lib/Message/Message'
import { checkoutGAE } from '@insight/toolkit-utils/lib/analytics'
import { navigateToSection } from '../../../../libs/routes/navigate'
import ScrollIntoView from '../../../../libs/routes/ScrollIntoView'
import ScrollToTop from '../../../../libs/routes/ScrollToTop'
import {
    IWLoading,
    IWMessage,
    IWMessageBox,
    msgBox,
} from '../../../../libs/iw-components'
import {
    normalizeToPurchaseOrderAddress,
} from '../../../../libs/models/Address/address'
import { t } from '@insight/toolkit-utils/lib/labels'
import Button from '@insight/toolkit-react/lib/Button/Button'
import { SHIPPING_ORDER_TITLE } from '../../../../libs/businessContainerApps/checkoutAppHeader/constants'
import ReadOnlyAddress from '../AddressSection/ReadOnlyAddress'
import AddressContactForm from './AddressContactForm'
import StoredAddressLinkSimpleView from './../../components/AddressSectionSimple/StoredAddressLinkSimpleView'
import AddressAddForm from './AddressAddForm'
import { selector_showDuns } from '../../../LineLevel/selectors'

const AddressSectionSimpleView = props => {
    const [isCreatingAddress, setIsCreatingAddress] = useState(false)
    const [isFirstTimeAddressCreation, setIsFirstTimeAddressCreation] = useState(true)
    const [isPending, setIsPending] = useState(null)
    const [overrideFields, setOverrideFields] = useState({})
    const showDuns = useSelector(selector_showDuns)

    const {
      countryCode,
      createAddress,
      defaultAddress,
      isShipping,
      isCollapsed,
      isSimplifiedCESUser,
      isReadOnly,
      messageBoxId,
      orderMetaData,
      proceedToCheckout,
      prop65Compliance,
      selectedAddress,
      selectAddress,
      shoppingRequestHasShippableitems,
      sameAsShippingAddress,
    } = props

    const addressSectionId = isShipping ? 'address-simple-shipping' : 'address-simple-billing'

    useEffect(() => {
        if (props.accordionName === 'SBP') {
            checkoutGAE({step: isShipping ? 2 : 3,
                cart: props.cart,
                cartItems: props.cartItemsGAE,
                isSaveAsQuote: props.isSavedQuote,
                isOrderTemplate: props.isOrderTemplate,
                isQuickCheckout: props.isQuickCheckout,
                overridePageTitle: SHIPPING_ORDER_TITLE
            });
        }

        Promise.all([
            props.shouldFetchShoppingRequest && props.getShoppingRequest(),
            props.fetchPopulateUIFlags(),
        ])
        .then(() => {
            setIsCreatingAddress(props.requireAddressCreation || Object.keys(selectedAddress).length === 0)
            setIsPending(false)
            if (props.accordionName === 'SBP' && !isReadOnly && !isCollapsed) {
                if(isShipping) {
                    /* scroll to top since it is the top section */
                    ScrollToTop()
                }
                else {
                    /* scroll into view when component finished loading */
                    const thisComponent = document.getElementById(addressSectionId)
                    thisComponent && ScrollIntoView(document.getElementById(addressSectionId), -130)     
                }
            }                 
        })
    }, []);

    useEffect(() => {
        if(overrideFields.id !== selectedAddress.id) {
            // on address change, reset contact fields to use values from address
            setOverrideFields(
                {
                    attentionLine: selectedAddress.attentionLine,
                    companyName: selectedAddress.companyName,
                    phone: selectedAddress.phone,
                    id: selectedAddress.id
                }
            )
        }
    }, [selectedAddress]);

    const handleNextStep = selectedAddress => {
        // If the client does not have shippable items, trigger a tax call after
        // saving the shipping address rather than after saving their shipping option
        if (isShipping && !shoppingRequestHasShippableitems) props.getTaxAndEWRFee()
        
        toggleIsCreatingAddress(false)
        selectAddress(normalizeToPurchaseOrderAddress(selectedAddress))
        proceedToCheckout({ source: isShipping ? 'SHIPPING' : 'BILLING' })
            .then(({ value })=>{
                const { checkoutState } = value
                navigateToSection(props.history, checkoutState, props.setActiveIndex)
                if(isShipping){
                    prop65Compliance()
                }
            })
    };

    const saveAddress = (address) => {
        const { useAsDefaultAddress = false } = address
        if (useAsDefaultAddress) {
            // update address on redux state when address is created with set as default flag selected
            props.getDefaultAddressOnAddressCreate()
        } 
        props.saveAddress(address)
            .then((savedAddr) => {
                if (savedAddr.value.restrictIntlShipping) {
                    msgBox.addMsg(messageBoxId, {
                        text: t('Shipments out of Canada require a special ordering process.  Please contact your account executive for assistance.'),
                        severity: 'error',
                        msgId: 'restrictShippingMessage',
                    })
                } else {
                    msgBox.removeMsg(messageBoxId, 'restrictShippingMessage')
                    handleNextStep(savedAddr.value.shipping || savedAddr.value)
                }
            })
            .then(() => props.fetchPopulateUIFlags())
    };

    const toggleIsCreatingAddress = shouldShow => {
        setIsCreatingAddress(shouldShow === undefined ? !isCreatingAddress : shouldShow)
        setIsFirstTimeAddressCreation( shouldShow === undefined ? false : shouldShow)
        msgBox.removeMsg(messageBoxId, 'addressFailed')
    };

    if (isPending) return <IWLoading />

    const isEditable = !isReadOnly && !isCollapsed
    const addNewText = isCreatingAddress ? t('Cancel') : t('Add new')
    const isDefaultAddress =String(defaultAddress.id) != '' && String(defaultAddress.id) === String(selectedAddress.id)

    return (<section className='c-address-simple' id={addressSectionId}>
      { isEditable &&
        <div className="o-grid o-grid--gutters-large u-text-right hide-for-print">
          <div className="o-grid__item u-text-left SBP__section-message">
            <IWMessageBox
              boxId={props.messageBoxId}
              Content={props =>
                (<div>
                  {props.messages.map(msg =>
                                msg.msgId === 'addressFailed' && !isCreatingAddress
                                    ? undefined
                                    : <IWMessage className="expanded" key={msg.text} {...msg} />
                            )}
                </div>)
                    }
            />
          </div>
          {!isCreatingAddress &&
            <div className="o-grid__item o-grid__item--shrink">
              {!isSimplifiedCESUser &&
                <>
                  <StoredAddressLinkSimpleView
                    isShipping={isShipping}
                    messageBoxId={messageBoxId}
                    selectAddress={addr => {
                      toggleIsCreatingAddress(false)
                      selectAddress(addr)
                    }}
                    selectedAddress={selectedAddress}
                  />
                  <span className="vertical-separator">|</span>
                </>
              }
              <Button
                onClick={() => toggleIsCreatingAddress()}
                color={"inline-link"}
              >
                {addNewText}
              </Button>
            </div>
          }
        </div>
      }
      {!isShipping &&
        <div className="o-grid o-grid--gutters-large">
          <div className="o-grid__item">
            <Message className="c-address-simple__billing" size='small' type="alert">
              {t(`If you're paying with a credit, corporate or procurement card, the address you provide must match the card's billing address where statements are sent.`)}
            </Message>
          </div>
        </div>
      }

      { isEditable && !isCreatingAddress &&
        <AddressContactForm 
          isDefaultAddress={isDefaultAddress}
          selectedAddress={selectedAddress}
          overrideFields={overrideFields}
          saveAddress={saveAddress}
          setOverrideFields={setOverrideFields}
        />
        }

      { isEditable && isCreatingAddress &&
        <AddressAddForm
          createAddress={createAddress}
          orderMetaData={orderMetaData}
          saveAddress={saveAddress}
          messageBoxId={messageBoxId}
          sameAsShippingAddress={sameAsShippingAddress}
          countryCode={countryCode}
          isFirstTimeAddressCreation={isFirstTimeAddressCreation}
          isShipping={isShipping}
          isSimplifiedCESUser={isSimplifiedCESUser}
          toggleIsCreatingAddress={toggleIsCreatingAddress}
          showDuns={showDuns}
        />
        }

      { isReadOnly &&
        <ReadOnlyAddress 
          selectedAddress={selectedAddress}
          isDefault={isDefaultAddress}
        />
        }
    </section>
    )
}

export default AddressSectionSimpleView

AddressSectionSimpleView.propTypes = {
    createAddress: PropTypes.func.isRequired,
    defaultAddress: PropTypes.object.isRequired,
    history: PropTypes.object,
    isCollapsed: PropTypes.bool,
    isSimplifiedCESUser: PropTypes.bool.isRequired,
    isReadOnly: PropTypes.bool,
    saveAddress: PropTypes.func.isRequired,
    selectAddress: PropTypes.func.isRequired,
    selectedAddress: PropTypes.object.isRequired,
    setActiveIndex: PropTypes.func.isRequired,
    isShipping: PropTypes.bool.isRequired,
    fetchPopulateUIFlags: PropTypes.func.isRequired,
    prop65Compliance: PropTypes.func.isRequired,
    shoppingRequestHasShippableitems: PropTypes.bool.isRequired,
    messageBoxId: PropTypes.string.isRequired,
    sameAsShippingAddress: PropTypes.object,
}
