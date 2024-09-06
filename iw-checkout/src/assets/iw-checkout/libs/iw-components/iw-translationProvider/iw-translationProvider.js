import React, { Component } from 'react'
import { connect } from 'react-redux'
import setToolkitLabels from '@insight/toolkit-react/lib/utils/setToolkitLabels'
import { getTranslations } from './../../models/GetTranslations'
import { selector_locale } from './../../Insight/selectors'

import { IWLoading } from './../iw-loading/iw-loading'

class IWTranslationProvider extends Component {
  constructor(props) {
    super(props)
    this.state = { areLabelsFetched: false }
  }

  componentDidMount() {
    Promise.resolve(
      getTranslations(this.props.locale).then((labels) =>
        setToolkitLabels(labels)
      )
    )
      .then(() => this.setState({ areLabelsFetched: true }))
      .catch(() => this.setState({ areLabelsFetched: true }))
  }

  render() {
    return this.state.areLabelsFetched ? (
      this.props.children
    ) : (
      <IWLoading modal />
    )
  }
}

function mapStateToProps(state) {
  return {
    locale: selector_locale(state),
  }
}

export default connect(mapStateToProps, null)(IWTranslationProvider)
