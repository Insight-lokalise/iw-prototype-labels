import React, {useContext, useEffect} from 'react'
import { ModalContext, MODALS } from '../Modal'
import { switchAccount, t } from 'api'

export default function DefaultAccountCheck({account}) {

  const { setActiveModal } = useContext(ModalContext)

  const handleSelect = (selection) => {
    setActiveModal(MODALS.SWITCH_SELECTION_MODAL, {
      onConfirm: () => {
        switchAccount(selection)
      },
      onCancel: openDefaultAccountModal,
      title: t('Change account'),
    })
  }

  const openDefaultAccountModal = () => {
    if(account && account.id == '')
      setActiveModal(
        MODALS.DEFAULT_ACCOUNT_MODAL,
        {
          account,
          handleSelect,
        }
      );
  }

  useEffect(() => {    
    openDefaultAccountModal()
  }, []);

  return null;

}
