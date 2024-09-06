import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import reduce from 'lodash-es/reduce'
import map from 'lodash-es/map'

import { t } from '@insight/toolkit-utils/lib/labels'
import Loading from '@insight/toolkit-react/lib/Loading/Loading'
import ReceiptDetailView from './components/ReceiptDetail/ReceiptDetailView'
import { selector_shoppingRequest } from '../../libs/ShoppingRequest/selectors'
import { userPermissions } from '../../libs/User/permissions'
import {
  selector_hasStockAndPriceDisplayDisabled,
  selector_hasUserPermission,
  selector_isB2BUser,
  selector_isCES,
  selector_isEMEA,
  selector_isLimitedUser,
  selector_isNavy,
  selector_isSharedUser,
  selector_navySTName,
} from '../../libs/User/selectors'
import {
  selector_hasAdditionalOrderInformation,
  selector_hasWarrantyFields,
  selector_hasSharedUserFields,
  selector_headerLevelSmartTrackers,
  selector_hasLabConfigurationNotes,
  selector_hasInvoiceNotes,
  selector_hasAdditionalOrderNotes,
  selector_hasFileUpload,
} from '../LineLevel/selectors'
import { selector_hasPOFields } from '../ShipBillPay/selectors'
import { getRRRecommendedItemsForReceiptPage } from '../ShoppingCart/actions/recommendationsActions'
import msgBox from '../../libs/iw-components/iw-messageBox'
import { clearMiniCart } from './../../libs/businessContainerApps/cart/actions'
import {
  selector_isOrderTemplate,
  selector_isSavedQuote,
  selector_transportsToDetermine,
} from '../../libs/Cart/selectors/cartResponse'
import { selector_isQuickCheckout } from '../../libs/Cart/selectors/shoppingCartView'
import { isSubscribedToMarketo } from '../../libs/models/Marketo/marketo'
import { RECEIPT_TITLE } from '../../libs/businessContainerApps/checkoutAppHeader/constants'

class Receipt extends Component {
  constructor(props) {
    super(props)
    this.state = {
      expandSection: false,
      isLoading: true,
    }
  }

  showHideSection = () => {
    this.setState({
      expandSection: !this.state.expandSection,
    })
  }

  componentDidMount() {
    const shopping = this.props.shoppingRequest
    const { cart } = shopping
    const productIds = getProductIds(cart)
    const productPrices = []
    const itemQuantities = []

    cart.cartItems.forEach((item) => {
      productPrices.push(item.materialInfo.unitPrice)
      itemQuantities.push(item.quantity)
    })

    this.props
      .getRRRecommendedItems({
        orderId: shopping.webReferenceNumber,
        productPrices,
        itemQuantities,
        productIds,
      })
      .then(() => this.setState({ isLoading: false }))
      .catch(() => this.setState({ isLoading: false }))

    this.props.clearMiniCart()
    msgBox.removeMsg('shopping-cart', 'sendToColleagueResponse')

    // check to make sure adobe object is available before we call the track event
    if (window.adobe && window.adobe.target) {
      window.adobe.target.trackEvent({
        mbox: 'orderConfirmPage',
        params: {
          orderId: shopping.webReferenceNumber,
          orderTotal: cart.summary.totalCost,
          productPurchasedId: productIds.join(', '),
        },
      })
    }

    // Removed BV pixel as part of CR11032. Retaining this commented code for future, in case to revert back
    /* const { isB2BUser, isSharedUser } = this.props
        if (typeof window.BV !== 'undefined') {
            window.BV.pixel.trackTransaction(getTransactionData(isB2BUser, isSharedUser, shopping));
        } */
  }
  render() {
    document.title = t(RECEIPT_TITLE)

    if (this.state.isLoading) return <Loading size="large" />
    const {
      headerLevelSmartTrackers,
      shoppingRequest,
      canShowThirdPartyCarrier,
    } = this.props
    const updatedSmartTrackers = shoppingRequest.orderMetaData
      ? nameValuePairSmartTrackers(
          headerLevelSmartTrackers,
          shoppingRequest.orderMetaData.smartTracker
        )
      : []
    const cartHasShippableItems =
      shippableItemsInCart(shoppingRequest.cart.cartItems).length > 0

    return (
      <div>
        <ReceiptDetailView
          cart={shoppingRequest.cart}
          carrier={shoppingRequest.shipping.carrier}
          billing={shoppingRequest.billing}
          shipping={shoppingRequest.shipping}
          smartTracker={updatedSmartTrackers}
          payment={shoppingRequest.billing.payment}
          shoppingRequest={shoppingRequest}
          showHideSection={this.showHideSection}
          expandSection={this.state.expandSection}
          cartHasShippableItems={cartHasShippableItems}
          isNavy={this.props.isNavy}
          isEMEA={this.props.isEMEA}
          isSimplifiedCESUser={this.props.isSimplifiedCESUser}
          isStockAndPriceDisplayDisabled={
            this.props.isStockAndPriceDisplayDisabled
          }
          isReceipt
          navySTName={this.props.navySTName}
          canShowThirdPartyCarrier={canShowThirdPartyCarrier}
          hasAdditionalOrderInformation={
            this.props.hasAdditionalOrderInformation
          }
          hasLabConfigurationNotes={this.props.hasLabConfigurationNotes}
          hasInvoiceNotes={this.props.hasInvoiceNotes}
          hasAdditionalOrderNotes={this.props.hasAdditionalOrderNotes}
          hasFileUpload={this.props.hasFileUpload}
          hasWarrantyFields={this.props.hasWarrantyFields}
          hasSharedUserFields={this.props.hasSharedUserFields}
          hasPOFields={this.props.hasPOFields}
          transportsToDetermine={this.props.transportsToDetermine}
        />
      </div>
    )
  }
}

