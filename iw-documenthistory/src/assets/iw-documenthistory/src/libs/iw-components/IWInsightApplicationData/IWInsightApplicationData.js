import React, { Children } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { loadInsightApplicationData } from './actions'

export class IWInsightApplicationData extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = { isLoading: true }
  }

  componentDidMount() {
    this.props
      .loadInsightApplicationData()
      .catch(console.warn.bind(console)) // eat + print errors
      .then(() => this.setState({ isLoading: false }))
  }

  render() {
    return this.state.isLoading ? null : Children.only(this.props.children)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ loadInsightApplicationData }, dispatch)
}

export default connect(null, mapDispatchToProps)(IWInsightApplicationData)
