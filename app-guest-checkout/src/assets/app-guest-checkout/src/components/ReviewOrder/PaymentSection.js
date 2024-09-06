import React from 'react';
import { t } from '@insight/toolkit-utils/lib/labels'
import ReviewSection from "./ReviewSection";
import { getEnvironmentName } from '@insight/toolkit-utils/lib/helpers/getEnvironmentName'
import Payment from "./Payment";

const PaymentSection = ({
                          payMetricCallback,
                          payMetricRef,
                          paymentInsightFormRef,
                          saveAdditionalPaymentFields,
                          paymentState,
                          onPaymentMethodChange,
                          onPendingChange,
                        }) => {
  const LOCALHOST = 'localhost'
  const isLocalhost = window.location.origin.includes(LOCALHOST)
  const environment = isLocalhost
    ? LOCALHOST
    : getEnvironmentName(window.location.origin)
  const testEnvironmentMessage = t(
    '**This is a test environment. This is not a live transaction**'
  )
  return (
    <div>
      <ReviewSection title={t('Payment method')} >
        {environment !== 'prod' && environment !== 'pre' && (
          <div className="o-grid c-section__test_environment">
            <span className="columns shrink">{testEnvironmentMessage}</span>
          </div>
        )}
        <Payment
          payMetricCallback={payMetricCallback}
          payMetricRef={payMetricRef}
          paymentState={paymentState}
          paymentInsightFormRef={paymentInsightFormRef}
          saveAdditionalPaymentFields={saveAdditionalPaymentFields}
          onPaymentMethodChange={onPaymentMethodChange}
          onPendingChange={onPendingChange}
        />
      </ReviewSection>
    </div>
  );
};

export default PaymentSection;
