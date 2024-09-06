import { getStoredAddresses } from '../actions'
import { connect } from 'react-redux'
import SearchView from '../SearchView'

function mapDispatchToProps(dispatch) {
    return {
        getStoredAddress(searchKey) {
            dispatch(getStoredAddresses(searchKey))
        },
    }
}

export default connect(null, mapDispatchToProps)(SearchView)
