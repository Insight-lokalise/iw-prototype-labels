import React from "react";
import PropTypes from "prop-types";
import Currency from "@insight/toolkit-react/lib/Currency/Currency";
import cn from "classnames";
import { t } from "@insight/toolkit-utils/lib/labels";

import AddToCart from "./../../../../Shared/components/AddToCart/AddToCart";
import IWItemDetails from "./../../../../Shared/components/OrderCard/IWItemDetails";
import LineItemInformation from "./LineItemInformation";
import DEPItemInformation from "./DEPItemInformation";
import { hasLineLevelInformation, filterSmartTrackers } from "./helpers/items";

/**
 * Represent single items which are not part of a bundle.
 * Includes the item image,
 * description, qty. shipped, price columns, and the ability to 'Add to Cart'
 */
export default function ItemBody({
  currencyCode,
  hasInvoicingEnabled,
  item,
  isContract,
  isLoggedIn,
  orderNumber,
  getDEPInfo,
  isCES,
}) {
  const {
    availableStock,
    contractId,
    contractTextLineItem,
    ewrFee,
    imageURL,
    isContractActive,
    lineItemInvoiceInfo,
    programId,
    qtyShipped,
    quantity,
    serialNumberAssetTagList,
    shippingStatus,
    totalPrice,
    addToCart,
    cartItemMetaData,
    materialInfo: {
      description,
      manufacturerName,
      manufacturerPartNumber,
      materialId,
      nonShipabble,
      taaCompliant,
      unitPrice,
    },
    sapLineItemNumber,
  } = item.data;
  const { contractReportingField, countryOfUsage, smartTracker } =
    cartItemMetaData;
  const itemDetails = {
    serialNumberAssetTagList,
    description,
    hasInvoicingEnabled,
    imageURL,
    lineItemInvoiceInfo,
    manufacturerName,
    materialId,
    orderNumber,
    taaCompliant,
    mfrPartNumber: manufacturerPartNumber,
  };
  const shouldShowCountryOfUsage =
    countryOfUsage && nonShipabble && !isContract;
  const addToCartItem = {
    ...item,
    contractId,
    description,
    isContractActive,
    materialId,
    programId,
    sapLineItemNumber,
  };
  const depInfo = getDEPInfo(sapLineItemNumber);
  const ewrTotal = ewrFee;
  const ewrUnit = ewrTotal / quantity;
  return (
    <div className={cn("item-body", { "item-body--contract": isContract })}>
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
                {nonShipabble ? t("Qty") : t("Qty shipped")}
              </span>
            </div>
            <div className="columns small-6 large-12">
              <span className="item-body__value">
                {nonShipabble
                  ? `${quantity}`
                  : `${qtyShipped} ${t("of")} ${quantity}`}
              </span>
            </div>
          </div>
          {shouldShowCountryOfUsage && (
            <div className="row align-middle collapse item-body__row">
              <div className="columns small-6 large-shrink">
                <span className="item-body__label item-body__label--custom">
                  {t("Country of usage")}:
                </span>
              </div>
              <div className="columns small-6 large-shrink">
                <span className="item-body__value item-body__value--custom">
                  {countryOfUsage}
                </span>
              </div>
            </div>
          )}
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
          {!!ewrTotal && (
            <div className="row align-middle collapse item-body__row item-body__row--ewr">
              <div className="columns small-6 large-shrink">
                <span className="item-body__label item-body__label--ewr">{`${t(
                  "EWR fee"
                )}: `}</span>
              </div>
              <div className="columns small-6 large-shrink">
                <Currency
                  className="item-body__value item-body__value--unit"
                  value={ewrUnit}
                  currencyCode={currencyCode}
                />
                <Currency
                  className="item-body__value item-body__value--total"
                  value={ewrTotal}
                  currencyCode={currencyCode}
                />
              </div>
            </div>
          )}
        </div>
        <div
          className={cn("columns small-12", {
            "large-4 print-2": !isLoggedIn,
            "large-1 print-2": isLoggedIn,
          })}
        >
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
          {!!ewrTotal && (
            <div className="row align-middle collapse item-body__row item-body__row--ewr item-body__row--ewr-total">
              <div className="columns small-6 large-shrink">
                <Currency
                  className="item-body__value"
                  value={ewrTotal}
                  currencyCode={currencyCode}
                />
              </div>
            </div>
          )}
        </div>
        {isLoggedIn && (
          <div className="columns small-12 large-3 hide-for-print">
            <AddToCart
              canAddToCart={addToCart}
              item={addToCartItem}
              nonShippable={nonShipabble}
              stock={availableStock}
              getDEPInfo={getDEPInfo}
            />
          </div>
        )}
      </div>
      {depInfo && depInfo.materialInfo && depInfo.enrollment && (
        <DEPItemInformation
          materialId={depInfo.materialInfo.materialId}
          customerId={depInfo.enrollment.number}
          isLoggedIn={isLoggedIn}
        />
      )}
      {hasLineLevelInformation(cartItemMetaData, contractTextLineItem) && (
        <LineItemInformation
          contractReportingField={contractReportingField}
          contractTextLineItem={contractTextLineItem}
          countryOfUsage={countryOfUsage}
          smartTrackers={filterSmartTrackers(smartTracker)}
        />
      )}
    </div>
  );
}

ItemBody.propTypes = {
  currencyCode: PropTypes.string.isRequired,
  hasInvoicingEnabled: PropTypes.bool.isRequired,
  isContract: PropTypes.bool,
  isLoggedIn: PropTypes.bool.isRequired,
  item: PropTypes.shape({
    data: PropTypes.shape({
      addToCart: PropTypes.bool.isRequired,
      availableStock: PropTypes.number,
      cartItemMetaData: PropTypes.shape({
        countryOfUsage: PropTypes.string,
        smartTracker: PropTypes.arrayOf(PropTypes.object),
        contractReportingField: PropTypes.arrayOf(
          PropTypes.shape({
            name: PropTypes.string,
            value: PropTypes.string,
          })
        ),
      }),
      contractId: PropTypes.string,
      contractTextLineItem: PropTypes.arrayOf(PropTypes.string),
      ewrFee: PropTypes.number,
      imageURL: PropTypes.string,
      lineItemInvoiceInfo: PropTypes.arrayOf(PropTypes.string),
      materialInfo: PropTypes.shape({
        description: PropTypes.string,
        manufacturerName: PropTypes.string,
        manufacturerPartNumber: PropTypes.string,
        materialId: PropTypes.string,
        nonShipabble: PropTypes.bool,
        taaCompliant: PropTypes.bool,
        unitPrice: PropTypes.number,
      }),
      programId: PropTypes.string,
      qtyShipped: PropTypes.number,
      quantity: PropTypes.number,
      shippingStatus: PropTypes.string,
      totalPrice: PropTypes.number,
      sapLineItemNumber: PropTypes.string,
    }),
  }).isRequired,
  orderNumber: PropTypes.number.isRequired,
  getDEPInfo: PropTypes.func.isRequired,
  isCES: PropTypes.bool.isRequired,
};

ItemBody.defaultProps = {
  isContract: false,
};
