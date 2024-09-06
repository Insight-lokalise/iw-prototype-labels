import React, { useEffect, useState } from "react";
import { Button, ButtonGroup, Field, Loading } from "@insight/toolkit-react";
import { useHistory } from "react-router-dom";
import { t } from "@insight/toolkit-utils/lib/labels";
import { fetchCheckOutDefaults, updateDefaultPaymentMethod } from "../../api/";
import { isValidObjectList } from "../../lib/helpers";
const PaymentsHeader = ({ addToast }) => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [availableOptions,setAvailableOptions ] = useState([])
  const paymentOptions = [
    {
      text: t("Select payment method"),
      value: "",
    },
    {
      text: t("Credit card"),
      value: "2",
    },
    {
      text: t("Procurement card"),
      value: "3",
    },
    {
      text: t("Terms"),
      value: "1",
    },
  ];

  useEffect(() => {
    fetchCheckOutDefaults().then((data) => {
      const { defaultPaymentMethod, allowedPaymentMethods } = data;
      if (defaultPaymentMethod === null) {
        setPaymentMethod("");
      } else {
        setPaymentMethod(defaultPaymentMethod);
      }
      setIsLoading(false);
      if(allowedPaymentMethods===null){
        setAvailableOptions(paymentOptions)
      }
      if(isValidObjectList(allowedPaymentMethods)){
        setAvailableOptions(()=>paymentOptions.filter(item => item.value==="" || allowedPaymentMethods.find(allowedOption=>allowedOption.id==item.value)))
      }
    });
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    updateDefaultPaymentMethod(Number(paymentMethod))
      .then(({ data }) => {
        if (data.messageStatus === "ERROR") {
          addToast({
            message: t("Failed to update default payment method"),
            type: "warning",
          });
          setIsLoading(false);
        } else {
          addToast({
            message: t("Default payment method successfully updated"),
            type: "success",
          });
          setIsLoading(false);
        }
      })
      .catch(() => {
        addToast({
          message: t("Failed to update default payment method"),
          type: "warning",
        });
        setIsLoading(false);
      });
  };

  const goToCreate = () => {
    history.push({
      pathname: "/userProfile/payments/addNew",
      state: { fromPayments: true },
    });
  };
  return (
    <div className="o-grid o-grid--bottom">
      <div className="o-grid__item u-1/1">
        <h1 className="u-h3 u-text-bold u-margin-bot-none c-account-header__heading">
          {t("Payment methods")}
        </h1>
      </div>
      <div className="o-grid__item u-1/1 u-margin-bot">
        {isLoading ? (
          <Loading />
        ) : (
          <form onSubmit={onSubmit} className="c-form--small">
            <fieldset className="c-form__group">
              <div className="o-grid o-grid--bottom">
                <div className="o-grid__item o-grid__item--shrink">
                  <Field
                    fieldComponent="Select"
                    name="updatePayment"
                    label={t("Default payment method")}
                    type="select"
                    aria-required="true"
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    options={availableOptions}
                    value={paymentMethod}
                  />
                </div>
                <div className="o-grid__item u-pull-1/2@desktop">
                  <Button
                    aria-label={t("update")}
                    className="c-address-header__search-button"
                    color="link"
                    type="submit"
                  >
                    {t("Update")}
                  </Button>
                </div>
              </div>
            </fieldset>
          </form>
        )}
      </div>
      <div className="o-grid__item">
        <ButtonGroup align="right">
          <Button
            className="c-address-tiles__edit"
            color="link"
            icon="add"
            iconPosition="left"
            onClick={goToCreate}
          >
            {t("Add new card")}{" "}
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
};

export default PaymentsHeader;
