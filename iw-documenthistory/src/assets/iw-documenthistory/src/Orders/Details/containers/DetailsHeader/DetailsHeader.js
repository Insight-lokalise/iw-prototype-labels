import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  selector_hasDuplicateOrderPermission,
  selector_isAPAC,
  selector_isLoggedIn,
  selector_isEMEA,
} from '../../../../Shared/selectors'
import DetailsHeaderView from '../../components/DetailsHeader/DetailsHeaderView'
import { duplicateOrder } from '../../actions/orderDetailActions'
import {
  selector_createdOn,
  selector_hasShippableItems,
  selector_isLab,
  selector_isSEWP,
  selector_isShipComplete,
  selector_isXD,
  selector_orderStatus,
  selector_poNumber,
  selector_poReleaseNumber,
  selector_salesDocumentNumber,
  selector_serialNumbers,
  selector_userContactEmail,
  selector_webReferenceNumber,
  selector_reportUsage
} from './../../selectors/orderDetailsSelectors'

function mapStateToProps(state) {
  return {
    createdOn: selector_createdOn(state),
    hasShippableItems: selector_hasShippableItems(state),
    isAPAC: selector_isAPAC(state),
    isEMEA: selector_isEMEA(state),
    isDuplicateOrderEnabled: selector_isLoggedIn(state) && selector_hasDuplicateOrderPermission(state),
    isLab: selector_isLab(state),
    isLoggedIn: selector_isLoggedIn(state),
    isSEWP: selector_isSEWP(state),
    isShipComplete: selector_isShipComplete(state),
    isXD: selector_isXD(state),
    orderStatus: selector_orderStatus(state),
    poNumber: selector_poNumber(state),
    poReleaseNumber: selector_poReleaseNumber(state),
    salesDocumentNumber: selector_salesDocumentNumber(state),
    serialNumbers: selector_serialNumbers(state),
    userContactEmail: selector_userContactEmail(state),
    webReferenceNumber: selector_webReferenceNumber(state),
    reportUsage: selector_reportUsage(state),
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      duplicateOrder,
    },
    dispatch
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailsHeaderView)
