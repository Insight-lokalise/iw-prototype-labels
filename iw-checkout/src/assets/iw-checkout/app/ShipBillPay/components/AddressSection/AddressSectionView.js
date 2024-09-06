import PropTypes from 'prop-types'
import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import { reduxForm } from 'redux-form'
import { checkoutGAE } from '@insight/toolkit-utils/lib/analytics'
import Message from "@insight/toolkit-react/lib/Message/Message";
import { t } from '@insight/toolkit-utils/lib/labels'
import { navigateToSection } from '../../../../libs/routes/navigate'
import ScrollIntoView from '../../../../libs/routes/ScrollIntoView'
import ScrollToTop from '../../../../libs/routes/ScrollToTop'
import {
    IWAddress,
    IWAnchor,
    IWButton,
    IWLoading,
    IWMessage,
    IWMessageBox,
    msgBox,
} from './../../../../libs/iw-components'
import {
    normalizeToPurchaseOrderAddress,
    overrideAddress,
} from './../../../../libs/models/Address/address'
import { SHIPPING_ORDER_TITLE } from './../../../../libs/businessContainerApps/checkoutAppHeader/constants'
import {
    ADDR_CREATE_SUCCESS,
    ADDR_VERIFY_SUCCESS,
    creationStatusDescriptionTextMap,
    EXISTING_ADDRESS,
    SAP_SUGESSTED_ADDRESS,
    USER_ENTERED_ADDRESS,
    SUGGESTED_ADDRESS
} from './../../constants/SAPAddressConstants'
import StoredAddressLink from './../../containers/AddressSection/StoredAddresses/StoredAddressLinkContainer'
import AddNewAddress from './AddNewAddress'
import { AttentionFormSection } from './AttentionFormSection'
import FavoritesDropdown from './FavoritesDropdown'
import ReadOnlyAddress from './ReadOnlyAddress'
import { ReadOnlyAttentionFields } from './ReadOnlyAttentionFields'
import SuggestedAddressModal from './SuggestedAddressModal'
import { IWSetAsMyDefault } from '../../../../libs/iw-components/iw-setAsMyDefault/iw-setAsMyDefault'

