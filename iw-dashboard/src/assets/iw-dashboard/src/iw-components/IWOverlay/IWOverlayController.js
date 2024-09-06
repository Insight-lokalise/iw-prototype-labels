import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

import { IWAnchor } from '../'

export default class IWOverlayController extends Component {
  constructor() {
    super()

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    this.context.iwOverlay.iwOverlayController.onClick()
    return this.props.onClick()
  }

  render() {
    return (
      <IWAnchor className={cn('iw-overlay__link', this.props.className)} onClick={this.handleClick}>
        {this.props.children}
      </IWAnchor>
    )
  }
}

IWOverlayController.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  className: PropTypes.string,
  // implicit from IWOverlayAdvanced
  onClick: PropTypes.func,
}

IWOverlayController.defaultProps = {
  children: null,
  className: '',
  onClick: () => null,
}

IWOverlayController.contextTypes = {
  iwOverlay: PropTypes.shape({
    iwOverlayController: PropTypes.shape({
      onClick: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
}
