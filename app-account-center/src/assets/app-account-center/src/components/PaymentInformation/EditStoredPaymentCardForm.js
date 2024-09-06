import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { t } from "@insight/toolkit-utils/lib/labels";
import Message from "@insight/toolkit-react/lib/Message/Message";
import {
  Button,
  ButtonGroup,
  connectToLocale,
  Field,
  Form,
} from "@insight/toolkit-react";
import { Label } from "@insight/toolkit-react/lib/Form/Components/Decorators";
import { checkExpired } from "./../../lib/helpers";

const EditStoredPaymentCardForm = (props) => {
  const { onSubmit, card, authReady, context } = props;
  const [isDefaultCard, setIsDefaultCard] = useState(false);
  const [selectedCardType, setSelectedCardType] = useState(false);
  const [selectedCardExpMonth, setSelectedCardExpMonth] = useState(false);
  const [selectedCardExpYear, setSelectedCardExpYear] = useState(false);
  const history = useHistory();
  const { isLoginAs, isRequestor, enableCyberSource } = context;

  const cardTypes = [
    {
      text: t("VISA"),
      value: "VISA",
    },
    {
      text: t("AMEX"),
      value: "AMEX",
    },
    {
      text: t("MasterCard"),
      value: "MC",
    },
    {
      text: t("Discover"),
      value: "DISC",
    },
  ];

  const enableCardScreening = window.flags && window.flags["GNA-9004-CS"];
  const enablePreAuth =
    enableCardScreening && !isRequestor && enableCyberSource;

  const validateForm = (values) => {
    const errors = {};

    if (!values.cardHolderName) {
      errors.cardHolderName = t("Please enter the cardholder name.");
    }
    if (checkExpired(values.cardExpMonth, values.cardExpYear)) {
      errors.cardExpMonth = t("Please enter valid expiry date.");
    }

    if (enablePreAuth) {
      if (!values.cvv) {
        errors.cvv = t("Please enter the card security code.");
      }
    }

    return errors;
  };

  const currentYear = new Date().getFullYear();

  return (
    <>
      {isLoginAs ? (
        <p>{t('"Login As" users cannot view stored cards')}</p>
      ) : (
        <div className="c-payment-card-form">
          <Form
            initialValues={{
              ...card,
              cardExpYear:
                currentYear > card.cardExpYear ? currentYear : card.cardExpYear, // if year has expired, set year to current year
            }}
            onSubmit={onSubmit}
            validate={validateForm}
            skipValidateOnMount
            validateOnBlur
            render={({ handleSubmit }) => (
              <form onSubmit={handleSubmit} className="c-form">
                <fieldset className="c-form__group" data-private="true">
                  <div className="o-grid o-grid--gutters-small">
                    <div className="o-grid__item  u-1/1  u-margin-bot">
                      <div className="o-grid o-grid--gutters-small">
                        <div className="o-grid__item u-1/1 u-1/2@tablet">
                          <Field
                            fieldComponent="Text"
                            name="cardDesc"
                            label={t("Description")}
                            type="text"
                            minLength={1}
                            maxLength={40}
                            showErrorIcon
                            data-testid={"card-desc-input"}
                          />
                        </div>
                      </div>
                    </div>
                    {enableCardScreening && (
                      <div className="o-grid__item u-1/1">
                        <Message className="c-paymetric-message" type="info">
                          {t(
                            `Enter cardholder's name exactly as it appears on the card.`
                          )}
                        </Message>
                      </div>
                    )}
                    <Field
                      fieldComponent="Select"
                      fullWidth
                      name="cardType"
                      label={t("Select card")}
                      type="select"
                      options={cardTypes}
                      handleChange={(e) => {
                        setSelectedCardType(e.target.value);
                      }}
                      value={selectedCardType}
                      aria-required="true"
                      showErrorIcon
                      required
                      disabled
                      className="o-grid__item  u-1/1 u-1/2@tablet u-1/4@desktop"
                      data-testid={"card-type-input"}
                    />
                    <Field
                      fieldComponent="Text"
                      name="cardNumber"
                      label={t("Card number")}
                      type="text"
                      aria-required="true"
                      showErrorIcon
                      disabled
                      required
                      className="o-grid__item  u-1/1 u-1/2@tablet  u-1/4@desktop"
                      data-testid={"card-number-input"}
                    />
                    <Field
                      fieldComponent="Text"
                      name="cardHolderName"
                      label={t("Cardholder name")}
                      type="text"
                      aria-required="true"
                      showErrorIcon
                      required
                      className="o-grid__item  u-1/1 u-1/2@tablet  u-1/4@desktop"
                      data-testid={"card-holder-name-input"}
                    />
                    <div className="o-grid__item u-1/1 u-1/2@tablet u-1/1@desktop">
                      <div className="o-grid o-grid--gutters-small">
                        <div className="o-grid__item u-1/1 u-1/2@tablet u-1/4@desktop">
                          <Label required id="expDate">
                            {t("Expiration date")}
                          </Label>
                          <div className="o-grid o-grid--gutters-small">
                            <div className="o-grid__item u-1/1 u-1/2@tablet">
                              <Field
                                fieldComponent="Select"
                                name="cardExpMonth"
                                type="select"
                                fullWidth
                                options={getAllowedMonths()}
                                handleChange={(e) => {
                                  setSelectedCardExpMonth(e.target.value);
                                }}
                                value={selectedCardExpMonth}
                                aria-required="true"
                                showErrorIcon
                                required
                                className="o-grid__item  u-1/1 u-margin-bot"
                                data-testid={"card-exp-month-input"}
                              />
                            </div>
                            <div className="o-grid__item u-1/1 u-1/2@tablet">
                              <Field
                                fieldComponent="Select"
                                fullWidth
                                name="cardExpYear"
                                type="select"
                                options={getAllowedYears()}
                                handleChange={(e) => {
                                  setSelectedCardExpYear(e.target.value);
                                }}
                                value={selectedCardExpYear}
                                aria-required="true"
                                showErrorIcon
                                required
                                className="o-grid__item  u-1/1 u-margin-bot"
                                data-testid={"card-exp-year-input"}
                              />
                            </div>
                          </div>
                        </div>
                        {enablePreAuth && (
                          <div className="o-grid__item u-1/1 u-1/2@tablet u-1/4@desktop">
                            <Field
                              fieldComponent="Text"
                              name="cvv"
                              label={t("CVV")}
                              type="text"
                              aria-required="true"
                              showErrorIcon
                              required
                              maxLength={4}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <Field
                      checked={isDefaultCard}
                      checkboxLabel={t("Set as default")}
                      fieldComponent={"Checkbox"}
                      className="o-grid__item  u-1/1  u-1/2@desktop"
                      handleChange={() => {
                        setIsDefaultCard(!isDefaultCard);
                      }}
                      name="isDefaultCard"
                    />
                  </div>
                </fieldset>
                <ButtonGroup align="right">
                  <Button
                    color="link"
                    isDisabled={!authReady}
                    onClick={history.goBack}
                  >
                    {t("Cancel")}
                  </Button>
                  <Button
                    color="primary"
                    isDisabled={!authReady}
                    onClick={handleSubmit}
                  >
                    {t("Update")}
                  </Button>
                </ButtonGroup>
              </form>
            )}
          />
        </div>
      )}
    </>
  );
};
export default connectToLocale(EditStoredPaymentCardForm);

const getAllowedMonths = () => {
  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  return months.reduce((acc, item) => {
    const month = [
      { value: Number(item), text: item < 10 ? `0${item}` : item },
    ];
    return acc.concat(month);
  }, []);
};

export const getAllowedYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear; i <= currentYear + 10; i++) {
    years.push({ value: Number(i), text: i });
  }
  return years;
};
