import { connect } from 'react-redux'

import Tags from '../../components/Settings/Tags'
import {
  editSettings,
  editTag,
  selector_defaultLanguage,
  selector_settings,
  removeTag,
  selector_tags
} from '../../duck'

function mapStateToProps(state) {
  return {
    language: selector_defaultLanguage(state),
    settings: selector_settings(state),
    tagDictionary: selector_tags(state),
  }
}

function mapDispatchToProps(dispatch) {
  return {
    deleteTag: ({ id }) => dispatch(removeTag({ tagId: id })),
    editSettings: (newSettings) => dispatch(editSettings(newSettings, () => {})),
    editTag: ({ tag, id }) => dispatch(editTag({ tag, tagId: id }))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Tags)
