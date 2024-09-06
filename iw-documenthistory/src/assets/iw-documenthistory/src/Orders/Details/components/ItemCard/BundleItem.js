import React from "react";
import PropTypes from "prop-types";
import { connectToLocale } from "@insight/toolkit-react";
import Currency from "@insight/toolkit-react/lib/Currency/Currency";
import { t } from "@insight/toolkit-utils/lib/labels";
import IWItemDetails from "./../../../../Shared/components/OrderCard/IWItemDetails";
import BundleHeader from "./BundleHeader";
import LineItemInformation from "./LineItemInformation";
import DEPItemInformation from "./DEPItemInformation";
import StockStatus from "../../../../Shared/components/AddToCart/StockStatus";
import { hasLineLevelInformation, filterSmartTrackers } from "./helpers/items";

export function BundleItem({
  bundle,
  context,
  currencyCode,
  hasInvoicingEnabled,
  isLoggedIn,
  orderNumber,
  getDEPInfo,
  isCES,
}) {
  // render only parent items
  const parentItems = bundle.data.filter((item) => !item.enrollment);

  return (
    <div>
      <BundleHeader
        bundleItem={bundle}
        currencyCode={currencyCode}
        isLoggedIn={isLoggedIn}
        getDEPInfo={getDEPInfo}
      />
      {parentItems.map((item) => {
        const {
          availableStock,
          cartItemMetaData,
          contractTextLineItem,
          ewrFee,
          id,
          imageURL,
          lineItemInvoiceInfo,
          materialInfo: {
            description,
            manufacturerName,
            manufacturerPartNumber,
            materialId,
            nonShipabble,
            unitPrice,
          },
          quantity,
          shippingStatus,
          taaCompliant,
          totalPrice,
          sapLineItemNumber,
        } = item;
        const { contractReportingField, countryOfUsage, smartTracker } =
          cartItemMetaData;
        const itemDetails = {
          description,
          hasInvoicingEnabled,
          imageURL,
          lineItemInvoiceInfo,
          manufacturerName,
          materialId,
          mfrPartNumber: manufacturerPartNumber,
          orderNumber,
          taaCompliant,
        };
        const depInfo = getDEPInfo(sapLineItemNumber);
        return (
          <div className="item-body item-body--bundle" key={id}>
            <div className="row collapse expanded">
              <div className="columns small-12 large-4 print-6">
                <IWItemDetails
                  isLoggedIn={isLoggedIn}
                  item={itemDetails}
                  isCES={isCES}
                />
                <span className="item-card__status">
                  {t(shippingStatus)}
                  {nonShipabble ? ` ${t("(non-shippable)")}` : ""}
                </span>
              </div>
              <div className="columns small-12 large-2">
                <div className="row align-middle collapse item-body__row">
                  <div className="columns small-6 large-12">
                    <span className="item-body__label">
                      {t("Qty per bundle")}
                    </span>
                  </div>
                  <div className="columns small-6 large-12">
                    <span className="item-body__value">{quantity}</span>
                  </div>
                </div>
              </div>
              <div className="columns small-12 large-2">
                <div className="row align-middle collapse item-body__row">
                  <div className="columns small-6 large-12">
                    <span className="item-body__label">{t("Unit price")}</span>
                  </div>
                  <div className="columns small-6 large-12">
                    <Currency
                      className="item-body__value"
                      value={unitPrice}
                      currencyCode={currencyCode}
                    />
                  </div>
                </div>
                {!!ewrFee && (
                  <div className="row align-middle collapse item-body__row item-body__row--ewr">
                    <div className="columns small-6 large-shrink">
                      <span className="item-body__label item-body__label--ewr">{`${t(
                        "EWR fee"
                      )}: `}</span>
                    </div>
                    <div className="columns small-6 large-shrink">
                      <Currency
                        className="item-body__value"
                        value={ewrFee}
                        currencyCode={currencyCode}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="columns small-12 large-1 print-2">
                <div className="row align-middle collapse item-body__row">
                  <div className="columns small-6 large-12">
                    <span className="item-body__label">{t("Total price")}</span>
                  </div>
                  <div className="columns small-6 large-12">
                    <Currency
                      className="item-body__value"
                      value={totalPrice}
                      currencyCode={currencyCode}
                    />
                  </div>
                </div>
              </div>
              <div className="columns small-12 large-3 large-text-center hide-for-print">
                {!context.isCES && !nonShipabble && (
                  <StockStatus stock={availableStock} />
                )}
              </div>
            </div>
            {depInfo && depInfo.materialInfo && depInfo.enrollment && (
              <DEPItemInformation
                materialId={depInfo.materialInfo.materialId}
                customerId={depInfo.enrollment.number}
                isLoggedIn={isLoggedIn}
              />
            )}
            {hasLineLevelInformation(
              cartItemMetaData,
              contractTextLineItem
            ) && (
              <LineItemInformation
                contractReportingField={contractReportingField}
                contractTextLineItem={contractTextLineItem}
                countryOfUsage={countryOfUsage}
                smartTrackers={filterSmartTrackers(smartTracker)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

BundleItem.propTypes = {
  bundle: PropTypes.shape({
    type: PropTypes.string,
    data: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  currencyCode: PropTypes.string.isRequired,
  hasInvoicingEnabled: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  orderNumber: PropTypes.number.isRequired,
  getDEPInfo: PropTypes.func.isRequired,
  isCES: PropTypes.bool.isRequired,
};

export default connectToLocale(BundleItem);
