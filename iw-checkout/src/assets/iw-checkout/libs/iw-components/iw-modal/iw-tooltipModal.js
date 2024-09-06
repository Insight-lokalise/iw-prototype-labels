import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { t } from '@insight/toolkit-utils/lib/labels'
import { IWModal } from './iw-modal'


export class IWTooltipModal extends PureComponent {
    constructor() {
        super()
        this.state = { showModal: false }
    }

    handleClick = () => {
        this.setState({ showModal: true })
    };

    handleModalClose = () => {
        this.setState({ showModal: false })
    };

    render() {
        return (
          <span>
            <span className="ion-help-circled help-icon__icon" onClick={this.handleClick} ></span>
            <IWModal
                backdropClassName='iw-dialog iw-dialog-backdrop'
                confrimBtnText={t('Cancel')}
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
