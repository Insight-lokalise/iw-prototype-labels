import React, { useState, useEffect } from "react";
import { connectToLocale } from "@insight/toolkit-react";
import { t } from "@insight/toolkit-utils/lib/labels";
import Message from "@insight/toolkit-react/lib/Message/Message";
import Panel from "@insight/toolkit-react/lib/Panel/Panel";
import Loading from "@insight/toolkit-react/lib/Loading/Loading";
import AddNewPaymentCardForm from "./AddNewPaymentCardForm";
import {
  fetchCheckOutDefaults,
  fetchPersonalInformation,
  fetchAddresses,
} from "../../api";

const AddNewPaymentCard = (props) => {
  const { addToast, context } = props;
  const { isLoginAs, isRequestor, currencyCode, enableCyberSource } = context;
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [billingAddress, setBillingAddress] = useState(null);

  useEffect(() => {
    Promise.all([
      fetchCheckOutDefaults(true),
      fetchPersonalInformation(),
      fetchAddresses({ shipIndicator: false }),
    ])
      .then(([{ defaultBillingAddress }, { accountNumber }, addresses]) => {
        // need to get default billing address for pre-authorization
        // if default billing address does not exist, set soldTo address as the default by using accountNumber(soldTo)
        const defaultSoldTo =
          (defaultBillingAddress && defaultBillingAddress.partnerFunction) ||
          accountNumber;
        if (addresses?.shipResponse?.shipToBillToaddress) {
          const soldToAddress = addresses.shipResponse.shipToBillToaddress.find(
            (address) => defaultSoldTo === address.partnerFunction
          );
          if (soldToAddress) {
            setBillingAddress(soldToAddress);
          } else if (addresses.shipResponse.shipToBillToaddress.length > 0) {
            //if no soldTo address found, use first available billing address on the account
            setBillingAddress(addresses.shipResponse.shipToBillToaddress[0]);
          }
        }
        setIsLoading(false);
      })
      .catch((error) => {
        showError(
          t(
            "An unexpected error occurred. Please contact your Account Executive for more information."
          )
        );
        setIsLoading(false);
      });
  }, []);

  const showError = (message) => {
    setError(t(message));
    window.scrollTo(0, 0);
  };

  return (
    <div className="c-account-center">
      <div className="c-account-header">
        <div className="c-add-new-card o-grid">
          <div className="c-add-new-card-header o-grid__item o-grid__item--shrink">
            <h1 className="u-h3 u-text-bold u-margin-bot-none c-account-header__heading">
              {t("Add card")}
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
              {isLoginAs ? (
                <p>{t('"Login As" users cannot view stored cards')}</p>
              ) : isLoading ? (
                <Loading />
              ) : (
                <AddNewPaymentCardForm
                  addToast={addToast}
                  error={error}
                  showError={showError}
                  isRequestor={isRequestor}
                  enableCyberSource={enableCyberSource}
                  locale={context.locale}
                  salesOrg={context.salesOrg}
                  billingAddress={billingAddress}
                  currencyCode={currencyCode}
                />
              )}
            </Panel.Body>
          </Panel>
        </div>
      </div>
    </div>
  );
};
export default connectToLocale(AddNewPaymentCard);
