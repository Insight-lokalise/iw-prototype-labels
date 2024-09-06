import React, { useRef, useEffect } from "react";
import { Button, Icon, Modal } from '@insight/toolkit-react';
import { t } from '@insight/toolkit-utils';
import { REPORTING_TEXTS } from '../../texts';
const {
  REPORT_OPTIONS,
} = REPORTING_TEXTS;

const DeletionModal = ({ handleDelete, message }) => {
  const deletionModalClass = 'c-reporting__deletion-modal';
  const modalRef = useRef(null);

  useEffect(() => {
    // For Accessing Open Modal using Tab on keyboard
    const modal = modalRef?.current?.modal;
    if (modal?.focus) {
      modal?.focus?.();
    }
  }, []);

  return (
    <Modal
      isOpen
      ref={modalRef}
      size='medium'
      onClose={() => handleDelete(null)}
      className={`${deletionModalClass}`}
    >
      <Modal.Body id={`${deletionModalClass}__modal-body`}>
        <span><Icon icon="information-circled" type="error" /></span>
        <span>{message}</span>
      </Modal.Body>
      <Modal.Footer>
        <Button color="link" onClick={() => handleDelete(null)}>
          {t(REPORT_OPTIONS.CANCEL)}
        </Button>
        <Button color="primary" onClick={() => handleDelete(null, true)}>
          {t(REPORT_OPTIONS.DELETE)}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeletionModal;