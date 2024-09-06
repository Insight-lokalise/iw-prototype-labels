import React from 'react'
import PropTypes from 'prop-types'
import Button from '@insight/toolkit-react/lib/Button/Button'
import Modal from '@insight/toolkit-react/lib/Modal/Modal'
import { t } from 'api'

export default function AlertModal(props) {
  const { onClose, title, message } = props

  return (
    <Modal isOpen onClose={onClose}>
      <Modal.Header onClick={onClose}>{title}</Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button color="secondary" onClick={onClose}>
          {t('Close')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

AlertModal.propTypes = {
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
}
