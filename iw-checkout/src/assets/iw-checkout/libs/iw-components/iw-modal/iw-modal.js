import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'react-overlays'

import { t } from '@insight/toolkit-utils/lib/labels'
import { IWButton } from '../../iw-components'

export const IWModal = (props) => {
    return (
        <Modal
            aria-labelledby='modal-label'
            show={props.showIf}
            onHide={props.onHide}
            onShow={props.onShow}
            backdropClassName={props.backdropClassName}
            className='cart-container ds-v1'
        >
            <div className={`iw-dialog iw-dialog-contents ${props.modalSize || 'medium'}`}>
                <div className="iw-modal">
                    <header className="row align-middle">
                        <div className="columns" id="modal-label">
                            <h3 className="iw-modal__heading">{t(props.title)}</h3>
                        </div>
                        { !props.disableCloseButton &&
                            <div className="columns flex-child-shrink self-align-right">
                                <span onClick={props.onHide} className="iw-dialog__icon--close ion-ios-close-empty" role="button" tabIndex="0" aria-label={t("Close Save Cart Content Model")}></span>
                            </div>
                        }
                    </header>
                    {props.children}
                    { ('cancelBtnText' in props || !props.hideConfirmButton) &&
                        <footer>
                            <div className="row align-right">
                                { props.cancelBtnText &&
                                    <div className="columns small-6 medium-shrink">
                                        <IWButton
                                            className="expanded hollow no-margin-bot"
                                            onClick={props.onHide}
                                            type="button"
                                            >
                                            {t(props.cancelBtnText)}
                                        </IWButton>
                                    </div>
                                }
                                { !props.hideConfirmButton &&
                                    <div className="columns small-6 medium-shrink">
                                        <IWButton
                                            className="expanded no-margin-bot"
                                            onClick={(event) => {
                                                props.onConfirm(event);
                                                if (!event.isPropagationStopped()) {
                                                    props.onHide();
                                                }
                                            }}
                                            type="button"
                                        >
                                            {t(props.confrimBtnText)}
                                        </IWButton>
                                    </div>
                                }
                            </div>
                        </footer>
                    }
                </div>
            </div>
        </Modal>
    )
}


IWModal.propTypes = {
    title: PropTypes.string.isRequired,
    backdropClassName: PropTypes.string.isRequired,
    cancelBtnText: PropTypes.string,
    confrimBtnText: PropTypes.string,
    onHide: PropTypes.func.isRequired,
    onConfirm: PropTypes.func,
    showIf: PropTypes.bool.isRequired,
    modalSize: PropTypes.string,
}
