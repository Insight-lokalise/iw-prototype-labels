import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";

import Currency from "@insight/toolkit-react/lib/Currency/Currency";
import { t } from "@insight/toolkit-utils/lib/labels";
import SummaryRow from "./SummaryRow";
import EWRFee from "./EWRFee";
import IWHelpIcon from "./../IWTooltip/IWHelpIcon";

export const IWSummary = ({
  carrierDescription,
  children,
  className,
  currency,
  ewrFee,
  gstHstTaxCost,
  isCanada,
  pstTaxCost,
  shippingCost,
  isXD,
  showBlankTax,
  showCarrierDescription,
  showEWR,
  showShippingHelpText,
  showTax,
  subTotal,
  taxCost,
  usedThirdPartyCarrier,
  isEMEA,
}) => {
  const shippingText = usedThirdPartyCarrier
    ? t("Charge Account")
    : t("Estimated shipping");
  const showPstTax = showTax && pstTaxCost > 0;
  const showGstHstTax = showTax && gstHstTaxCost > 0;

  // only show one type of tax, and default to regular tax.
  const shouldShowTax = showTax && !isCanada;

  // we calculate the total based on the showX props so that consumerse do not
  // need to wrap duplicate their showX logic on the cost props.
  const sumTotal =
    subTotal +
    (isXD ? 0 : shippingCost) +
    (shouldShowTax ? (showBlankTax ? 0 : taxCost) : 0) +
    (showEWR ? ewrFee : 0) +
    (showPstTax ? pstTaxCost : 0) +
    (showGstHstTax ? gstHstTaxCost : 0);

  const taxLabel = isEMEA ? (
    <>
      {t("VAT")}&nbsp;
      <span className="hide-for-print">
        <IWHelpIcon
          tooltip={t(
            "Goods and services are invoiced at the price prevailing at time of acceptance of order. VAT is charged at the rate applicable at the time of invoicing or otherwise in accordance with the law."
          )}
        />
      </span>
    </>
  ) : (
    t("Estimated tax")
  );

  return (
    <div className={cn(className)}>
      <div className="iw-summary">
        <div className="row iw-summary__header align-middle is-collapse-child">
          <h3 className="columns iw-summary__title">{t("Summary")}</h3>
        </div>
        <div className="iw-summary__totals">
          <SummaryRow
            className="iw-summary__row iw-summary__row--subtotal"
            title={t("Subtotal")}
            priceElement={<Currency value={subTotal} currencyCode={currency} />}
          />
          <SummaryRow
            className="iw-summary__row iw-summary__row--shipping"
            title={
              <span>
                {showShippingHelpText && (
                  <span className="hide-for-print">*</span>
                )}
                {shippingText}
                {showCarrierDescription && carrierDescription && (
                  <span>
                    <p className="no-margin-bot">({carrierDescription})</p>
                  </span>
                )}
              </span>
            }
            priceElement={
              isXD ? (
                <span>--</span>
              ) : (
                <Currency value={shippingCost} currencyCode={currency} />
              )
            }
          />
          {showEWR && ewrFee > 0 && (
            <EWRFee currency={currency} ewrFee={ewrFee} isCanada={isCanada} />
          )}
          {shouldShowTax && (
            <SummaryRow
              className="iw-summary__row iw-summary__row--tax"
              title={taxLabel}
              priceElement={
                showBlankTax ? (
                  <span data-testid="empty-tax">--</span>
                ) : (
                  <Currency value={taxCost} currencyCode={currency} />
                )
              }
            />
          )}
          {showPstTax && isCanada &&(
            <SummaryRow
              className="iw-summary__row iw-summary__row--tax"
              title={t("PST / QST est.")}
              priceElement={
                showBlankTax ? (
                  <span data-testid="empty-psttax">--</span>
                ) : (
                  <Currency value={pstTaxCost} currencyCode={currency} />
                )
              }
            />
          )}
          {showTax && isCanada && (
            <SummaryRow
              className="iw-summary__row iw-summary__row--tax"
              title={t("GST / HST est.")}
              priceElement={
                showBlankTax ? (
                  <span data-testid="empty-gsttax">--</span>
                ) : (
                  <Currency value={gstHstTaxCost} currencyCode={currency} />
                )
              }
            />
          )}
          <div className="row is-collapse-child">
            <div className="columns u-padding-none">
              <hr className="iw-summary__hline" />
            </div>
          </div>
          <SummaryRow
            className={"iw-summary__row iw-summary__row--total"}
            title={t("Total")}
            priceElement={<Currency value={sumTotal} currencyCode={currency} />}
          />
        </div>
        {!!children && children}
        {showShippingHelpText && (
          <div className="row is-collapse-child hide-for-print">
            <div className="columns">
              <p className="iw-summary__footnote">
                {t(
                  "*Shipping rates are calculated based on your default information. Other shipping rate options can be viewed and selected on the next page."
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

IWSummary.propTypes = {
  carrierDescription: PropTypes.string,
  className: PropTypes.string,
  currency: PropTypes.string.isRequired,
  ewrFee: PropTypes.number,
  gstHstTaxCost: PropTypes.number,
  isCanada: PropTypes.bool,
  pstTaxCost: PropTypes.number,
  shippingCost: PropTypes.number.isRequired,
  isXD: PropTypes.bool,
  showBlankTax: PropTypes.bool,
  showCarrierDescription: PropTypes.bool,
  showEWR: PropTypes.bool,
  showShippingHelpText: PropTypes.bool,
  showTax: PropTypes.bool,
  subTotal: PropTypes.number.isRequired,
  taxCost: PropTypes.number,
  usedThirdPartyCarrier: PropTypes.bool,
  isEMEA: PropTypes.bool,
};

IWSummary.defaultProps = {
  carrierDescription: null,
  className: null,
  ewrFee: null,
  gstHstTaxCost: null,
  isCanada: null,
  pstTaxCost: null,
  isXD: null,
  showBlankTax: null,
  showCarrierDescription: null,
  showEWR: null,
  showShippingHelpText: null,
  showTax: null,
  taxCost: null,
  usedThirdPartyCarrier: null,
  isEMEA: null,
};

export default IWSummary;
