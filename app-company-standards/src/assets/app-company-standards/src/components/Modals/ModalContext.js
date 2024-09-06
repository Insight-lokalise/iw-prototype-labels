import { createContext } from 'react'

const ModalContext = createContext({
  activeModal: null,
  activeModalProps: {},
  closeModal: () => {},
  setActiveModal: () => {},
})

export default ModalContext
