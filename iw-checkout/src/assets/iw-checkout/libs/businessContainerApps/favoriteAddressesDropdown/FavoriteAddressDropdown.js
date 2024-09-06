import PropTypes from 'prop-types'
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {
    deleteShippingAddressFromCart,
    getFavoriteBillingAddresses,
    getFavoriteShippingAddresses,
    selectBillingAddress,
    selectShippingAddress,
    updateShippingAddressToCart,
} from './../../../app/ShipBillPay/actions'
import FavoritesDropdown from './../../../app/ShipBillPay/components/AddressSection/FavoritesDropdown'
import {
    selector_favoriteBillingAddresses,
    selector_favoriteShippingAddresses,
    selector_selectedBillingAddress,
    selector_selectedShippingAddress,
} from './../../../app/ShipBillPay/selectors'
import {
    selector_isCloudCart,
    selector_numberOfItemsInCart,
} from './../../Cart/selectors'
import {IWHelpIcon} from './../../iw-components'
import {normalizeToPurchaseOrderAddress} from './../../models/Address/address'
import { t } from '@insight/toolkit-utils/lib/labels'
import {
    selector_hasEditCheckoutDefaultsFavoritesPermission,
    selector_isB2BUser,
    selector_isLimitedUser,
} from './../../User/selectors'
import {getCart} from './../cart/actions'

class FavoriteAddressesDropdown extends Component {
    constructor(props) {
        super(props)
        this.state = {
            faves: [],
            selectedFavoriteId: null,
            normalizedFaves: [],
        }
    }
    componentDidMount(){
        this.props.getFavoriteAddresses()
            .then(({value = []}) => {
                this.setFaves(value)
            })
        const selectedAddressFromState = this.props.selectedAddressFromState
        selectedAddressFromState && selectedAddressFromState.favouriteId &&
            this.setState({selectedFavoriteId : normalizeToPurchaseOrderAddress(selectedAddressFromState).id })
    }

    setFaves = faves => {
        const normalizedFaves =  faves &&
                faves.filter(addr => !!addr.favouriteName).map(addr => ({
                    label: addr.favouriteName,
                    value: normalizeToPurchaseOrderAddress(addr).id,
                })) || []
        this.setState({
            faves: faves || [],
            normalizedFaves,
        })
    };

    handleOnChange = selectedAddress => {
        if(selectedAddress && selectedAddress.value){
            // save address to cart
            const {value} = selectedAddress
            const faveAddr = this.state.faves && this.state.faves.find(addr => normalizeToPurchaseOrderAddress(addr).id === value)
            this.setState({ selectedFavoriteId: normalizeToPurchaseOrderAddress(faveAddr).id })
            if (faveAddr) {
                const saveAddressToCart = this.props.type === 'shipping'
                    ? this.props.updateShippingAddressToCart(faveAddr)
                    : Promise.resolve()
                saveAddressToCart
                    .then(()=>{
                        this.props.selectAddress(faveAddr)
                        this.props.getCart()
                    })
            }
        } else {
            // clear shipping address on cart
            this.props.removeAddress()
                .then(()=>{
                    this.props.selectAddress({})
                    this.setState({ selectedFavoriteId: null })
                    this.props.getCart()
                })
        }
    };

    render() {
        const showFavoriteDropdown = !this.props.isB2BUser &&
                                     !this.props.isCloudCart &&
                                     !this.props.isLimitedUser &&
                                      this.props.hasEditCheckoutDefaultsFavoritesPermission
        return (
            showFavoriteDropdown &&
                <div className="row expanded collapse row__gutter--tiny align-middle favorite-address-dropdown hide-for-print">
                    <div className="column shrink favorite-address-dropdown__help-icon">
                        <IWHelpIcon className='left' tooltip={t('To create a shipping favorite, proceed to checkout and add a favorite shipping address in the stored address section (if permission allows).')}/>
                    </div>
                    <div className="column">
                        <FavoritesDropdown
                            favorites = {this.state.normalizedFaves}
                            selectedFavorite = {this.state.selectedFavoriteId}
                            hideLabel
                            placeholder = {this.props.type === 'shipping' ? t('Select a favorite shipping address') : t('Select a favorite billing address')}
                            disabled={this.state.normalizedFaves.length === 0}
                            clearable = {true}
                            setSelectedFavorite = {this.handleOnChange}/>
                    </div>
                </div>

        )
    }
}

function mapStateToProps(state, {type}) {
    const isShipping = type === 'shipping'
    return {
        faves: isShipping? selector_favoriteShippingAddresses(state): selector_favoriteBillingAddresses(state),
        hasEditCheckoutDefaultsFavoritesPermission :selector_hasEditCheckoutDefaultsFavoritesPermission(state),
        isB2BUser:selector_isB2BUser(state),
        isCloudCart:selector_isCloudCart(state),
        isLimitedUser:selector_isLimitedUser(state),
        selectedAddressFromState: isShipping ? selector_selectedShippingAddress(state): selector_selectedBillingAddress(state),
        numberOfItemsInCart: selector_numberOfItemsInCart(state),
    }
}

function mapDispatchToProps(dispatch, {type}) {
    const isShipping = type === 'shipping'
    return bindActionCreators({
        getFavoriteAddresses: isShipping ? getFavoriteShippingAddresses : getFavoriteBillingAddresses,
        selectAddress: isShipping ? selectShippingAddress : selectBillingAddress,
        updateShippingAddressToCart,
        removeAddress: deleteShippingAddressFromCart,
        getCart,
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(FavoriteAddressesDropdown)

FavoriteAddressesDropdown.propTypes = {
    faves: PropTypes.array.isRequired,
    hasEditCheckoutDefaultsFavoritesPermission: PropTypes.bool.isRequired,
    isB2BUser: PropTypes.bool.isRequired,
    isCloudCart: PropTypes.bool.isRequired,
    isLimitedUser: PropTypes.bool.isRequired,
    selectedAddressFromState: PropTypes.object.isRequired,
    getFavoriteAddresses: PropTypes.func,
    type: PropTypes.string.isRequired,
    selectedAddress: PropTypes.object,
    updateShippingAddressToCart: PropTypes.func,
    removeAddress: PropTypes.func,
}
