import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {Button, ButtonGroup, Modal} from '@insight/toolkit-react'
import {t} from '@insight/toolkit-utils'

export default function DuplicateModal({ onClose, onConfirm }) {
  const [isLoading, setLoading] = useState(false)
  const [hasError, setError] = useState(false)

  async function handleConfirm() {
    setLoading(true)
    try {
      await onConfirm()
      onClose()
    } catch (e) {
      setError(true)
    }
  }

  const confirmationBody = (
    <div className='o-grid'>
      <div className='o-grid__item u-1/1'>
        <p>{t('This will overwrite all categories, product groups, and product sets in the selected web group. Are you sure you want to duplicate?')}</p>
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
              {t('Confirm')}
            </Button>
          </ButtonGroup>
        </div>
      </div>
    </div>
  )

  const errorBody = (
    <div className='o-grid'>
      <div className='o-grid__item u-1/1'>
        <p>{t('There was an error with the duplication. Please try again later')}</p>
      </div>
      <div className="o-grid__item u-1/1">
        <div className="o-grid o-grid--justify-right u-border-top u-padding-top">
          <ButtonGroup align="right">
            <Button color="secondary" onClick={onClose}>
              {t('Close')}
            </Button>
          </ButtonGroup>
        </div>
      </div>
    </div>
  )

  return (
    <Modal isOpen onClose={onClose}>
      <Modal.Header>{t('Duplicate company standards')}</Modal.Header>
      <Modal.Body>
        { hasError ? errorBody : confirmationBody }
      </Modal.Body>
    </Modal>
  )
}

DuplicateModal.propTypes = {
  onConfirm: PropTypes.func.isRequired
}