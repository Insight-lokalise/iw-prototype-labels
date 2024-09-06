import React, { useContext } from 'react'
import ModalContext from './ModalContext'

import { MODALS_MAP } from './index'

export default function ModalRenderer() {
  const { activeModal, activeModalProps, closeModal } = useContext(ModalContext)
  const ActiveModal = MODALS_MAP[activeModal]

  function handleCloseModal() {
    closeModal()
    if (activeModalProps.onClose) {
      activeModalProps.onClose()
    }
  }

  return activeModal && <ActiveModal {...activeModalProps} onClose={handleCloseModal} />
}
