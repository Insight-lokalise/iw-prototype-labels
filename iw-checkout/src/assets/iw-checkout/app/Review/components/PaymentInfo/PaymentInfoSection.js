import {
  change as clearSetAsMyDefault,
  formValueSelector,
  initialize as paymentFormInitialize,
} from 'redux-form'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import PaymentInfoView from './PaymentInfoView'
import { fetchPopulateUIFlags } from '../../../../libs/OrderMetaData/actions'
import {
  fetchPaymentMethods,
  fetchStoredCards,
  deleteCard,
  toggleCardEditable,
  updateCard,
  createCard,
  updatePayment,
  getPaymentFromShoppingRequest,
  updateSelectedCreditCard,
  updateSelectedProcurementCard,
  validateReviewOrder,
  updatePaymentMethodDefault,
  updatePaymentCardDefault,
} from '../../../ShipBillPay/actions'

import {
  selector_availableCardTypes,
  selector_availablePaymentMethods,
  selector_availablePaymentMethodsMap,
  selector_defaultCreditCard,
  selector_defaultPaymentMethod,
  selector_defaultProcurementCard,
  selector_hasPOFields,
  selector_hasPONumberRequired,
  selector_hasStoredCardAccess,
  selector_hasSupressPOReleaseNumber,
  selector_initialValuesForPaymentForm,
  selector_paymentRequired,
  selector_selectedCreditCard,
  selector_selectedPayment,
  selector_selectedProcurementCard,
  selector_storedCreditCards,
  selector_storedProcurementCards,
  selector_useWebReferenceNumberAsPO,
} from '../../../ShipBillPay/selectors'

import {
  selector_isRequisition,
  selector_isSingleSoldTo,
  selector_isCyberSource,
} from '../../../LineLevel/selectors'

import { selector_isCloudCart } from '../../../../libs/Cart/selectors'
import {
  selector_hasEditCheckoutDefaultsFavoritesPermission,
  selector_isB2BUser,
  selector_isLimitedUser,
  selector_loginAsFlag,
  selector_userSalesOrg,
} from '../../../../libs/User/selectors'
import { selector_cartItemsGAE } from '../../../../libs/Cart/selectors/cartResponse'
import { proceedToCheckout } from '../../../../libs/ShoppingRequest/actions'
import {
  selector_locale,
  selector_ipsUser,
} from '../../../../libs/Insight/selectors'
import { selector_featureFlags } from '../../../../libs/flags/selectors'
import {
  selector_soldTo,
  selector_shoppingRequestSummary,
  selector_orderMetaData,
  selector_billing,
  selector_shipping,
} from '../../../../libs/ShoppingRequest/selectors'

const selector_AddNewCardForm = formValueSelector('AddPaymentOrNewCardForm')
function mapStateToProps(state) {
  return {
    availableCardTypes: selector_availableCardTypes(state),
    availablePaymentMethods: selector_availablePaymentMethods(state),
    availablePaymentMethodsMap: selector_availablePaymentMethodsMap(state),
    featureFlags: selector_featureFlags(state),
    cartItemsGAE: selector_cartItemsGAE(state),
    creditCardFromShoppingRequest: selector_selectedCreditCard(state),
    defaultCreditCard: selector_defaultCreditCard(state),
    defaultPaymentMethod: selector_defaultPaymentMethod(state),
    defaultProcurementCard: selector_defaultProcurementCard(state),
    hasPOFields: selector_hasPOFields(state),
    hasStoredCardAccess: selector_hasStoredCardAccess(state),
    initialValues: selector_initialValuesForPaymentForm(state),
    isB2BUser: selector_isB2BUser(state),
    isCloudCart: selector_isCloudCart(state),
    isEditChkoutDefaultFavs:
      selector_hasEditCheckoutDefaultsFavoritesPermission(state),
    isLimitedUser: selector_isLimitedUser(state),
    isLoginAs: selector_loginAsFlag(state),
    isPaymentRequired: selector_paymentRequired(state),
    isPONumberRequired: selector_hasPONumberRequired(state),
    isRequisition: selector_isRequisition(state),
    isCyberSource: selector_isCyberSource(state),
    isSingleSoldTo: selector_isSingleSoldTo(state),
    isSupressPOReleaseNumber: selector_hasSupressPOReleaseNumber(state),
    locale: selector_locale(state),
    procurementCardFromShoppingRequest: selector_selectedProcurementCard(state),
    selectedPaymentFromShoppingRequest: selector_selectedPayment(state),
    storedCreditCards: selector_storedCreditCards(state),
    storedProcurementCards: selector_storedProcurementCards(state),
    useWebReferenceNumberAsPO: selector_useWebReferenceNumberAsPO(state), // need to consume this
    isAddToStoredCardsSelected: selector_AddNewCardForm(
      state,
      'cardInfo.addToStoredCards'
    ),
    soldTo: selector_soldTo(state),
    cartSummary: selector_shoppingRequestSummary(state),
    orderMetaData: selector_orderMetaData(state),
    billing: selector_billing(state),
    shipping: selector_shipping(state),
    ipsUser: selector_ipsUser(state),
    salesOrg: selector_userSalesOrg(state),
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      clearSetAsMyDefault,
      createCard,
      deleteCard,
      fetchPaymentMethods,
      fetchPopulateUIFlags,
      fetchStoredCards,
      getPaymentFromShoppingRequest,
      paymentFormInitialize,
      proceedToCheckout,
      toggleCardEditable,
      updateCard,
      updatePayment,
      updatePaymentCardDefault,
      updatePaymentMethodDefault,
      updateSelectedCreditCard,
      updateSelectedProcurementCard,
      validateReviewOrder,
    },
    dispatch
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentInfoView)
