import React, { Component, createContext } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { l } from '@insight/toolkit-utils'

import { selector_defaultLanguage, selector_languages } from '../duck'
import { getLanguage } from './helpers'

export const LanguageContext = createContext({
  changeLanguage: () => {},
  language: getLanguage(l()),
});

class LanguageProviderComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language: props.defaultLanguage
    };
    this.changeLanguage = this.changeLanguage.bind(this)
  }

  changeLanguage = (language) => {
    this.setState({ language })
  };

  render() {
    const {
      changeLanguage,
      props: { children, languages },
      state: { language }
    } = this
    const value = { changeLanguage, language, languages }
    return (
      <LanguageContext.Provider value={value}>
        {children}
      </LanguageContext.Provider>
    )
  }
}

LanguageProviderComponent.propTypes = {
  children: PropTypes.element.isRequired,
  defaultLanguage: PropTypes.string,
  languages: PropTypes.arrayOf(PropTypes.string)
}

LanguageProviderComponent.defaultProps = {
  defaultLanguage: getLanguage(l()),
  languages: [ getLanguage(l()) ]
}

function mapStateToProps(state) {
  return {
    defaultLanguage: selector_defaultLanguage(state),
    languages: selector_languages(state)
  }
}

export const LanguageProvider = connect(mapStateToProps)(LanguageProviderComponent)

export const languageMap = {
  en: 'English',
  en_US: 'English',
  fr: 'Français',
  fr_CA: 'Français'
}
