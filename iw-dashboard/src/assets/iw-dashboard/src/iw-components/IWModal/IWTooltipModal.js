import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { IWModal } from '../'

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
      <span className="ion-help-circled help-icon__icon hide-for-print" onClick={this.handleClick}>
        <IWModal
          backdropClassName="iw-dialog iw-dialog-backdrop"
          confirmBtnText={'Cancel'}
          onHide={this.handleModalClose}
          onConfirm={this.handleModalClose}
          showIf={this.state.showModal}
          title={this.props.title}
          {...this.props}
        >
          {this.props.modalBody}
        </IWModal>
      </span>
    )
  }
}

IWTooltipModal.propTypes = {
  modalBody: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
}
