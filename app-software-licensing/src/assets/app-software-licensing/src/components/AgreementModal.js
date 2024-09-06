import React from 'react'
import { t } from '@insight/toolkit-utils';
import { Button, Modal } from '@insight/toolkit-react'
import PropTypes from 'prop-types';
import {  reportZeroUsage } from '../api/us'
import { Ok } from '../constants'

export default function AgreementModal(props) {
  const {
    isUsageReportableModal,
    modalBodyContent,
    modalHeaderContent,
    modalIsOpen,
    openCloseModal,
    programId
  } = props

  const reportUsageToCart = async() => {
    reportZeroUsage(programId)
    window.location.href = '/insightweb/viewCart'
  }

  return(
    <Modal
      className='c-agreement-modal'
      isOpen={modalIsOpen}
      onClose={openCloseModal}
    >
      <Modal.Header className="c-agreement-modal__header">
        {t(modalHeaderContent)}
      </Modal.Header>
      <Modal.Body className="c-agreement-modal__body">
        <p>{t(modalBodyContent)}</p>
      </Modal.Body>
      {isUsageReportableModal ?
        <Modal.Footer className="right">
          <Button onClick={reportUsageToCart} color="secondary">
            {t(Ok)}
          </Button>
        </Modal.Footer>
        : ''
      }
    </Modal>
  )
}

AgreementModal.propTypes = {
  isUsageReportableModal: PropTypes.bool.isRequired,
  modalBodyContent: PropTypes.string.isRequired,
  modalHeaderContent: PropTypes.string,
  modalIsOpen: PropTypes.bool.isRequired,
  openCloseModal: PropTypes.func.isRequired,
  programId: PropTypes.string
}

AgreementModal.defaultProps={
  modalHeaderContent: '',
  programId: ''
}
