import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {Button, ButtonGroup, Modal} from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'

export default function PublishAllModal({ onClose, onConfirm, wId, messenger }) {
  const [isLoading, setLoading] = useState(false)

  async function handleConfirm() {
    setLoading(true)
    try {
      await onConfirm({wId, messenger})      
    } catch (e) {
      console.log(e)
    }
    onClose()
  }

  const confirmationBody = (
    <div className='o-grid'>
      <div className='o-grid__item u-1/1'>
        <p>{t('Are you sure you want to publish all categories, product groups and product sets?')}</p>
      </div>
      <div className="o-grid__item u-1/1">
        <div className="o-grid o-grid--justify-right u-border-top u-padding-top">
          <ButtonGroup align="right">
            <Button color="secondary" onClick={onClose}>
              {t('Cancel')}
            </Button>
            <Button
              color="primary"
              isLoading={isLoading}
              onClick={handleConfirm}
            >
              {t('Publish all')}
            </Button>
          </ButtonGroup>
        </div>
      </div>
    </div>
  )

  return (
    <Modal isOpen onClose={onClose}>  
      <Modal.Body>
        { confirmationBody }
      </Modal.Body>
    </Modal>
  )
}

PublishAllModal.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  wId: PropTypes.string.isRequired,
  messenger: PropTypes.func.isRequired,
}