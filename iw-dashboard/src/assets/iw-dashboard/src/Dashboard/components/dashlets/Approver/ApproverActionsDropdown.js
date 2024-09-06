import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils'

import { postInvalidPartsAndCreditCard } from '../../../../services'
import { IWSelect, IWLoading, IWModal } from '../../../../iw-components'

export default class ApproverActionsDropdown extends Component {
  constructor() {
    super()

    this.state = {
      hasDiscontinuedParts: false,
      hasInvalidCreditCart: false,
      isLoading: false,
      optionsList: [],
      showModal: false,
    }

    this.getOptions = this.getOptions.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
  }

  getOptions() {
    const { purchaseRequestId, lastApprover } = this.props.requisition
    postInvalidPartsAndCreditCard({
      purchaseRequestId,
      lastApprover,
    }).then(({ data: { allDiscontinuedParts, discontinuedParts, invalidCreditCard } }) => {
      this.setState(
        {
          hasDiscontinuedParts: allDiscontinuedParts || discontinuedParts,
          hasInvalidCreditCart: invalidCreditCard,
          isLoading: false,
          optionsList: createOptionsList(allDiscontinuedParts),
        },
        () => {
          if (this.state.hasDiscontinuedParts) {
            this.props.handleError(generateError(allDiscontinuedParts, discontinuedParts))
          }
        }
      )
    })
  }

  handleClick() {
    this.setState({ isLoading: true }, this.getOptions)
  }

  handleSelect(e) {
    if (this.state.hasInvalidCreditCart && e.value === 1) {
      this.setState({ showModal: true })
      return
    }
    this.props.handleAction(e)
  }

  render() {
    const { referenceNumber, purchaseRequestId, webGroup, statusId } = this.props.requisition

    const placeholderText = statusId === 6 ? 'Under review' : 'Select'

    const selectDropdown =
      this.state.optionsList.length > 0 ? (
        <IWSelect
          className="dashlet__table-dropdown"
          autoFocus
          autoSize
          openOnFocus
          onChange={this.handleSelect}
          options={this.state.optionsList}
          placeholder={t(placeholderText)}
          resetValue={placeholderText}
          searchable={false}
          value={this.props.value}
        />
      ) : (
        <div className="Select dashlet__table-dropdown" onClick={this.handleClick}>
          <div className="Select-control">
            <div className="Select-placeholder">{t(placeholderText)}</div>
            <div className="Select-input" />
            <span className="Select-arrow-zone">
              {!this.state.isLoading ? <span className="Select-arrow" /> : <IWLoading />}
            </span>
          </div>
        </div>
      )

    return (
      <div>
        {selectDropdown}
        <IWModal
          backdropClassName="iw-dialog iw-dialog-backdrop"
          titleClassName="iw-modal__heading-icon ion-android-alert"
          cancelBtnText={t('Cancel')}
          confirmBtnText={t('Continue')}
          hideHeaderCloseBtn
          onConfirm={() => {
            window.location = `ar/payment?referenceNumber=${referenceNumber}&purchaseReqId=${purchaseRequestId}&Type=CC&From=DAR&referecenNum=${referenceNumber}&clientBrowserDate=null&webGroupId=${webGroup}`
          }}
          onHide={() => this.setState({ showModal: false })}
          showIf={this.state.showModal}
          title={t('Required credit card information is missing')}
          modalSize="small"
        >
          <div className="row">
            <div className="column">
              <p>{t('Click continue to enter the credit card information')}</p>
              <p>{t('Upon approval, you will be returned to My Requisition History')}</p>
            </div>
          </div>
        </IWModal>
      </div>
    )
  }
}

ApproverActionsDropdown.propTypes = {
  requisition: PropTypes.shape({
    lastApprover: PropTypes.bool.isRequired,
    purchaseRequestId: PropTypes.number.isRequired,
    referenceNumber: PropTypes.number.isRequired,
    statusId: PropTypes.number.isRequired,
    webGroup: PropTypes.string.isRequired,
  }).isRequired,
  // implicit
  handleAction: PropTypes.func,
  handleError: PropTypes.func,
  value: PropTypes.oneOf([1, 3, 6, null]),
}

ApproverActionsDropdown.defaultProps = {
  handleAction: () => null,
  handleError: () => null,
  value: null,
}

function createOptionsList(allDiscontinuedParts) {
  // values: 1(approve) /2 (cancel) / 3 (deny) / 6 (under review)
  const approveOption = { label: t('Approve'), value: 1 }
  const reviewOption = { label: t('Under Review'), value: 6 }
  const denyOption = { label: t('Deny'), value: 3 }

  return allDiscontinuedParts ? [denyOption] : [approveOption, reviewOption, denyOption]
}

function generateError(allPartsAreDiscontinued, somePartsAreDiscontinued) {
  if (allPartsAreDiscontinued) {
    return t('The requisition does not contain any valid line items')
  } else if (somePartsAreDiscontinued) {
    return t('The requisition contains one or more invalid line items')
  }
  return null
}
