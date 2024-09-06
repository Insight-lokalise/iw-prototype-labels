import { connect } from 'react-redux'

import { selector_taggingEnabled, selector_tags } from '../duck'
import AssignTagsDropdown from '../components/CreateStandards/AssignTagsDropdown'

function mapStateToProps(state) {
  return {
    tagDictionary: selector_tags(state),
    taggingEnabled: selector_taggingEnabled(state),
  }
}

export default connect(mapStateToProps)(AssignTagsDropdown)
