import React, { useContext } from "react";
import Button from "@insight/toolkit-react/lib/Button/Button";
import Icon from "@insight/toolkit-react/lib/Icon/Icon";
import Dropdown from "@insight/toolkit-react/lib/Dropdown/Dropdown";
import IconDropdown from "@insight/toolkit-react/lib/Icon/IconDropdown";
import HeaderContext from "@insight/toolkit-react/lib/Header/HeaderContext";
import { t } from "@insight/toolkit-utils/lib/labels";
import PersonMenu from "./PersonMenu";
import { MASTHEAD_ICON_TITLES_ACCOUNT } from '../../../api/common/constants'
import useDefaultOverlay from "../../../hooks/useDefaultOverlay";

export default function PersonLink({ isDesktop }) {
  const { activeFlyout, toggleFlyout, closeMegaMenu } =
    useContext(HeaderContext);
  const menuFlyOutId = "flyout2";
  const showCloseIcon = activeFlyout == menuFlyOutId;
  const title = MASTHEAD_ICON_TITLES_ACCOUNT

  function handleClick() {
    toggleFlyout(menuFlyOutId);
    if (activeFlyout) {
      closeMegaMenu();
    }
  }

  const stateProps = useDefaultOverlay()

  return (
    <li className="o-list-inline__item  c-header-simple-nav__item">
      {isDesktop && (
        <Dropdown
          id="accountMenuSimple"
          className="c-person-dropdown"
          ariaLabel={t("Account menu")}
          position="right"
          text={<Icon icon="person" title={t(title)}/>}
          title={t(title)}
          {...stateProps}
        >
          <PersonMenu />
        </Dropdown>
      )}
      {!isDesktop && (
        <Button onClick={handleClick} className="c-person-dropdown--mobile">
          <Icon icon={showCloseIcon ? "close" : "person"} />
          {!showCloseIcon && (
            <IconDropdown className="c-person-dropdown__icon" />
          )}
        </Button>
      )}
    </li>
  );
}
