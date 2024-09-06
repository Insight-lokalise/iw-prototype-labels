import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { t } from '@insight/toolkit-utils'

import { IWButton } from '../'

// this is the body that will contain the children passed to IWOverlayBody
export default class OverlayBodyParts extends Component {
  constructor() {
    super()

    this.state = { GUID: (Math.random() * 100000000000000000).toString() }

    this.handleClickOutside = this.handleClickOutside.bind(this)
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClickOutside, false)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside, false)
  }

  handleClickOutside(e) {
    if (this.isClickInside(e.target)) {
      return
    }
    this.props.iwOverlay.unmountOverlay()
  }

  isClickInside(element) {
    return (
      element.classList.contains(this.state.GUID) ||
      (element.parentElement !== null && this.isClickInside(element.parentElement))
    )
  }

  render() {
    const header = !this.props.hideHeader && (
      <div className="row collapse align-middle iw-overlay__header">
        <div className="column">
          <h2 className="iw-overlay__title">{t(this.props.title)}</h2>
        </div>
        <div className="column shrink">
          <IWButton
            className="clear no-margin-bot iw-overlay__btn ion-ios-close"
            onClick={this.props.iwOverlay.unmountOverlay}
          >
            <span className="show-for-sr">{t('Close')}</span>
          </IWButton>
        </div>
      </div>
    )

    return (
      <div
        className={cn(
          this.state.GUID,
          this.props.useDefaultStyles
            ? {
                'iw-overlay__body': true,
                [`iw-overlay__body--${this.props.position}`]: true,
                'iw-overlay__body--hide-arrow': this.props.hideArrow,
              }
            : {},
          this.props.className
        )}
      >
        {this.props.useDefaultStyles && header}
        {this.props.children}
      </div>
    )
  }
}

OverlayBodyParts.propTypes = {
  // from IWOverlayBody
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  className: PropTypes.string.isRequired,
  hideArrow: PropTypes.bool.isRequired,
  hideHeader: PropTypes.bool.isRequired,
  iwOverlay: PropTypes.shape({
    unmountOverlay: PropTypes.func.isRequired,
  }).isRequired,
  position: PropTypes.oneOf(['top', 'bottom', 'left', 'right', 'none']).isRequired,
  title: PropTypes.string.isRequired,
  useDefaultStyles: PropTypes.bool.isRequired,
}
