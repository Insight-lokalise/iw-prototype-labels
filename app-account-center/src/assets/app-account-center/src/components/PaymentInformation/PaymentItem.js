import React from "react";
import { t } from "@insight/toolkit-utils/lib/labels";
import { Panel, Button, Lozenge } from "@insight/toolkit-react";
import { useHistory } from "react-router-dom";
import PaymentCardView from "./PaymentCardView";
import { checkExpired } from "./../../lib/helpers";

const PaymentItem = ({
  card,
  deletePaymentHandler,
  setDefaultCard,
  method,
}) => {
  const history = useHistory();

  const { isDefaultCard, storedCardId, storedCardExpMonth, storedCardExpYear } =
    card;
  const isExpired = checkExpired(storedCardExpMonth, storedCardExpYear);
  const border = isDefaultCard ? "c-panel-border__default" : "c-panel-border";

  const goToEdit = () => {
    history.push(`/userProfile/payments/edit/${method}/${storedCardId}`);
  };

  return (
    <div className="o-grid__item u-1/1 u-1/2@tablet u-1/3@desktop-large">
      <Panel className={`${border} c-address-tiles u-text-bold`}>
        <Panel.Body>
          <Button
            aria-label={t("edit")}
            data-testid={`card-edit-button-${storedCardId}`}
            className="c-address-tiles__buttons c-address-tiles__edit-button"
            color="secondary-link"
            icon="create"
            iconPosition="top"
            onClick={goToEdit}
          />
          <Button
            aria-label={t("delete")}
            data-testid={`card-delete-button-${storedCardId}`}
            className="c-address-tiles__buttons c-address-tiles__delete-button"
            color="secondary-link"
            icon="trashcan"
            iconPosition="top"
            onClick={() => deletePaymentHandler(storedCardId)}
          />
          <div className="c-address-tiles__buttons c-address-tiles__default-section">
            {isDefaultCard ? (
              <Lozenge
                className="c-address-tiles__default-lozenge"
                color="info"
              >
                {t("Default")}
              </Lozenge>
            ) : (
              <Button
                className="c-address-tiles__default-button"
                isDisabled={isExpired}
                color={isExpired ? "secondary-link" : "link"}
                iconPosition="left"
                onClick={() => setDefaultCard(storedCardId)}
              >
                {t("Set as default")}
              </Button>
            )}
          </div>

          <PaymentCardView
            card={{
              cardNum: card.displayCardNum,
              cardDesc: card.storedCardDesc,
              cardExpMonth: card.storedCardExpMonth,
              cardExpYear: card.storedCardExpYear,
              cardHolderName: card.storedCardHolderName,
              cardId: card.storedCardId,
              cardToken: card.storedCardToken,
              cardType: card.storedCardType,
            }}
          />
        </Panel.Body>
      </Panel>
    </div>
  );
};

export default PaymentItem;
