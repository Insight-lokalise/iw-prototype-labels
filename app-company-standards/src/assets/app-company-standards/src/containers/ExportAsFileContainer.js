import { connect } from 'react-redux'

import ExportAsFile from '../components/Catalog/ExportAsFile'
import { createExportAsAFileUrl } from '../api'
import { selector_appTitle, selector_locale, selector_wId, selector_isManagerView} from '../duck'

function mapStateToProps(state) {
const webGroupId = selector_isManagerView(state) ? Insight.userInformation.webGroupId : selector_wId(state) // change done for GNA-11987 
  return {
    exportFileUrl: createExportAsAFileUrl({ locale: selector_locale(state), wId: webGroupId}),
    exportFileName: selector_appTitle(state),
  }
}

export default connect(mapStateToProps)(ExportAsFile)
