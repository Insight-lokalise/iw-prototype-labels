import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import StoredAddressLinkView from '../../../components/AddressSection/storedAddress/StoredAddressLinkView'
import { selector_storedShippingAddresses, selector_storedBillingAddresses } from '../../../selectors'
import { getStoredAddresses } from '../../../actions'

function mapStateToProps(state, { isShipping }) {
    return {
        storedAddresses: isShipping ? selector_storedShippingAddresses(state) : selector_storedBillingAddresses(state),
        isShipping,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getStoredAddresses,
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(StoredAddressLinkView)
