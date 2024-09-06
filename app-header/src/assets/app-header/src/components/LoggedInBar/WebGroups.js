import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import Dropdown from "@insight/toolkit-react/lib/Dropdown/Dropdown";
import listen from "@insight/toolkit-utils/lib/events/listen";

import { getWebGroups, switchWebGroup, t } from "api";
import { ModalContext, MODALS } from "../Modal";
import DropdownBody from "./DropdownBody";
import DropdownButton from "./DropdownButton";

export default function WebGroups({ webGroup }) {
  const [webGroupDetails, setWebGroupDetails] = useState({
    results: [],
    totalResults: 0,
  });
  const { setActiveModal } = useContext(ModalContext);

  useEffect(() => {
    handleSearch("");

    return listen("web-group:switch", (data) => {
      handleSelect(data);
    });
  }, []);

  function handleSearch(searchTerm) {
    getWebGroups(searchTerm).then((webGroupsResponse) => {
      setWebGroupDetails(webGroupsResponse);
    });
  }

  function handleSelect(selection) {
    setActiveModal(MODALS.SWITCH_SELECTION_MODAL, {
      onConfirm: () => {
        switchWebGroup(selection);
      },
      title: t("Change web group"),
    })
  }

  function renderButton(buttonProps) {
    return (
      <DropdownButton
        {...buttonProps}
        icon="people"
        enabled={webGroupDetails && webGroupDetails.totalResults > 1}
      >
        {`${t("Web Group")} – ${webGroup.name}`}
      </DropdownButton>
    );
  }

  return (
    <Dropdown
      id="webGroupDropdown"
      closeOnDropdownClick={false}
      className="c-header-account-menu__dropdown"
      dropdownMenuClassName="c-header-account-menu__dropdown-menu"
      position="full-width"
      renderButton={renderButton}
    >
      <DropdownBody
        currentItemId={webGroup.id}
        handleSearch={handleSearch}
        handleSelect={handleSelect}
        listItems={webGroupDetails ? webGroupDetails.results : []}
        type={"webGroup"}
      />
    </Dropdown>
  );
}

WebGroups.propTypes = {
  webGroup: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};
