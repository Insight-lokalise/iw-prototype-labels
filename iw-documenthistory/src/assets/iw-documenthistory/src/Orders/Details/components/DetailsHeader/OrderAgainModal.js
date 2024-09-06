import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { IWAnchor, IWButton, IWLoading, IWModal } from '../../../../libs/iw-components'
import { t } from '@insight/toolkit-utils/lib/labels'

export default class OrderAgainModal extends Component {
  constructor() {
    super()
    this.state = {
      isLoading: true,
    }
  }

  triggerDuplicateOrder = () => {
    this.props
      .duplicateOrder(this.props.orderNumber)
      .then(() => {
        window.location = '/insightweb/viewCart'
      })
      .catch(error => {
        this.setState({
          isLoading: false,
        })
        console.warn('Duplicate order failed')
        throw error
      })
  }

  render() {
    return (
      <IWModal
        backdropClassName="iw-dialog iw-dialog-backdrop"
        showIf={this.props.showOrderAgainModal}
        onShow={this.triggerDuplicateOrder}
        hideConfirmBtn
        hideHeaderCloseBtn
        onHide={this.props.onHide}
        onConfirm={this.triggerDuplicateOrder}
        modalSize="tiny"
        title={t('Order again')}
      >
        {this.state.isLoading ? (
          <div className="order-again-modal">
            <IWLoading />
            <br />
            <p>{t('Processing your request. Please wait...')}</p>
          </div>
        ) : (
          <div className="row">
            <div className="column">
              <p>{t('Your request can not be completed. Please try again.')}</p>
              <div className="row align-right">
                <div className="column small-6 medium-shrink">
                  <IWAnchor onClick={this.props.onHide} className="button hollow expanded">
                    {t('Cancel')}
                  </IWAnchor>
                </div>
                <div className="column small-6 medium-shrink">
                  <IWButton className="expanded" onClick={this.triggerDuplicateOrder} type="submit">
                    {t('Try again')}
                  </IWButton>
                </div>
              </div>
            </div>
          </div>
        )}
      </IWModal>
    )
  }
}

OrderAgainModal.propTypes = {
  duplicateOrder: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  orderNumber: PropTypes.number.isRequired,
  showOrderAgainModal: PropTypes.bool.isRequired,
}
