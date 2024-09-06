import React from 'react'
import PropTypes from 'prop-types'
import Modal from '@insight/toolkit-react/lib/Modal/Modal'
import Button from '@insight/toolkit-react/lib/Button/Button'

export default function ConfirmationDeleteModal(props) {
  const { fieldName, closeModal, removeInput } = props
  return (
      <Modal onClose={closeModal} className='c-fieldWrapper-modal'>
        <Modal.Header>
          <h3>Please Confirm</h3>
        </Modal.Header>
        <Modal.Body id={fieldName}>
          You are about to delete input {fieldName}. Are you sure?
        </Modal.Body>
        <Modal.Footer>
          <Button color="secondary" onClick={closeModal}>No</Button>
          <Button color="primary" onClick={removeInput}>Yes</Button>
        </Modal.Footer>
      </Modal>
  )
}

ConfirmationDeleteModal.propTypes = {
  fieldName: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
  removeInput: PropTypes.func.isRequired
}
