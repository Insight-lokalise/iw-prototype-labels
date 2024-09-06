import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'react-overlays'

import { t } from '@insight/toolkit-utils/lib/labels'
import { IWButton } from '../IWButton/IWButton'

export default function IWModal(props) {
  const {
    backdropClassName,
    hideCancelBtn,
    cancelBtnText,
    confirmBtnText,
    hideConfirmBtn,
    hideHeader,
    hideHeaderCloseBtn,
    modalSize,
    onConfirm,
    onHide,
    onShow,
    showIf,
    title,
    titleClassName,
    children,
    isCanada,
  } = props

  return (
    <Modal
      aria-labelledby="modal-label"
      show={showIf}
      onHide={onHide}
      onShow={onShow}
      backdropClassName={`iw-styles ${backdropClassName}`}
    >
      <div className={`iw-styles iw-dialog iw-dialog-contents ${modalSize}`}>
        <div className="iw-modal">
          {!hideHeader && (
            <header className="row align-middle">
              <div className="columns expand">
                <h3 className={`iw-modal__heading ${titleClassName}`}>{t(title)}</h3>
              </div>
              {!hideHeaderCloseBtn && (
                <div className="columns shrink">
                  <span onClick={onHide} className="iw-dialog__icon--close ion-ios-close-empty" data-testid="modal-icon-close" />
                </div>
              )}
            </header>
          )}
          {children}
          {(cancelBtnText || !hideConfirmBtn) && (
            <footer className="row align-right">
              {!hideCancelBtn &&
                cancelBtnText && (
                  <div className="columns small-6 medium-shrink">
                    <IWButton className="iw-modal__button expanded hollow no-margin-bot" onClick={onHide} type="button">
                      {t(cancelBtnText)}
                    </IWButton>
                  </div>
                )}
              {!hideConfirmBtn && (
                <div className="columns small-6 medium-shrink">
                  <IWButton
                    className="iw-modal__button expanded no-margin-bot"
                    onClick={event => {
                      onConfirm(event)
                      if (!event.isPropagationStopped()) {
                        onHide()
                      }
                    }}
                    type="button"
                  >
                    {t(confirmBtnText)}
                  </IWButton>
                </div>
              )}
            </footer>
          )}
        </div>
      </div>
    </Modal>
  )
}

IWModal.propTypes = {
  backdropClassName: PropTypes.string.isRequired,
  cancelBtnText: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  confirmBtnText: PropTypes.string,
  hideCancelBtn: PropTypes.bool,
  hideConfirmBtn: PropTypes.bool,
  hideHeader: PropTypes.bool,
  hideHeaderCloseBtn: PropTypes.bool,
  modalSize: PropTypes.string,
  onConfirm: PropTypes.func,
  onHide: PropTypes.func.isRequired,
  onShow: PropTypes.func,
  showIf: PropTypes.bool.isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  titleClassName: PropTypes.string,
}

IWModal.defaultProps = {
  cancelBtnText: '',
  children: null,
  confirmBtnText: '',
  hideCancelBtn: false,
  hideConfirmBtn: false,
  hideHeader: false,
  hideHeaderCloseBtn: false,
  modalSize: 'medium',
  onConfirm: () => null,
  onShow: () => null,
  title: '',
  titleClassName: '',
}
