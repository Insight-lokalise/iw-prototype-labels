import { connect } from 'react-redux'

import {
  selector_consortiaId,
  selector_currencyFormat,
  selector_eightHundredNumber,
  selector_isLoggedIn,
  selector_hasEWRFees,
  selector_hasInvoiceEnabledPermission,
  selector_telephoneText,
  selector_isEMEA,
} from '../../../../Shared/selectors'
import SendToColleagueModal from './SendToColleagueModal'
import {
  selector_accountName,
  selector_billingAddress,
  selector_billingAttn,
  selector_billingCompany,
  selector_createdOn,
  selector_creditStatus,
  selector_ipsUser,
  selector_isLab,
  selector_isSEWP,
  selector_isShipComplete,
  selector_orderDetails,
  selector_orderStatus,
  selector_orderSummary,
  selector_orderSmartTracker,
  selector_paymentType,
  selector_poNumber,
  selector_poReleaseNumber,
  selector_reportUsage,
  selector_salesDocumentNumber,
  selector_serialNumbers,
  selector_shippingAddress,
  selector_shippingAttn,
  selector_shippingCompany,
  selector_shipments,
  selector_soldToCurrency,
  selector_soldToNumber,
  selector_userContactEmail,
  selector_userContactName,
  selector_userContactPhone,
  selector_webReferenceNumber,
  selector_depInfo,
  selector_isXD,
} from '../../selectors/orderDetailsSelectors'

function mapStateToProps(state) {
  /**
   * Callback function to search for DEP item when when user clicks on Add to cart
   * returns specified child DEP item from cart items
   * @param  {string} sapLineItemNumber       sapLineItemNumber of the parent
   * @return {object}                         DEP item object
   */
  function getDEPInfo(sapLineItemNumber) {
    return selector_depInfo(state, sapLineItemNumber)
  }

  return {
    accountName: selector_accountName(state),
    applicationConfig: state.insightApplicationData,
    billingAddress: selector_billingAddress(state),
    billingAttn: selector_billingAttn(state),
    billingCompany: selector_billingCompany(state),
    consortiaID: selector_consortiaId(state),
    costProps: selector_orderSummary(state),
    createdOn: selector_createdOn(state),
    creditStatus: selector_creditStatus(state),
    currency: selector_soldToCurrency(state),
    currencyFormat: selector_currencyFormat(state),
    email: selector_userContactEmail(state),
    hasInvoicingEnabled: selector_hasInvoiceEnabledPermission(state),
    ipsUser: selector_ipsUser(state),
    isLab: selector_isLab(state),
    isSEWP: selector_isSEWP(state),
    isShipComplete: selector_isShipComplete(state),
    isLoggedIn: selector_isLoggedIn(state),
    name: selector_userContactName(state),
    orderDetails: selector_orderDetails(state),
    orderStatus: selector_orderStatus(state),
    orderSmartTracker: selector_orderSmartTracker(state),
    paymentType: selector_paymentType(state),
    phone: selector_userContactPhone(state),
    phoneNumberToDisplay: selector_eightHundredNumber(state) || selector_telephoneText(state),
    poNumber: selector_poNumber(state),
    poReleaseNumber: selector_poReleaseNumber(state),
    reportUsage: selector_reportUsage(state),
    salesDocumentNumber: selector_salesDocumentNumber(state),
    serialNumbers: selector_serialNumbers(state),
    shipments: selector_shipments(state),
    shippingAddress: selector_shippingAddress(state),
    shippingAttn: selector_shippingAttn(state),
    shippingCompany: selector_shippingCompany(state),
    showEWR: selector_hasEWRFees(state),
    soldTo: selector_soldToNumber(state),
    user: state.user,
    webReferenceNumber: selector_webReferenceNumber(state),
    isEMEA: selector_isEMEA(state),
    isXD: selector_isXD(state),
    getDEPInfo,
  }
}

export default connect(mapStateToProps)(SendToColleagueModal)
