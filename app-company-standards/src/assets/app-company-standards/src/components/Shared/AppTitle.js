import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { t } from '@insight/toolkit-utils'

import { LanguageContext } from '../../lib'
import { selector_appTitle } from '../../duck'

function mapStateToProps(state) {
  return { title: selector_appTitle(state) }
}

function AppTitle(props) {
  const { language } = useContext(LanguageContext)

  return <h1 className="u-margin-bot-small u-padding-side-small">{props.title[language] || t('Company standards')}</h1>
}

AppTitle.propTypes = {
  title: PropTypes.shape({}).isRequired,
}

export default connect(mapStateToProps)(AppTitle)
