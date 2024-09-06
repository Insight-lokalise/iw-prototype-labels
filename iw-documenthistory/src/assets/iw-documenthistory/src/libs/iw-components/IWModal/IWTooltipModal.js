import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { SummaryEwrModal } from '@insight/toolkit-react/lib/Summary/SummaryEwrModal'
export default class IWTooltipModal extends PureComponent {
  constructor() {
    super()
    this.state = { showModal: false }
    this.handleClick = this.handleClick.bind(this)
    this.handleModalClose = this.handleModalClose.bind(this)
  }

  handleClick() {
    this.setState({ showModal: true })
  }

  handleModalClose() {
    this.setState({ showModal: false })
  }

  render() {
    return (
      <>
      <span className="ion-help-circled help-icon__icon hide-for-print" onClick={this.handleClick}></span>
      {this.state.showModal ? (
        <SummaryEwrModal
          onClose={this.handleModalClose}
          isCanada={this.props.isCanada}
          locale={this.props.locale}
        />
      ) : null}
      </>
    )
  }
}

IWTooltipModal.propTypes = {
  isCanada: PropTypes.bool.isRequired,
  locale: PropTypes.string.isRequired,
}