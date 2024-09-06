import { connect } from 'react-redux'

import { EADETAILS, TAB_LICENSING } from '../../components/constants'
import { editDashletPublisher } from '../../actions/dashletActions'
import { getEnterpriseAgreementDetails } from '../../actions/licenseActions'
import {
  selector_enterpriseAgreementDetails,
  selector_enterpriseAgreementDetailsDataSelection,
} from '../../selectors/licenseSelectors'
import { selector_dashletSettings_currentTab_dashlet } from '../../selectors/dashletSelectors'
import { EnterpriseAgreementDetails } from '../../components/dashlets'

function mapStateToProps(state) {
  const selection = selector_dashletSettings_currentTab_dashlet(state, EADETAILS).publisher || 0
  const { hasData, options } = selector_enterpriseAgreementDetails(state)
    return {
      data: selector_enterpriseAgreementDetailsDataSelection(state, selection),
      hasData,
      options,
      selection,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        handlePublisherDropdown: (publisher) => dispatch(editDashletPublisher(publisher.value, TAB_LICENSING, EADETAILS)),
        getData: () => dispatch(getEnterpriseAgreementDetails()),
    }
}

const EnterpriseAgreementDetailsDashlet = {
    DashletComponent: connect(mapStateToProps, mapDispatchToProps)(EnterpriseAgreementDetails),
    gridProps: { h: 1, w: 1, maxH: 1, minH: 1, maxW: 2 },
}

export default EnterpriseAgreementDetailsDashlet
