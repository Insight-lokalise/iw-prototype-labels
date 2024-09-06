import AlertModal from './AlertModal/AlertModal'
import InsightNewsModal from './InsightNewsModal/InsightNewsModal'
import SwitchSelectionModal from './SwitchSelectionModal/SwitchSelectionModal'
import PCMWelcomeModal from './PCMWelcomeModal/PCMWelcomeModal'
import DefaultAccountModal from './DefaultAccountModal/DefaultAccountModal'

export const MODALS_MAP = {
  ALERT_MODAL: AlertModal,
  NEWS_MODAL: InsightNewsModal,
  SWITCH_SELECTION_MODAL: SwitchSelectionModal,
  PCM_WELCOM_MODAL: PCMWelcomeModal,
  DEFAULT_ACCOUNT_MODAL: DefaultAccountModal,
}

export const MODALS = Object.keys(MODALS_MAP).reduce((prev, curr) => {
  prev[curr] = curr
  return prev
}, {})

export { default as ModalContext } from '../../context/ModalContext'
