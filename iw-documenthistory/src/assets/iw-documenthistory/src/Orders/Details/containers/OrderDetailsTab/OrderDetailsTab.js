import { connect } from 'react-redux'
import { selector_cmsServer, selector_hasInvoiceEnabledPermission, selector_isAPAC, selector_isEMEA } from '../../../../Shared/selectors'

import {
  selector_accountName,
  selector_billingAddress,
  selector_billingAttn,
  selector_billingCompany,
  selector_ipsUser,
  selector_orderDetails,
  selector_salesDocumentNumber,
  selector_soldToCurrency,
  selector_soldToNumber,
  selector_shippingAddress,
  selector_shippingAttn,
  selector_shippingCompany,
  selector_depInfo,
  selector_salesAreaId
} from './../../selectors/orderDetailsSelectors'
import OrderDetailsTabView from './../../components/OrderDetailsTab/OrderDetailsTabView'

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
    accountNumber: selector_soldToNumber(state),
    billingAddress: selector_billingAddress(state),
    billingAttn: selector_billingAttn(state),
    billingCompany: selector_billingCompany(state),
    cmsServer: selector_cmsServer(state),
    currencyCode: selector_soldToCurrency(state),
    hasInvoicingEnabled: selector_hasInvoiceEnabledPermission(state),
    isAPAC: selector_isAPAC(state),
    isEMEA: selector_isEMEA(state),
    ipsUser: selector_ipsUser(state),
    orderDetails: selector_orderDetails(state),
    salesDocumentNumber: selector_salesDocumentNumber(state),
    shippingAddress: selector_shippingAddress(state),
    shippingAttn: selector_shippingAttn(state),
    shippingCompany: selector_shippingCompany(state),
    salesAreaId: selector_salesAreaId(state),
    getDEPInfo,
  }
}

export default connect(mapStateToProps)(OrderDetailsTabView)
