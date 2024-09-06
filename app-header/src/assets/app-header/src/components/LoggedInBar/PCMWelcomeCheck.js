import React, {useContext, useEffect} from 'react'
import IAHeaderContext from '../../context/IAHeaderContext'
import { ModalContext, MODALS } from '../Modal'
import { getPCMWelcomeCheck } from 'api'

export default function PCMWelcomeCheck() {

  const {
    headerInfo: { userInformation },
  } = useContext(IAHeaderContext)
  const { setActiveModal } = useContext(ModalContext)

  useEffect(() => {    
    getPCMWelcomeCheck(userInformation.username).then((response)=>{              
      if(response && response.data === true)
        setActiveModal(MODALS.PCM_WELCOM_MODAL);
    })    
  }, []);

  return null;

}
