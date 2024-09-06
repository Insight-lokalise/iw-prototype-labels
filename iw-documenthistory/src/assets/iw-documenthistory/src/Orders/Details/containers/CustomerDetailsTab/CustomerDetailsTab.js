import { connect } from 'react-redux'
import CustomerDetailsTabView from '../../components/CustomerDetailsTab/CustomerDetailsTabView'
import {
  selector_attachedFile,
  selector_creditStatus,
  selector_isSEWP,
  selector_orderSmartTracker,
  selector_paymentType,
  selector_poNumber,
  selector_poReleaseNumber,
  selector_soldToNumber,
  selector_userContactEmail,
  selector_userContactName,
  selector_userContactPhone,
} from './../../selectors/orderDetailsSelectors'

function mapStateToProps(state) {
  return {
    attachedFile: selector_attachedFile(state),
    creditStatus: selector_creditStatus(state),
    email: selector_userContactEmail(state),
    isSEWP: selector_isSEWP(state),
    name: selector_userContactName(state),
    orderSmartTracker: selector_orderSmartTracker(state),
    paymentType: selector_paymentType(state),
    phone: selector_userContactPhone(state),
    poNumber: selector_poNumber(state),
    poReleaseNumber: selector_poReleaseNumber(state),
    soldTo: selector_soldToNumber(state),
  }
}

export default connect(mapStateToProps)(CustomerDetailsTabView)
