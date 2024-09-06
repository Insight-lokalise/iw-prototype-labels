import React from 'react'
import PropTypes from 'prop-types'
import Modal from '@insight/toolkit-react/lib/Modal/Modal'
import Button from '@insight/toolkit-react/lib/Button/Button'
import { useSelector } from 'react-redux'

export default function GroupDeleteModal(props) {
  const { dispatcher, closeModal, id } = props
  const group = useSelector(state => state.builder.groups[id])
  const removeGroup = () => {
      dispatcher.removeGroup(id)
      closeModal()
  }
  const name = group.name ? `the group ${group.name}` : 'an unnamed group'
  return (
      <Modal onClose={closeModal} className='c-fieldWrapper-modal'>
        <Modal.Header>
          <h3>Please Confirm</h3>
        </Modal.Header>
        <Modal.Body id={id}>
          You are about to delete {name}. Are you sure?
        </Modal.Body>
        <Modal.Footer>
          <Button color="secondary" onClick={closeModal}>No</Button>
          <Button color="primary" onClick={removeGroup}>Yes</Button>
        </Modal.Footer>
      </Modal>
  )
}

GroupDeleteModal.propTypes = {
  id: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
  dispatcher: PropTypes.object.isRequired
}
