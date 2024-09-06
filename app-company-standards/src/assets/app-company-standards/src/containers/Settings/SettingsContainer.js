import { connect } from 'react-redux'

import SettingsView from '../../components/Settings/GeneralSettings'
import {
  editSettings,
  selector_defaultLanguage,
  selector_settings
} from '../../duck'

function mapStateToProps(state) {
  return {
    language: selector_defaultLanguage(state),
    settings: selector_settings(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    editSettings: (newSettings, messenger) => dispatch(editSettings(newSettings, messenger))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsView)
