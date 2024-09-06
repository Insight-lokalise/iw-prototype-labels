import { change as clearSetAsMyDefault, formValueSelector } from 'redux-form'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { initialize as paymentFormInitialize } from 'redux-form'
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
    updateTaxExemption,
    getTaxExemptFromShoppingRequest,
    validateReviewOrder,
    getTaxAndEWRFee,
    updatePaymentMethodDefault,
    updatePaymentCardDefault,
} from '../../actions'

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
} from '../../selectors'

import {
    selector_hasTaxOverride,
    selector_isRequisition,
    selector_isSingleSoldTo,
    selector_taxExemptionNumber,
} from '../../../LineLevel/selectors'


import { selector_isCloudCart } from '../../../../libs/Cart/selectors'
import {
    selector_hasEditCheckoutDefaultsFavoritesPermission,
    selector_isB2BUser,
    selector_isLimitedUser,
    selector_loginAsFlag,
} from '../../../../libs/User/selectors'
import { selector_cartItemsGAE } from '../../../../libs/Cart/selectors/cartResponse'
import { proceedToCheckout } from '../../../../libs/ShoppingRequest/actions'

const selector_AddNewCardForm = formValueSelector('AddPaymentOrNewCardForm')
function mapStateToProps(state) {
    return {
        availableCardTypes: selector_availableCardTypes(state),
        availablePaymentMethods: selector_availablePaymentMethods(state),
        availablePaymentMethodsMap: selector_availablePaymentMethodsMap(state),
        cartItemsGAE: selector_cartItemsGAE(state),
        creditCardFromShoppingRequest: selector_selectedCreditCard(state),
        defaultCreditCard: selector_defaultCreditCard(state),
        defaultPaymentMethod: selector_defaultPaymentMethod(state),
        defaultProcurementCard: selector_defaultProcurementCard(state),
        hasPOFields: selector_hasPOFields(state),
        hasStoredCardAccess: selector_hasStoredCardAccess(state),
        hasTaxOverride: selector_hasTaxOverride(state),
        initialValues: selector_initialValuesForPaymentForm(state),
        isB2BUser: selector_isB2BUser(state),
        isCloudCart: selector_isCloudCart(state),
        isEditChkoutDefaultFavs: selector_hasEditCheckoutDefaultsFavoritesPermission(state),
        isLimitedUser: selector_isLimitedUser(state),
        isLoginAs: selector_loginAsFlag(state),
        isPaymentRequired: selector_paymentRequired(state),
        isPONumberRequired: selector_hasPONumberRequired(state),
        isRequisition: selector_isRequisition(state),
        isSingleSoldTo: selector_isSingleSoldTo(state),
        isSupressPOReleaseNumber: selector_hasSupressPOReleaseNumber(state),
        procurementCardFromShoppingRequest: selector_selectedProcurementCard(state),
        selectedPaymentFromShoppingRequest: selector_selectedPayment(state),
        storedCreditCards: selector_storedCreditCards(state),
        storedProcurementCards: selector_storedProcurementCards(state),
        taxExemptionNumber: selector_taxExemptionNumber(state),
        useWebReferenceNumberAsPO: selector_useWebReferenceNumberAsPO(state), // need to consume this
        isAddToStoredCardsSelected: selector_AddNewCardForm(state, 'cardInfo.addToStoredCards'),
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        clearSetAsMyDefault,
        createCard,
        deleteCard,
        fetchPaymentMethods,
        fetchPopulateUIFlags,
        fetchStoredCards,
        getPaymentFromShoppingRequest,
        getTaxAndEWRFee,
        getTaxExemptFromShoppingRequest,
        paymentFormInitialize,
        proceedToCheckout,
        toggleCardEditable,
        updateCard,
        updatePayment,
        updatePaymentCardDefault,
        updatePaymentMethodDefault,
        updateSelectedCreditCard,
        updateSelectedProcurementCard,
        updateTaxExemption,
        validateReviewOrder,
    }, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(PaymentInfoView)
