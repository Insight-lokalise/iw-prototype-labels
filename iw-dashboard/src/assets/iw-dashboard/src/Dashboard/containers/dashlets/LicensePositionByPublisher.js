import { connect } from 'react-redux'

import { TAB_LICENSING } from '../../components/constants'
import { getLicensePositionByPublisher } from '../../actions/licenseActions'
import { selector_licensePositionByPublisher } from '../../selectors/licenseSelectors'
import { LicensePositionByPublisher } from '../../components/dashlets'

function mapStateToProps(state) {
    return {
        licensing: selector_licensePositionByPublisher(state),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getData: () => dispatch(getLicensePositionByPublisher())
    }
}

const LicensePositionByPublisherDashlet = {
    DashletComponent: connect(mapStateToProps, mapDispatchToProps)(LicensePositionByPublisher),
    gridProps: { w: 1 },
}

export default LicensePositionByPublisherDashlet
