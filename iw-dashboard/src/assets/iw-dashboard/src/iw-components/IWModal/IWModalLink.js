import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { IWAnchor, IWModal } from '../'

export default class IWModalLink extends Component {
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
    const {
      cancelBtnText,
      confirmBtnText,
      hideConfirmBtn,
      hideHeaderCloseBtn,
      linkClassName,
      linkMarkup,
      modalBody,
      modalSize,
      modalTitle,
      onConfirm,
      isValid,
      ...otherProps
    } = this.props

    return (
      <IWAnchor onClick={this.handleClick} className={linkClassName}>
        {linkMarkup}
        <IWModal
          backdropClassName="iw-dialog iw-dialog-backdrop"
          cancelBtnText={cancelBtnText}
          confirmBtnText={confirmBtnText}
          hideConfirmBtn={hideConfirmBtn}
          hideHeaderCloseBtn={hideHeaderCloseBtn}
          modalSize={modalSize}
          onHide={this.handleModalClose}
          onConfirm={evt => {
            if (!isValid()) {
              evt.stopPropagation()
              return
            }
            this.props.onConfirm()
            this.handleModalClose()
          }}
          showIf={this.state.showModal}
          title={modalTitle}
          {...otherProps}
        >
          {modalBody}
        </IWModal>
      </IWAnchor>
    )
  }
}

IWModalLink.propTypes = {
  cancelBtnText: PropTypes.string,
  confirmBtnText: PropTypes.string,
  hideConfirmBtn: PropTypes.bool,
  hideHeaderCloseBtn: PropTypes.bool,
  linkClassName: PropTypes.string,
  linkMarkup: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.node.isRequired]).isRequired,
  modalBody: PropTypes.node.isRequired,
  modalSize: PropTypes.string,
  modalTitle: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  isValid: PropTypes.func,
}

IWModalLink.defaultProps = {
  cancelBtnText: 'Cancel',
  confirmBtnText: 'Confirm',
  hideConfirmBtn: false,
  hideHeaderCloseBtn: false,
  modalSize: 'large',
  isValid: () => true,
}
