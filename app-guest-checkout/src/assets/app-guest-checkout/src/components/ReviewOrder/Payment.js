import React from 'react';
import { useSelector } from 'react-redux'
import { t } from '@insight/toolkit-utils/lib/labels'
import Loading from '@insight/toolkit-react/lib/Loading/Loading'
import AddNewCard from './AddNewCard';
import { connectToLocale } from "@insight/toolkit-react/lib/Locale/Locale";
import { selector_userInfo, selector_cart, selector_address } from "../../state/slices/selectors/ShoppingReqeustSelector";

import { GUEST_PAYMENT_METHODS } from "../../constants";
import { Field } from "@insight/toolkit-react/lib/Form/Field/Field";
import { PaymentPOForm } from './PaymentPOForm'

const ADDRESS_TYPE = {
  SHIPPING_ADDRESS: 'shipping',
  BILLING_ADDRESS: 'billing',
}

const Payment = (props) => {

  const {
    context,
    payMetricCallback,
    paymentInsightFormRef,
    saveAdditionalPaymentFields,
    paymentState,
    onPaymentMethodChange,
    onPendingChange,
  } = props
  const {
    locale,
    currencyCode,
  } = context
  const cart = useSelector(selector_cart)
  const userContact = useSelector(selector_userInfo)
  const shipping = useSelector((state) =>
    selector_address(state, ADDRESS_TYPE.SHIPPING_ADDRESS)
  )
  const billing = useSelector((state) =>
    selector_address(state, ADDRESS_TYPE.BILLING_ADDRESS)
  )
  const { address: shippingAddress, phone: shippingPhone } = shipping
  const { address: billingAddress, phone: billingPhone } = billing
  const { summary: { totalCost } } = cart

  const normalizedPaymentMethods =
    GUEST_PAYMENT_METHODS &&
    GUEST_PAYMENT_METHODS.map(({ paymentMethodId }) => ({
      text:
        (paymentMethodId === 1 && t('Terms')) ||
        (paymentMethodId === 2 && t('Credit card')) ||
        t('Procurement card'),
      value: paymentMethodId,
    }))

  if (paymentState.loading) {
    return <div className="u-text-center">
      <Loading size="large" />
    </div>;
  }

  if (paymentState.error) {
    return <div>{`${t('Error')}: ${paymentState.error.message}`}</div>;
  }

  return (
    <div>
      <div className="o-grid o-grid--bottom">
        <div className="o-grid__item o-grid__item--shrink c-card-select">
          <Field
            fieldComponent="Select"
            name="updatePayment"
            label={t("Payment method")}
            type="select"
            aria-required="true"
            onChange={(e) => onPaymentMethodChange(e.target.value)}
            options={normalizedPaymentMethods}
            value={paymentState.paymentMethod}
          />
        </div>
      </div>
      <AddNewCard
        paymentMethod={paymentState.paymentMethod}
        webReferenceNumber={paymentState.webReferenceNumber}
        isoCodes={paymentState.isoCodes}
        locale={locale}
        currencyCode={currencyCode}
        totalCost={totalCost}
        userContact={userContact}
        billing={{ ...billingAddress, phone: billingPhone }}
        shipping={{ ...shippingAddress, phone: shippingPhone }}
        payMetricCallback={payMetricCallback}
      />
      <PaymentPOForm submitButtonRef={paymentInsightFormRef} paymentMethod={paymentState.paymentMethod} hasPOFields={true} onSubmit={saveAdditionalPaymentFields} />
    </div>
  );
};


export default connectToLocale(Payment);
