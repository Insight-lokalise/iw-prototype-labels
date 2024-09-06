import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import Button from '@insight/toolkit-react/lib/Button/Button'
import Modal from '@insight/toolkit-react/lib/Modal/Modal'
import { t } from 'api'
import IAHeaderContext from '../../../context/IAHeaderContext'

export default function PCMWelcomeModal(props) {
  const { onClose } = props
  const URL_US = "www.insight.com"
  const URL_CA = "ca.insight.com"
  const {
    headerInfo: { locale },
  } = useContext(IAHeaderContext)  

  function renderDomain() {
    return (locale.toLowerCase().includes('us')) ? URL_US : URL_CA
  }

  return (
    <Modal isOpen onClose={()=>false} size="medium">      
      <Modal.Body className="c-pcm-modal">
        <h3 className="c-pcm-text">{t('Welcome to insight.com')}</h3>
        <p className="c-pcm-text">{t('PCM is now a division of Insight.')}</p>
        <p className="c-pcm-text">{t('Your PCM client account has been migrated to Insight so that we can continue providing the IT solutions you depend on.')}</p>
        <p className="c-pcm-text">
        {t('Please update your bookmarks to')} <a className="c-pcm-text" href={'https://'+renderDomain()}>{renderDomain()}</a> {t('for faster access to your Insight account dashboard, a centralized hub for e-procurement, services and support.')}
        </p>                
      </Modal.Body>
      <Modal.Footer className="c-pcm-modal">        
        <Button color="secondary" onClick={onClose}>
          {t('Continue to insight.com')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

PCMWelcomeModal.propTypes = {
  onClose: PropTypes.func.isRequired  
}
