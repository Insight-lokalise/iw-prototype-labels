import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Modal from "@insight/toolkit-react/lib/Modal/Modal";
import Button from "@insight/toolkit-react/lib/Button/Button";
import listen from "@insight/toolkit-utils/lib/events/listen";
import { t } from "@insight/toolkit-utils/lib/labels";
import { getAccounts } from "../../../api";
import DropdownBody from "./DropdownBody";

export default function DefaultAccountModal(props) {
  const { accountId, handleSelect, onClose, accounts } = props;
  const [accountDetails, setAccountDetails] = useState({
    results: [],
    totalResults: 0,
  });

  useEffect(() => {
    setAccountDetails(accounts);
    return listen("account:switch", (data) => {
      handleSelect(data);
    });
  }, []);

  const handleSearch = async (searchTerm) => {
    const webGroupsResponse = await getAccounts(searchTerm, accountId);
    setAccountDetails(webGroupsResponse);
  };

  return (
    <Modal
      isOpen
      closeOnOutsideClick
      closeOnEsc
      onClose={onClose}
      size="medium"
    >
      <Modal.Body>
        <div className="c-default-account-modal">
          <DropdownBody
            currentItemId={accountId}
            handleSearch={handleSearch}
            handleSelect={handleSelect}
            listItems={accountDetails ? [...accountDetails.results] : []}
            type={"account"}
          />
        </div>
        <div className="c-modal-link-container">
          <Button color="link" className="c-modal-link" href="/insightweb/userProfile/accounts">
            {`${t('See all available accounts')}(${accountDetails.totalResults})`}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

DefaultAccountModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  accountId: PropTypes.number.isRequired,
  handleSelect: PropTypes.func.isRequired,
  accounts: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};
