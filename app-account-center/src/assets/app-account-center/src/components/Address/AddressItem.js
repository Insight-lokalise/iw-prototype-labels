import React from "react";
import { t } from "@insight/toolkit-utils/lib/labels";
import Panel from "@insight/toolkit-react/lib/Panel/Panel";
import Button from "@insight/toolkit-react/lib/Button/Button";
import Lozenge from "@insight/toolkit-react/lib/Lozenge/Lozenge";
import Address from "@insight/toolkit-react/lib/Address/Address";
import Icon from "@insight/toolkit-react/lib/Icon/Icon";
import Tooltip from "@insight/toolkit-react/lib/Tooltip/Tooltip";

const AddressItem = ({
  isShipping,
  address,
  soldTo,
  setDefaultAddress,
  deleteAddressHandler,
  editAddressHandler,
}) => {
  const border = address.default ? "c-panel-border__default" : "c-panel-border";
  const isSoldTo = address.partnerFunction == soldTo;
  const isDefault = address.default;
  const tooltipContent = t(
    "This address is your primary & cannot be modified or deleted."
  );

  return (
    <div className="o-grid__item u-1/1 u-1/2@tablet u-1/4@desktop">
      <Panel className={`${border} c-panel-border c-address-tiles u-text-bold`}>
        <Panel.Body>
          {!isSoldTo && (
            <Button
              data-testid={`address-edit-button-${address.partnerFunction}`}
              aria-label={t("edit")}
              className="c-address-tiles__buttons c-address-tiles__edit-button"
              color="secondary-link"
              icon="create"
              iconPosition="top"
              onClick={() =>
                editAddressHandler({
                  shipTo: address.partnerFunction,
                  isShipping,
                })
              }
            />
          )}
          {!isDefault && !isSoldTo && (
            <Button
              data-testid={`address-delete-button-${address.partnerFunction}`}
              aria-label={t("delete")}
              className="c-address-tiles__buttons c-address-tiles__delete-button"
              color="secondary-link"
              icon="trashcan"
              iconPosition="top"
              onClick={() =>
                deleteAddressHandler({
                  shipTo: address.partnerFunction,
                  isShipping,
                })
              }
            />
          )}
          <div className="c-address-tiles__buttons c-address-tiles__default-section">
            {isDefault ? (
              <>
                <Lozenge
                  className="c-address-tiles__default-lozenge"
                  color="info"
                >
                  {t("Default")}
                </Lozenge>
              </>
            ) : (
              <Button
                className="c-address-tiles__default-button"
                color="link"
                iconPosition="left"
                onClick={() =>
                  setDefaultAddress({
                    isShipping,
                    isSoldTo,
                    shipTo: address.partnerFunction,
                  })
                }
              >
                {t("Set as default")}
              </Button>
            )}
          </div>
          {isSoldTo && (
            <div className="c-address-tiles__buttons c-address-tiles__primary-label">
              <span className="c-address-tiles__primary-label__primary-text">
                {t("Primary")}
              </span>
              <Tooltip
                className="c-address-tiles__tooltip"
                content={tooltipContent}
                position="top"
              >
                <Icon icon="help-circle" type="info" />
              </Tooltip>
            </div>
          )}

          <Address
            address={{
              attentionLine: address.attentionLine,
              company: address.partnerCompany,
              address1: address.partnerAaddress1,
              address2: address.partnerAddress2,
              address3: address.partnerAddress3,
              city: address.partnerCity,
              state: address.partnerState,
              zipcode: address.partnerZip,
              country: address.partnerCountry,
              phone: address.partnerPhone,
            }}
          />
        </Panel.Body>
      </Panel>
    </div>
  );
};

export default AddressItem;
