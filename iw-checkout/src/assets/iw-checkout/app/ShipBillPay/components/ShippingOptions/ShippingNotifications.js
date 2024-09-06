import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'
import ShippingNotificationsView from './ShippingNotificationsView'


const selector_ShippingOptionsForm = formValueSelector('ShippingOptions')
function mapStateToProps(state) {
    return {
        notes: selector_ShippingOptionsForm(state, 'notes'),
    }
}
export default connect(mapStateToProps)(ShippingNotificationsView)