export class AddressSection extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showSuggestedAddressesModal: false,
            enteredAddress: {},
            suggestedAddresses: [],
            faves: [],
            normalizedFaves: [],
            isPending: true,
            selectedFavorite: null,
            disableButtons: false,
        }
        if (props.accordionName === 'SBP') {
          checkoutGAE({step: this.props.isShipping ? 2 : 3,
            cart: this.props.cart,
            cartItems: this.props.cartItemsGAE,
            isSaveAsQuote: this.props.isSavedQuote,
            isOrderTemplate: this.props.isOrderTemplate,
            isQuickCheckout: this.props.isQuickCheckout,
            overridePageTitle: SHIPPING_ORDER_TITLE
          });
        }

    }

    componentDidMount() {
        Promise.all([
            this.props.isEditChkoutDefaultFavs && this.props.getFavoriteAddresses(),
            this.props.shouldFetchShoppingRequest && this.props.getShoppingRequest(),
            this.props.fetchPopulateUIFlags(),
        ])
            .then(([faves]) => {
                this.setFaves(faves)
                this.setState({
                    isCreatingAddress: this.props.requireAddressCreation || Object.keys(this.props.selectedAddress).length === 0,
                    isPending: false,
                })
                this.scrollToSection()
            })
    }

    scrollToSection = () => {
        if (!this.props.isReadOnly && !this.props.isCollapsed) {                              
            if(this.props.isShipping) {
                /* scroll to top since it is the top section */
                ScrollToTop()
            }
            else {
                /* scroll into view when component finished loading */
                const thisComponent = ReactDOM.findDOMNode(this);
                thisComponent && ScrollIntoView(thisComponent, -200)
            }
        }
    }

    setFaves = faves => {
        const normalizedFaves =
            faves &&
            faves.value &&
            faves.value.filter(addr => !!addr.favouriteName).map(addr => ({
                label: addr.favouriteName,
                value: normalizeToPurchaseOrderAddress(addr).id,
            }))
        this.setState({
            normalizedFaves,
            faves: (faves && faves.value) || [],
        })
    };

    setSelectedFavorite = ({ value }) => {
        const faveAddr = this.state.faves && this.state.faves.find(addr => normalizeToPurchaseOrderAddress(addr).id === value)
        this.setState({ selectedFavorite: normalizeToPurchaseOrderAddress(faveAddr).id })
        if (faveAddr) {
            this.props.selectAddress(faveAddr)
        }
    };

    handleFormSubmit = values => {
        if (!this.state.isCreatingAddress) {
            // If we're not creating, we don't need to validate
            const isAttentionFormFieldsChanged = overrideAddress(this.props.selectedAddress, values.existingAddressAttention)
            this.saveAddress({
                ...this.props.selectedAddress,
                ...values.existingAddressAttention,
                overrideAddress: isAttentionFormFieldsChanged,
            })
            if (values['address__samd']) {
                this.props.updateAddressDefault(this.props.selectedAddress.id);
            }
            return
        }

        const userContact = this.props.orderMetaData.userContact

        const addressToCreate = {
            ...values,
            ...values.attentionForm,
            companyName: values.companyName ? values.companyName : userContact.name,
            addressAlreadyVerified: false,
            userSelectedAddressType: USER_ENTERED_ADDRESS,
        }

        msgBox.clear(this.props.messageBoxId)

        this.setState({
            disableButtons: true
        })

        this.props.createAddress(addressToCreate)
            .then(({ value }) => {
                const status = value.creationStatusDescription
                if (status === ADDR_CREATE_SUCCESS || status === ADDR_VERIFY_SUCCESS || status === EXISTING_ADDRESS) {
                    this.saveAddress({
                        ...addressToCreate,
                        id: value.partnerFunction,
                        favoriteName: value.nickName,
                        overrideAddress: false,
                    }, { updateFavorites: !!value.nickName })
                } else {
                    if (status !== SAP_SUGESSTED_ADDRESS && status in creationStatusDescriptionTextMap) {                        
                        msgBox.addMsg(this.props.messageBoxId, {
                            text: t(creationStatusDescriptionTextMap[status]),
                            severity: 'error',
                            msgId: 'addressFailed',
                            scrollTo: '.SBP__section-message',
                        })
                    }

                    this.setState({
                        showSuggestedAddressesModal: status === SAP_SUGESSTED_ADDRESS,
                        enteredAddress: addressToCreate,
                        suggestedAddressesList: value.suggestedAddressesList,
                        suggestedAddresses: value.suggestedAddressesList.map(addr => ({
                            ...addr,
                            ...values.attentionForm,
                            setNickName: values.setNickName,
                            nickNameGiven: values.nickNameGiven,
                            useAsDefaultAddress: values.useAsDefaultAddress,
                            allowPrivateShipTo: values.allowPrivateShipTo,
                        })),
                    })
                }
                this.setState({
                    disableButtons: false
                })
            })
    };

    handleNextStep = selectedAddress => {
        // If the client does not have shippable items, trigger a tax call after
        // saving the shipping address rather than after saving their shipping option
        if (this.props.isShipping && !this.props.shoppingRequestHasShippableitems) this.props.getTaxAndEWRFee()

        this.props.clearAddNew()
        this.toggleIsCreatingAddress(false)
        if(this.state.showSuggestedAddressesModal) {
            this.toggleShowSuggestedAddressesModal(false)
        }        
        this.setSelectedFavorite({ value: selectedAddress.id })
        this.props.selectAddress(normalizeToPurchaseOrderAddress(selectedAddress))
        this.props.proceedToCheckout({ source: this.props.isShipping ? 'SHIPPING' : 'BILLING' })
            .then(({ value })=>{
                const { checkoutState } = value
                navigateToSection(this.props.history, checkoutState, this.props.setActiveIndex)
                if(this.props.isShipping){
                    this.props.prop65Compliance()
                }
            })
    };

    handleSuggestedAddressesContinueClick = optionValue => {
        const selectedAddress = optionValue === USER_ENTERED_ADDRESS
            ? this.state.enteredAddress
            : this.state.suggestedAddresses[optionValue]
        if (selectedAddress.userSelectedAddressType === USER_ENTERED_ADDRESS) {
            const suggestedAddress = this.state.suggestedAddressesList[0]
            selectedAddress.suggestedAddress = suggestedAddress
        }
        else {
            selectedAddress.userSelectedAddressType = SUGGESTED_ADDRESS
        }
        this.props.createAddress({
            ...selectedAddress,
            addressAlreadyVerified: true,
            zipCode: selectedAddress.postalCode || selectedAddress.zipCode,
        })
            .then(({ value }) => {
                const status = value.creationStatusDescription
                if (status === ADDR_CREATE_SUCCESS || status === ADDR_VERIFY_SUCCESS || status === EXISTING_ADDRESS) {
                    this.saveAddress({
                        ...selectedAddress,
                        id: value.partnerFunction,
                        favoriteName: value.nickName,
                        overrideAddress: false,
                    }, { updateFavorites: !!value.nickName })
                } else {
                    // when the address they selected from the suggestedAddresses
                    // modal wasn't able to be created. Shouldn't happen.
                    console.warn('Unhandled submitContactAddress request', value)
                }
            })
            .then(this.props.fetchPopulateUIFlags)
    };

    saveAddress = (address, { updateFavorites } = {}) => {
        const { useAsDefaultAddress = false } = address
        if (useAsDefaultAddress) {
            // update address on redux state when address is created with set as default flag selected
            this.props.getDefaultAddressOnAddressCreate()
        }
        this.props.saveAddress(address)
            .then((savedAddr) => {
                if (savedAddr.value.restrictIntlShipping) {
                    msgBox.addMsg(this.props.messageBoxId, {
                        text: t('Shipments out of Canada require a special ordering process.  Please contact your account executive for assistance.'),
                        severity: 'error',
                        msgId: 'restrictShippingMessage',
                    })
                } else {
                    msgBox.removeMsg(this.props.messageBoxId, 'restrictShippingMessage')
                    this.handleNextStep(savedAddr.value.shipping || savedAddr.value)
                }
            })
            .then(() => Promise.all([
                this.props.fetchPopulateUIFlags(),
                updateFavorites && this.props.getFavoriteAddresses().then(this.setFaves),
            ]))
    };

    toggleIsCreatingAddress = shouldShow => {
        this.setState({
            isCreatingAddress: shouldShow === undefined ? !this.state.isCreatingAddress : shouldShow,
        })
        msgBox.removeMsg(this.props.messageBoxId, 'addressFailed')
    };

    toggleShowSuggestedAddressesModal = shouldShow => {
        this.setState({
            showSuggestedAddressesModal: shouldShow === undefined ? !this.state.showSuggestedAddressesModal : shouldShow,
        }, () => {
            this.scrollToSection()
        })
    };

    render() {
        if (this.state.isPending) return <IWLoading />
        const continueText = t('Continue')
        const { isCreatingAddress, normalizedFaves } = this.state
        const {
            defaultAddress,
            isB2BUser,
            isCollapsed,
            isEditChkoutDefaultFavs,
            isLimitedUser,
            isReadOnly,
            isSingleSoldTo,
            selectedAddress,
            showStoredAddressLink,
        } = this.props
        const hasSelectedAddress = Object.keys(selectedAddress).length > 0
        const isEditable = !isReadOnly && !isCollapsed
        const addNewText = isCreatingAddress ? t('Cancel') : t('Add new')
        const shouldShowAddNewLink = this.props.showAddNewLink && hasSelectedAddress && !this.props.requireAddressCreation && !this.state.disableButtons
        const shouldShowStoredLink = showStoredAddressLink && !this.state.disableButtons
        const selectedFavorite = this.state.selectedFavorite || selectedAddress.id

        const allowSetAsMyDefault = !isLimitedUser && isEditChkoutDefaultFavs && isSingleSoldTo
        return (<section className="c-address">
            { isEditable &&
                <div>
                    <div className="row expanded is-collapse-child align-right hide-for-print">
                        <div className="column align-left SBP__section-message">
                            <IWMessageBox boxId={this.props.messageBoxId} Content={props =>
                                <div>
                                    {props.messages.map(msg =>
                                        msg.msgId === 'addressFailed' && !isCreatingAddress
                                            ? undefined
                                            : <IWMessage className="expanded" key={msg.text} {...msg} />
                                    )}
                                </div>
                            } />
                        </div>
                        <div className="column shrink">
                            { shouldShowStoredLink &&
                                <StoredAddressLink
                                    isShipping={this.props.isShipping}
                                    messageBoxId={this.props.messageBoxId}
                                    refreshFavoriteAddresses={() => this.props.getFavoriteAddresses().then(this.setFaves)}
                                    selectAddress={addr => {
                                        this.toggleIsCreatingAddress(false)
                                        this.props.selectAddress(addr)
                                    }}
                                    selectedAddress={selectedAddress}
                                    setSelectedFavorite={this.setSelectedFavorite}
                                    scrollToSection={this.scrollToSection}
                                />
                            }
                            <span>
                                { shouldShowStoredLink && shouldShowAddNewLink && /* show split line only either of StoredAddress or add new Link rendered */
                                    <span className="vertical-separator">|</span>
                                }
                                { shouldShowAddNewLink &&
                                    <IWAnchor className="section__body-action"
                                        onClick={() => this.toggleIsCreatingAddress()}>
                                        {addNewText}
                                    </IWAnchor>
                                }
                            </span>
                        </div>
                    </div>
                    {!this.props.isShipping &&
                      <div className="row expanded is-collapse-child">
                        <div className="column medium-12">
                          <Message className="c-address__billing" size='small' type="alert">
                            {t(`If you're paying with a credit, corporate or procurement card, the address you provide must match the card's billing address where statements are sent.`)}
                          </Message>
                        </div>
                      </div>
                    }
                    {!isCreatingAddress && !isB2BUser && !isLimitedUser && isEditChkoutDefaultFavs &&
                        <div className="row expanded is-collapse-child">
                            <div className="column small-12 medium-6">
                            <FavoritesDropdown
                                favorites={normalizedFaves}
                                selectedFavorite={selectedFavorite}
                                setSelectedFavorite={this.setSelectedFavorite} />
                            </div>
                        </div>}
                </div>
            }

            <form onSubmit={this.props.handleSubmit(this.handleFormSubmit)}>
                { isEditable && !isCreatingAddress &&
                    <div>
                        <div className="row expanded is-collapse-child">
                            <div className="columns small-12 medium-6">
                                <IWSetAsMyDefault
                                        clearSetAsMyDefault={() => 9}
                                        defaultValue={'' + defaultAddress.id}
                                        name={'address__samd'}
                                        show={allowSetAsMyDefault}
                                        value={'' + selectedAddress.id}>
                                    <label htmlFor="iw-checkout__address-section-company-name" className="form__label--readonly">{t('Company:')}</label>
                                    <p id="iw-checkout__address-section-company-name" >{selectedAddress.companyName}</p>
                                    <label htmlFor="iw-checkout__address-section-selected-address" className="form__label--readonly">{t('Address:')}</label>
                                    <IWAddress spanId="iw-checkout__address-section-selected-address" address={selectedAddress} />
                                </IWSetAsMyDefault>
                            </div>
                            <div className="columns small-12 medium-6">
                                { !this.props.hideAttentionForm &&
                                    this.props.canEditAttentionFields
                                        ? <AttentionFormSection
                                            name='existingAddressAttention'
                                            requireAttentionLine={this.props.requireAttentionLine}
                                            isAPAC={this.props.isAPAC}
                                            isEMEA={this.props.isEMEA}
                                            />
                                        : <ReadOnlyAttentionFields selectedAddress={selectedAddress} />
                                }
                            </div>
                        </div>
                    </div>
                }

                { isEditable && isCreatingAddress &&
                    <AddNewAddress
                        disableCountrySelect={this.props.disableCountrySelect}
                        isLimitedUser={this.props.isLimitedUser}
                        requireAttentionLine={this.props.requireAttentionLine}
                        sameAsShipping={this.props.sameAsShipping}
                        showPrivateShipTo={this.props.showPrivateShipTo}
                        showSameAsShipping={this.props.showSameAsShipping}
                        isShipping={this.props.isShipping}
                        />
                }

                { isReadOnly &&
                    <ReadOnlyAddress 
                        selectedAddress={selectedAddress}
                        isDefault={String(defaultAddress.id) != '' && String(defaultAddress.id) === String(selectedAddress.id)}
                    />
                }

                { isEditable &&
                    <div className="row expanded is-collapse-child align-right text-right">
                        <div className="column small-12 medium-shrink">
                            <IWButton 
                                className="expanded section__button no-margin-bot" 
                                type="submit"
                                disabled={this.state.disableButtons}
                            >
                                { continueText }
                            </IWButton>
                        </div>
                    </div>
                }
            </form>
            { this.state.showSuggestedAddressesModal &&
              <SuggestedAddressModal
                enteredAddress={this.state.enteredAddress}
                handleFormSubmit={this.handleSuggestedAddressesContinueClick}
                onHide={() => this.toggleShowSuggestedAddressesModal(false)}
                suggestedAddresses={this.state.suggestedAddresses}
              />
            }
        </section>
        )
    }
}

export default reduxForm({
    destroyOnUnmount: false,
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
    pure: true,
})(AddressSection)

AddressSection.propTypes = {
    createAddress: PropTypes.func.isRequired,
    defaultAddress: PropTypes.object.isRequired,
    favoriteAddresses: PropTypes.arrayOf(PropTypes.object).isRequired,
    getFavoriteAddresses: PropTypes.func.isRequired,
    history: PropTypes.object,
    isAPAC: PropTypes.bool.isRequired,
    isEMEA: PropTypes.bool.isRequired,
    isB2BUser: PropTypes.bool,
    isCollapsed: PropTypes.bool,
    isEditChkoutDefaultFavs: PropTypes.bool,
    isLimitedUser: PropTypes.bool,
    isReadOnly: PropTypes.bool,
    isSingleSoldTo: PropTypes.bool,
    saveAddress: PropTypes.func.isRequired,
    selectAddress: PropTypes.func.isRequired,
    selectedAddress: PropTypes.object.isRequired,
    setActiveIndex: PropTypes.func.isRequired,
    showStoredAddressLink: PropTypes.bool.isRequired,
    isShipping: PropTypes.bool.isRequired,
}