function isUserSubscribedToMarketo(emailID) {
  isSubscribedToMarketo(emailID).then((data) => data)
}

function getProductIds(cart) {
  const productIds = []
  cart.cartItems.forEach((item) => {
    productIds.push(item.materialInfo.materialId)
  })
  return productIds
}

function getEmailID(isB2BUser, isSharedUser, email, locale) {
  let emailID = ''
  if (!(isB2BUser || isSharedUser)) {
    if (locale === ('en_CA' || 'fr_CA')) {
      emailID = isUserSubscribedToMarketo({ email }) ? email : ''
    } else {
      emailID = email
    }
  }
  return emailID
}

function getTransactionData(isB2BUser, isSharedUser, shoppingRequest) {
  const shippingAddress = shoppingRequest.shipping.address
  const { user } = shoppingRequest
  const { summary } = shoppingRequest.cart
  const nickName = user.name.split(' ')[0]
  const userId = user.sapContactId
  const emailID = getEmailID(
    isB2BUser,
    isSharedUser,
    user.email,
    shoppingRequest.locale
  )
  const items = shoppingRequest.cart.cartItems.map((item) => ({
    category: item.materialInfo.manufacturerName,
    imageUrl: '',
    name: item.materialInfo.description,
    price: item.totalPrice,
    quantity: item.quantity,
    sku: item.materialInfo.materialId
      .replace('/', '47')
      .replace('#', '35')
      .replace('=', '61')
      .replace('+', '43'),
  }))
  const transactionData = {
    city: shippingAddress.city,
    currency: shoppingRequest.soldTo.currency,
    nickname: nickName,
    userId,
    email: emailID,
    locale: shoppingRequest.locale,
    orderId: shoppingRequest.webReferenceNumber,
    tax: summary.taxCost,
    total: summary.totalCost,
    items,
  }
  return transactionData
}

function nameValuePairSmartTrackers(
  headerLevelSmartTrackers,
  shoppingReqSmartTrackers
) {
  const userSelectedSmarttrackersMap = reduce(
    shoppingReqSmartTrackers,
    (acc, smartTracker) => {
      acc[smartTracker.id] = smartTracker.value || ''
      return acc
    },
    {}
  )
  return map(headerLevelSmartTrackers, (smartTracker) => ({
    name: smartTracker.name,
    value:
      userSelectedSmarttrackersMap[smartTracker.lineLevelId] ||
      smartTracker.value,
  }))
}

function shippableItemsInCart(cartItems) {
  return cartItems.filter((item) => !item.materialInfo.nonShipabble)
}

function mapStateToProps(state) {
  return {
    canShowThirdPartyCarrier: selector_hasUserPermission(
      state,
      userPermissions.CARRIER_ACCOUNT_NO
    ),
    hasAdditionalOrderNotes: selector_hasAdditionalOrderNotes(state),
    hasAdditionalOrderInformation:
      selector_hasAdditionalOrderInformation(state),
    hasFileUpload: selector_hasFileUpload(state),
    hasInvoiceNotes: selector_hasInvoiceNotes(state),
    hasLabConfigurationNotes: selector_hasLabConfigurationNotes(state),
    hasPOFields: selector_hasPOFields(state),
    hasSharedUserFields: selector_hasSharedUserFields(state),
    hasWarrantyFields: selector_hasWarrantyFields(state),
    headerLevelSmartTrackers: selector_headerLevelSmartTrackers(state),
    isB2BUser: selector_isB2BUser(state),
    isNavy: selector_isNavy(state),
    isEMEA: selector_isEMEA(state),
    isOrderTemplate: selector_isOrderTemplate(state),
    isQuickCheckout: selector_isQuickCheckout(state),
    isSavedQuote: selector_isSavedQuote(state),
    isSharedUser: selector_isSharedUser(state),
    isSimplifiedCESUser: selector_isLimitedUser(state) && selector_isCES(state),
    isStockAndPriceDisplayDisabled:
      selector_hasStockAndPriceDisplayDisabled(state),
    navySTName: selector_navySTName(state),
    shoppingRequest: selector_shoppingRequest(state),
    transportsToDetermine: selector_transportsToDetermine(state),
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      clearMiniCart,
      isSubscribedToMarketo,
      getRRRecommendedItems: getRRRecommendedItemsForReceiptPage,
    },
    dispatch
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Receipt)
