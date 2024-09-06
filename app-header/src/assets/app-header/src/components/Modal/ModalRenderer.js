import React, { useContext } from 'react'

import { MODALS_MAP, ModalContext } from './'

export default function ModalRenderer() {
  const { activeModal, activeModalProps, closeModal } = useContext(ModalContext)

  function handleCloseModal() {
    closeModal()
    if (activeModalProps.onClose) {
      activeModalProps.onClose()
    }
  }

  const ActiveModal = MODALS_MAP[activeModal]

  return activeModal && <ActiveModal {...activeModalProps} onClose={handleCloseModal} />
}
