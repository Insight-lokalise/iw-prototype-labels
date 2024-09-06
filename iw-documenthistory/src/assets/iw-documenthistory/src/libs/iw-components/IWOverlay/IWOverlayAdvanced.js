import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

import './IWOverlay.scss'

// NOTE: this component uses context, thus, having child component who wraps around IWOverlayBody
// && who has a shouldComponentUpdate method will break this component when SCU returns false
// temp solution: do not use PureComponent or components with a SCU method to wrap IWOverlayBody
// TODO: address above issue (there are several ways to do this)
export default class IWOverlayAdvanced extends Component {
  constructor() {
    super()

    this.state = { showOverlayBody: false }

    this.toggleShowOverlayBody = this.toggleShowOverlayBody.bind(this)
    this.closeOverlay = this.closeOverlay.bind(this)
  }

  getChildContext() {
    return {
      iwOverlay: {
        iwOverlayController: { onClick: this.toggleShowOverlayBody },
        showOverlayBody: this.state.showOverlayBody,
        unmountOverlay: this.closeOverlay,
      },
    }
  }

  toggleShowOverlayBody() {
    this.setState(
      prevState => ({ showOverlayBody: !prevState.showOverlayBody }),
      () => {
        this.state.showOverlayBody ? this.props.onShow() : this.props.onHide()
      }
    )
  }

  closeOverlay() {
    this.setState({ showOverlayBody: false }, this.props.onHide)
  }

  render() {
    return <span className={cn('iw-overlay', this.props.className)}>{this.props.children}</span>
  }
}

IWOverlayAdvanced.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  className: PropTypes.string,
  onHide: PropTypes.func,
  onShow: PropTypes.func,
}

IWOverlayAdvanced.defaultProps = {
  children: null,
  className: '',
  onHide: () => null,
  onShow: () => null,
}

IWOverlayAdvanced.childContextTypes = {
  iwOverlay: PropTypes.shape({
    iwOverlayController: PropTypes.shape({
      onClick: PropTypes.func.isRequired,
    }).isRequired,
    showOverlayBody: PropTypes.bool.isRequired,
    unmountOverlay: PropTypes.func.isRequired,
  }).isRequired,
}
