import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { connectToLocale } from "@insight/toolkit-react";
import { t } from "@insight/toolkit-utils/lib/labels";
import Loading from "@insight/toolkit-react/lib/Loading/Loading";
import Message from "@insight/toolkit-react/lib/Message/Message";
import Panel from "@insight/toolkit-react/lib/Panel/Panel";
import EditStoredPaymentCardForm from "./EditStoredPaymentCardForm";
import {
  getStoredCards,
  saveStoredCard,
  getAuthTokenizedCard,
  fetchCheckOutDefaults,
  fetchPersonalInformation,
  fetchAddresses,
} from "../../api";

const EditStoredPaymentCard = ({ addToast, context }) => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [authReady, setAuthReady] = useState(true);
  const [card, setCard] = useState(null);
  const { cardId, method } = useParams();
  const [error, setError] = useState(false);
  const { isRequestor, currencyCode, salesOrg, enableCyberSource } = context;
  const [billingAddress, setBillingAddress] = useState(null);

  useEffect(() => {
    Promise.all([
      fetchCheckOutDefaults(true),
      fetchPersonalInformation(),
      fetchAddresses({ shipIndicator: false }),
      getStoredCards(),
    ])
      .then(
        ([
          { defaultBillingAddress },
          { accountNumber },
          addresses,
          storedCards,
        ]) => {
          // need to get default billing address for pre-authorization
          // if default billing address does not exist, set soldTo address as the default by using accountNumber(soldTo)
          const defaultSoldTo =
            (defaultBillingAddress && defaultBillingAddress.partnerFunction) ||
            accountNumber;
          if (addresses?.shipResponse?.shipToBillToaddress) {
            const soldToAddress =
              addresses.shipResponse.shipToBillToaddress.find(
                (address) => defaultSoldTo === address.partnerFunction
              );
            if (soldToAddress) {
              setBillingAddress(soldToAddress);
            } else if (addresses.shipResponse.shipToBillToaddress.length > 0) {
              //if no soldTo address found, use first available billing address on the account
              setBillingAddress(addresses.shipResponse.shipToBillToaddress[0]);
            }
          }

          const { ccStoredCards, procStoredCardses } = storedCards;
          const cards = method === "2" ? ccStoredCards : procStoredCardses;
          const cardData = cards.find(
            ({ storedCardId }) => storedCardId == cardId
          );
          setCard(cardData);
          setIsLoading(false);
        }
      )
      .catch((error) => {
        showError(
          t(
            "An unexpected error occurred. Please contact your Account Executive for more information."
          )
        );
        setIsLoading(false);
      });
  }, []);

  const successHandler = (values) => {
    const { createdOn, storedCardId, storedCardMethodId, storedCardPoNum } =
      card;

    saveStoredCard({
      createdOn,
      lpWebLoginProfileId: 0,
      storedCardDetailsChanged: true,
      storedCardId,
      storedCardMethodId,
      storedCardPoNum,
      storedCardToken: values.cardNumber,
      storedCardDesc: values.cardDesc || "-",
      storedCardType: values.cardType,
      displayCardNum: null,
      storedCardExpMonth: values.cardExpMonth,
      storedCardExpYear: values.cardExpYear,
      storedCardHolderName: values.cardHolderName,
      isDefaultCard: values.isDefaultCard,
    })
      .then(({ data }) => {
        addToast({
          message: t("The card was successfully updated"),
          type: "success",
        });
        history.goBack();
      })
      .catch((e) => {
        addToast({ message: t("The card failed to update"), type: "warning" });
        history.goBack();
      });
  };

  const handleSubmit = (values) => {
    const { storedCardId } = card;
    const enableCardScreening = window.flags && window.flags["GNA-9004-CS"];
    const { cardHolderName, cardType, cardExpMonth, cardExpYear, cvv } = values;

    // Edit card pre-authorization is only required when user is not a requestor and has supported currency.
    // LoginAs user won't have access to this page.
    if (enableCardScreening && !isRequestor && enableCyberSource) {
      setAuthReady(false);
      // perform pre-authorization
      getAuthTokenizedCard({
        cvvRequired: true,
        enable3DS: false,
        messageType: "CSTO",
        address: {
          address1: billingAddress?.partnerAaddress1?.trim(),
          city: billingAddress?.partnerCity?.trim(),
          state: billingAddress?.partnerState?.trim(),
          zipCode: billingAddress?.partnerZip?.trim(),
          countryId: billingAddress?.partnerCountry?.trim(),
        }, // billing address is need for pre-authorization
        card: {
          // this is needed when updating a saved card
          storedCardId, // backend will use id to make to actual token since UI does not have it for stored cards
          storedCardType: cardType,
          storedCardHolderName: cardHolderName,
          storedCardExpMonth: cardExpMonth,
          storedCardExpYear: cardExpYear,
        },
        cvv, // this is needed when updating a saved card
        currencyCode,
        salesOrg,
      })
        .then((data) => {
          // if api returns the card token, that means authorization passed
          if (data && data.token) {
            successHandler(values);
          } else {
            showError(
              "The validation of this card was unsuccessful and could not be saved. Please use a different card or contact your bank/financial institution."
            );
            setAuthReady(true);
          }
        })
        .catch((error) => {
          showError(
            "An unexpected error occurred. Please contact your Account Executive for more information."
          );
          setAuthReady(true);
        });
    } else {
      successHandler(values);
    }
  };

  const showError = (message) => {
    setError(t(message));
    window.scrollTo(0, 0);
  };

  const renderEditForm = () => {
    const {
      storedCardDesc,
      storedCardType,
      displayCardNum,
      storedCardExpMonth,
      storedCardExpYear,
      storedCardHolderName,
      isDefaultCard,
    } = card;

    return (
      <EditStoredPaymentCardForm
        card={{
          cardDesc: storedCardDesc,
          cardType: storedCardType,
          cardNumber: displayCardNum,
          cardExpMonth: storedCardExpMonth,
          cardExpYear: storedCardExpYear,
          cardHolderName: storedCardHolderName,
          isDefaultCard,
          isRequestor,
        }}
        onSubmit={handleSubmit}
        addToast={addToast}
        authReady={authReady}
      />
    );
  };
  return (
    <div className="c-account-center">
      <div className="c-account-header">
        <div className="c-edit-stored-card o-grid">
          <div className="c-add-new-card-header o-grid__item o-grid__item--shrink">
            <h1 className="u-h3 u-text-bold u-margin-bot-none c-account-header__heading">
              {t("Edit card")}
            </h1>
          </div>
          <div className="o-grid__item">
            {error && (
              <Message className="c-account-header__error" type="error">
                {error}
              </Message>
            )}
          </div>
        </div>
      </div>
      <div className="c-account-center-tiles">
        <div className="c-panel-border">
          <Panel>
            <Panel.Body>
              {isLoading ? <Loading /> : renderEditForm()}
            </Panel.Body>
          </Panel>
        </div>
      </div>
    </div>
  );
};
export default connectToLocale(EditStoredPaymentCard);
