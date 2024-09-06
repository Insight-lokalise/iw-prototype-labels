import React, { useState } from "react";
import PropTypes from "prop-types";
import Button from "@insight/toolkit-react/lib/Button/Button";
import Modal from "@insight/toolkit-react/lib/Modal/Modal";
import { t } from "@insight/toolkit-utils/lib/labels";

export default function SwitchSelectionModal(props) {
  const { onClose, onConfirm, onCancel, title } = props;

  const [isConfirmButtonDisabled, setIsConfirmButtonDisabled] = useState(false);

  const onConfirmHandler = () => {
    setIsConfirmButtonDisabled(true);
    onConfirm();
  };

  const onCloseHandler = () => {
    onClose();
    if (onCancel) onCancel();
  };

  const changesList = [
    t("User access"),
    t("User accounts"),
    t("Shipping, billing and payment options"),
  ];

  return (
    <Modal
      isOpen
      closeOnOutsideClick
      closeOnEsc
      onClose={onCloseHandler}
      size="small"
    >
      <Modal.Header>{title}</Modal.Header>
      <Modal.Body>
        <p>{t("If there are items in your cart they will be removed.")}</p>
        <p>{t("You may also notice changes to:")}</p>
        <ul>
          {changesList.map((change) => (
            <li key={change}>{change}</li>
          ))}
        </ul>
        <p>{t("Do you want to continue?")}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button color="secondary" onClick={onCloseHandler}>
          {t("Cancel")}
        </Button>
        <Button
          color="primary"
          isDisabled={isConfirmButtonDisabled}
          onClick={onConfirmHandler}
        >
          {t("Continue")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

SwitchSelectionModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
