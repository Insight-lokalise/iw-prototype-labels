import React, {Fragment} from "react";
import { t } from "@insight/toolkit-utils/lib/labels";
import Panel from "@insight/toolkit-react/lib/Panel/Panel";
import Button from "@insight/toolkit-react/lib/Button/Button";
import Lozenge from "@insight/toolkit-react/lib/Lozenge/Lozenge";
import Address from "@insight/toolkit-react/lib/Address/Address";
import Icon from "@insight/toolkit-react/lib/Icon/Icon";
import Tooltip from "@insight/toolkit-react/lib/Tooltip/Tooltip";

const AccountItem = ({
  account,
  currentSoldToNumber,
  setDefaultAccount,
  handleAccountSelect,
}) => {
  const { address } = account
  const isCurrentAccount = account.soldtoNumber == currentSoldToNumber;
  const isDefault = account.isDefault;
  const border = ( account.isDefault || isCurrentAccount ) ? "c-panel-border__default" : "c-panel-border";

  return (
    <div className="o-grid__item u-1/1 u-1/2@tablet u-1/4@desktop">
      <Panel className={`${border} c-panel-border c-account-tiles u-text-bold`}>
        <Panel.Body>

          {account.soldtoName}<br />
          {account.soldtoNumber}<br />
          <Address
            address={{
              address1: address.address1,
              address2: address.address2,
              address3: address.address3,
              city: address.city,
              state: address.state,
              zipcode: address.zipCode,
              country: address.countryId,
              phone: account.phoneNumber,
            }}
          />
          <div className="c-account-tiles__buttons">
            <div className="o-grid">
              <div className="o-grid__item">
                {isDefault ? (
                  <Fragment>
                    <Lozenge
                      className="c-account-tiles__default-lozenge"
                      color="info"
                    >
                      {t("Default")}
                    </Lozenge>
                  </Fragment>
                ) : (
                  <Button
                    className="c-account-tiles__default-button"
                    color="link"
                    iconPosition="left"
                    onClick={() =>
                      setDefaultAccount({accountNumber: account.soldtoNumber})
                    }
                  >
                    {t("Set as default")}
                  </Button>
                )}
              </div>
              <div className="o-grid__item o-grid__item--shrink">
                {isCurrentAccount ? (
                  <Fragment>
                    <Lozenge
                      className="c-account-tiles__default-lozenge"
                      color="info"
                    >
                      {t("Current")}
                    </Lozenge>
                  </Fragment>
                ) : (
                  <Button
                    className="c-account-tiles__default-button"
                    color="link"
                    iconPosition="left"
                    onClick={() =>
                      handleAccountSelect(account.soldtoNumber)
                    }
                  >
                    {t("Select")}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Panel.Body>
      </Panel>
    </div>
  );
};

export default AccountItem;
