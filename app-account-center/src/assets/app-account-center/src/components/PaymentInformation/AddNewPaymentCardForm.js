import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { t } from "@insight/toolkit-utils/lib/labels";
import Panel from "@insight/toolkit-react/lib/Panel/Panel";
import { RadioGroup } from "@insight/toolkit-react/lib/Form/Components/Elements";
import { Button, ButtonGroup, Field, Form } from "@insight/toolkit-react";
import Message from "@insight/toolkit-react/lib/Message/Message";
import { PaymetricInit } from "@insight/toolkit-react/lib/Paymetric/PaymetricInit";
import { Paymetric3dsHostedIframe } from "@insight/toolkit-react/lib/Paymetric/Paymetric3dsHostedIframe";
import { paymetricSubmitIframe } from "@insight/toolkit-react/lib/Paymetric/paymetricHelpers";
import PaymetricsHostedIframe from "./PaymetricsHostedIframe";
import {
  getTokenizedCard,
  createStoredCard,
  getAuthTokenizedCard,
  fetchPayMetricsFrame,
  fetchPayMetrics3DSFrame,
} from "../../api";

const AddNewPaymentCardForm = (props) => {
  const {
    addToast,
    error,
    showError,
    isRequestor,
    enableCyberSource,
    locale,
    billingAddress,
    currencyCode,
    salesOrg,
  } = props;
  const { origin } = document.location;
  const [isPaymetricReady, setIsPaymetricReady] = useState(false);
  const [iframeSuccess, setIframeSuccess] = useState(false);
  const [iframeURL, setIframeURL] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isDefaultCard, setIsDefaultCard] = useState(false);
  const [refreshToken, setRefreshToken] = useState(0);
  const history = useHistory();
  const paymentMethodOptions = [
    {
      id: "creditCard",
      label: t("Credit card"),
      value: 2,
      className: "c-ac-pay-method-radio",
      "data-testid": "creditCard",
    },
    {
      id: "procurementCard",
      label: t("Procurement card"),
      value: 3,
      className: "c-ac-pay-method-radio",
      "data-testid": "procurementCard",
    },
  ];
  const enableCardScreening = window.flags && window.flags["GNA-9004-CS"];
  const iFrameId = "paymetric-iframe";
  const location = useLocation();
  const unexpectedErrorMessage =
    "An unexpected error occurred. Please contact your Account Executive for more information.";

  const saveCard = (values) => {
    const successHandler = (data) => {
      createStoredCard({
        CardExpMonth: data.expiryMonth,
        CardExpYear: data.expiryYear,
        CardHolderName: data.cardHolderName,
        CardToken: data.token,
        CardType: data.type,
        displayCardNum: data.maskedCardNumber,
        ...values,
      }).then(({ data: { exceptionExists, exceptionsList } }) => {
        const managePaymentsRoute = "/userProfile/payments/manage";
        let redirect = true;

        if (!exceptionExists) {
          addToast({
            message: t("Card created successfully"),
            type: "success",
          });
          history.push(managePaymentsRoute);
          return;
        }

        exceptionsList.map((exception) => {
          if (exception === "DUPLICATE_CARD") {
            redirect = false;
            showError("This card already exists.");
            setRefreshToken(values.refreshToken + 1);
          } else {
            // using toast notifications for all other errors
            return addToast({ message: t(exception), type: "danger" });
          }
        });

        redirect && history.push(managePaymentsRoute);
      });
    };

    const onError = (msg) => {
      console.log("Error storing card", msg);
      setRefreshToken(values.refreshToken + 1);
    };

    const onInvalid = () => {
      setIsPaymetricReady(true);
    };

    if (enableCardScreening) {
      setIsPaymetricReady(false);
      //Toolkit paymetric iframe submit
      paymetricSubmitIframe({
        iFrameId,
        iFrameUrl: values.iframeURL,
        onSuccess: () => {
          // perform pre-authorization
          getAuthTokenizedCard({
            accessToken: values.accessToken,
            salesOrg,
            currencyCode,
            // billing address is need for pre-authorization
            address: {
              address1: billingAddress?.partnerAaddress1?.trim(),
              city: billingAddress?.partnerCity?.trim(),
              state: billingAddress?.partnerState?.trim(),
              zipCode: billingAddress?.partnerZip?.trim(),
              countryId: billingAddress?.partnerCountry?.trim(),
            },
            // new card pre-authorization is only required when user is not a requestor and user has supported currency.
            // LoginAs user won't have access to this page.
            cvvRequired: !isRequestor && enableCyberSource,
            enable3DS: false,
            messageType: "CSTO",
          })
            .then((data) => {
              //if api returns the card token, that means authorization passed
              if (data && data.token) {
                successHandler(data);
              } else {
                showError(
                  "The validation of this card was unsuccessful and could not be saved. Please use a different card or contact your bank/financial institution."
                );
                setRefreshToken(values.refreshToken + 1);
              }
            })
            .catch((error) => {
              showError(unexpectedErrorMessage);
              setRefreshToken(values.refreshToken + 1);
            });
        },
        onError,
        onInvalid,
      });
    } else {
      //old paymetric iframe submit
      $XIFrame.submit({
        iFrameId,
        targetUrl: values.iframeURL,
        onSuccess() {
          getTokenizedCard(values.accessToken).then((data) => {
            successHandler(data);
          });
        },
        onError(msg) {
          onError(msg);
        },
      });
    }
  };

  const renderAuthPaymetricIframe = () => {
    //use Toolkit paymetrics component for card screening
    const iframeConfig = {
      iFrameId,
      api: fetchPayMetrics3DSFrame,
      payload: {
        hostUri: origin,
        cssUri: `${origin}/insightweb/assets/en_US/www/css/paymetric-account-center.css`,
        locale,
        cvvRequired: !isRequestor && enableCyberSource,
        enable3DS: false,
      },
      onInit: () => {
        setIsPaymetricReady(false);
      },
      onRender: (data) => {
        setAccessToken(data.accessToken);
        setIframeURL(data.iFrameUrl);
        setTimeout(() => {
          setIsPaymetricReady(true);
        }, 1000);
      },
      refreshDependencies: [refreshToken],
      onCatch: (error, status) => {
        showError(unexpectedErrorMessage);
        if (status === 401) {
          window.location.href = "/login";
        }
      },
    };

    return (
      <>
        <Message className="c-paymetric-message" type="info">
          {t(`Enter cardholder's name exactly as it appears on the card.`)}
        </Message>
        <Paymetric3dsHostedIframe iframeConfig={iframeConfig} />
      </>
    );
  };

  if (!enableCardScreening) {
    //old paymetric iframe
    useEffect(() => {
      const pmRequest = {
        hostUri: origin,
        cssUri: `${origin}/insightweb/assets/en_US/www/css/paymetric-account-center.css`,
      };

      fetchPayMetricsFrame(pmRequest)
        .then(({ data }) => {
          if (data.iFrameUrl) {
            setIframeSuccess(true);
            setIframeURL(data.iFrameUrl);
            setAccessToken(data.accessToken);
            setTimeout(() => {
              setIsPaymetricReady(true);
            }, 1000);
          } else {
            showError(data.errorResponse?.message); // Set error if the call returns error response
          }
        })
        .catch((e, status) => {
          console.log(e);
          showError(unexpectedErrorMessage);
          if (status === 401) {
            window.location.href = "/login";
          }
        });
    }, [refreshToken]);
  }

  return (
    <>
      <PaymetricInit />
      <div className="c-payment-card-form">
        <Form
          initialValues={{
            accessToken,
            error,
            iframeURL,
            paymentMethodType: 2,
            refreshToken,
          }}
          onSubmit={saveCard}
          skipValidateOnMount
          validateOnBlur
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit} className="c-form">
              <fieldset className="c-form__group" data-private="true">
                <div className="o-grid o-grid--gutters-small">
                  <Field name="paymentMethodType">
                    {({ fieldProps }) => (
                      <div className="o-grid__item  u-1/1 u-margin-bot">
                        <div className="c-form__control">
                          <div className="c-form__radio o-grid">
                            <RadioGroup
                              {...fieldProps}
                              options={paymentMethodOptions}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </Field>
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
                  <div className="o-grid__item  u-1/1  u-margin-bot">
                    {enableCardScreening && renderAuthPaymetricIframe()}
                    {!enableCardScreening && iframeSuccess && (
                      <PaymetricsHostedIframe
                        id={iFrameId}
                        iframeURL={iframeURL}
                      />
                    )}
                  </div>
                  <Field
                    checked={isDefaultCard}
                    checkboxLabel={t("Set as default")}
                    fieldComponent={"Checkbox"}
                    className="o-grid__item  u-1/1  u-1/2@desktop  u-margin-bot"
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
                  onClick={() =>
                    history.push(
                      location.state && location.state.fromPayments
                        ? "/userProfile/payments/manage"
                        : "/userProfile/"
                    )
                  }
                  isDisabled={!isPaymetricReady}
                >
                  {t("Cancel")}
                </Button>
                <Button
                  color="primary"
                  onClick={handleSubmit}
                  isDisabled={!isPaymetricReady}
                >
                  {t("Create new")}
                </Button>
              </ButtonGroup>
            </form>
          )}
        />
      </div>
    </>
  );
};

export default AddNewPaymentCardForm;
