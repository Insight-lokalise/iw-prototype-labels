import React from "react";
import PropTypes from "prop-types";
import { t } from "@insight/toolkit-utils/lib/labels";

import IWItemDetails from "./IWItemDetails";

/**
 * Represents an item or bundle of items.
 */
export default function OrderCardItem({ bundle, isLoggedIn, items, isCES }) {
  const isBundleItem = Object.keys(bundle).length > 0;
  return (
    <tr className="order-card-item">
      <td>
        {isBundleItem && (
          <span className="order-card-item__header">
            {t("Mfr Part #")}: {bundle.name}
          </span>
        )}
        {items.map((item, index) => (
          <div
            className="row collapse expanded align-justify order-card-item__body"
            key={index}
          >
            <div className="columns small-12 medium-7 large-5">
              <IWItemDetails
                isLoggedIn={isLoggedIn}
                item={item}
                isCES={isCES}
              />
            </div>
            <div className="columns small-12 medium-4 large-6">
              <div className="row align-middle collapse item-body__row">
                <div className="columns small-6 large-12">
                  <span className="item-body__label">
                    {!item.shippable ? t("Qty") : t("Qty shipped")}
                  </span>
                </div>
                <div className="columns small-6 large-12">
                  <span className="item-body__value">
                    {!item.shippable
                      ? `${item.qty}`
                      : `${item.qtyShipped} ${t("of")} ${item.qty}`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </td>
    </tr>
  );
}

OrderCardItem.propTypes = {
  bundle: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    orderNumber: PropTypes.string,
  }),
  isLoggedIn: PropTypes.bool.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      qtyShipped: PropTypes.number.isRequired,
      qty: PropTypes.number.isRequired,
      customerId: PropTypes.string,
    })
  ).isRequired,
  isCES: PropTypes.bool.isRequired,
};

OrderCardItem.defaultProps = {
  bundle: {},
};
