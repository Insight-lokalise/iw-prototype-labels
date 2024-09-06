import React, { PureComponent, Children } from 'react'
import { loadUser } from './actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

class IWUser extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
    }
  }
  componentDidMount() {
    this.props
      .loadUser()
      .then(() => this.setState({ isLoading: false }))
      .catch(err => {
        console.warn(err)
        this.setState({ isLoading: false })
      })
  }
  render() {
    return this.state.isLoading ? null : Children.only(this.props.children)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      loadUser,
    },
    dispatch
  )
}

export default connect(null, mapDispatchToProps)(IWUser)
