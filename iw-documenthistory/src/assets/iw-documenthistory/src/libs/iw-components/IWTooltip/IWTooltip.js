import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

import { IWShowHide } from '../IWShowHide/IWShowHide'

export default class IWTooltip extends PureComponent {
  constructor(props) {
    super(props)
    this.state = { showTip: false }
    this.handleClick = this.handleClick.bind(this)
    this.handleMouseEnter = this.handleMouseEnter.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
  }

  handleClick() {
    this.setState({ showTip: !this.state.showTip })
  }

  handleMouseEnter() {
    this.setState({ showTip: true })
  }

  handleMouseLeave() {
    this.setState({ showTip: false })
  }

  render() {
    return (
      <div
        className={cn('iw-tooltippy', this.props.className)}
        onClick={this.handleClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        {this.props.children}
        <IWShowHide showIf={this.state.showTip}>
          <span className="iw-tooltippy__content">{this.props.tooltip}</span>
        </IWShowHide>
      </div>
    )
  }
}

IWTooltip.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  className: PropTypes.string,
  tooltip: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
}

IWTooltip.defaultProps = {
  children: null,
  className: '',
}
