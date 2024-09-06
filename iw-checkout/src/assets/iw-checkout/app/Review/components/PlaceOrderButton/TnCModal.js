import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils/lib/labels'
import Button from '@insight/toolkit-react/lib/Button/Button'
import Loading from '@insight/toolkit-react/lib/Loading/Loading'
import Modal from '@insight/toolkit-react/lib/Modal/Modal'

export default function TnCModal ({ hideTnCModal, showTnCModal, termsTitle, tncContent }) {
  return (
    <Modal
      isOpen={showTnCModal}
      onClose={hideTnCModal}
      size={'medium'}
      scrollDisabled={false}
     >
      <Modal.Header onClick={hideTnCModal}>{termsTitle}</Modal.Header>
        { tncContent ? (
            <Fragment>
              <Modal.Body id="cart-agreement__body">
                <div className='cart-agreement__modal' dangerouslySetInnerHTML={{__html: tncContent}} />
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={hideTnCModal} color='secondary'>{t('Close')}</Button>
              </Modal.Footer>
            </Fragment>
        ) : (
            <Modal.Body id="cart-agreement__loading" className="u-text-center">
              <Loading size="large" />
            </Modal.Body>
        )}
      </Modal>
  )
}

TnCModal.propTypes = {
  hideTnCModal: PropTypes.func.isRequired,
  showTnCModal: PropTypes.bool.isRequired,
  termsTitle: PropTypes.string.isRequired,
  tncContent: PropTypes.string.isRequired
}
