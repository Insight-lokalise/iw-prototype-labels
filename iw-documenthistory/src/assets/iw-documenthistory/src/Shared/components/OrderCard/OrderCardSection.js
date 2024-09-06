import React, { Component } from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import { withRouter } from "react-router";
import { IWAnchor } from "../../../libs/iw-components";
import Currency from "@insight/toolkit-react/lib/Currency/Currency";
import { t } from "@insight/toolkit-utils/lib/labels";

import OrderCardItem from "./OrderCardItem";
import { headerText } from "./helpers";

class OrderCardSection extends Component {
  constructor() {
    super();
  }

  handleClick = (orderNumber, soldtoNumber, source) => {
    if (source === "PCM") {
      window.open(
        `orderDetails/legacy?ordNum=${orderNumber}&ops_center=81`,
        "_self"
      );
    } else {
      this.props.history.push(`/orderDetails/${orderNumber}/${soldtoNumber}`);
    }
  };

  renderCellValue = (reference) => {
    const { header } = this.props;
    const viewOrderDetailLink = (
      <IWAnchor
        className="button small hollow expand order-card-section__btn"
        onClick={() =>
          this.handleClick(header.orderNumber, header.soldtoNumber)
        }
      >
        {t("View order details")}
      </IWAnchor>
    );
    if (reference === "orderTotal") {
      return (
        <Currency
          className="nowrap"
          currencyCode={header.currency}
          value={header[reference]}
        />
      );
    } else if (reference === "orderDate") {
      return <span className="nowrap">{header[reference]}</span>;
    }
    return header[reference] === "" || header[reference]
      ? headerText(header, reference)
      : viewOrderDetailLink;
  };

  render() {
    const {
      bundles,
      header,
      hiddenTableColumns,
      isExpanded,
      isLoggedIn,
      itemGroups,
      numberOfColumns,
      isCES,
    } = this.props;
    const itemsToShow =
      itemGroups && itemGroups.length > 3 ? itemGroups.slice(0, 3) : itemGroups;
    const totalNumberOfColumns = numberOfColumns + 1;

    return (
      <tr className="iw-table__row order-card-section">
        <td
          className="iw-table__column order-card-section__spacer"
          colSpan={totalNumberOfColumns}
        >
          {hiddenTableColumns.length > 0 && (
            <table
              className={cn("order-card-section__table", { hide: !isExpanded })}
            >
              <tbody>
                {hiddenTableColumns.map((data) =>
                  data.name ? (
                    <tr
                      key={data.reference}
                      className="order-card-section__row"
                    >
                      <th className="order-card-section__column order-card-section__heading">
                        {data.name}:
                      </th>
                      <td className="order-card-section__column order-card-section__column--right">
                        {this.renderCellValue(data.reference)}
                      </td>
                    </tr>
                  ) : (
                    <tr
                      key={data.reference}
                      id={data.reference}
                      className="order-card-section__row"
                    >
                      <td colSpan="2" className="order-card-section__column">
                        {this.renderCellValue(data.reference)}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          )}
          <table
            className={cn("order-card-section__table", { hide: !isExpanded })}
          >
            <tbody>
              {itemsToShow &&
                itemsToShow.map((items) => {
                  const key = `${items[0].materialId}${items[0].bundleId}`;
                  const bundle = bundles
                    ? bundles.find((item) => item.id === items[0].bundleId)
                    : {};
                  return (
                    <OrderCardItem
                      key={key}
                      items={items}
                      bundle={bundle}
                      isLoggedIn={isLoggedIn}
                      isCES={isCES}
                    />
                  );
                })}
              {itemGroups && itemGroups.length > 3 && (
                <tr className="order-card-section__row">
                  <td className="order-card-section__column">
                    <IWAnchor
                      className="orders__link order-card-section__link"
                      onClick={() =>
                        this.handleClick(
                          header.orderNumber,
                          header.soldtoNumber,
                          header.source
                        )
                      }
                    >
                      <span className="orders__link-text">
                        {t("View all items in this order")}
                      </span>
                      <span className="orders__ion-icon orders__ion-icon--right ion-forward" />
                    </IWAnchor>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </td>
      </tr>
    );
  }
}

export default withRouter(OrderCardSection);

OrderCardSection.propTypes = {
  bundles: PropTypes.arrayOf(
    PropTypes.PropTypes.shape({
      name: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
    })
  ),
  header: PropTypes.shape({
    // Key value pairs
  }).isRequired,
  hiddenTableColumns: PropTypes.arrayOf(
    PropTypes.PropTypes.shape({
      className: PropTypes.string,
      name: PropTypes.string.isRequired,
      priority: PropTypes.number.isRequired,
      reference: PropTypes.string.isRequired,
    })
  ).isRequired,
  history: PropTypes.shape({
    // Key value pair
    push: PropTypes.func.isRequired,
  }).isRequired,
  isExpanded: PropTypes.bool,
  isLoggedIn: PropTypes.bool.isRequired,
  itemGroups: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.PropTypes.shape({
        // Key value pairs
      })
    )
  ).isRequired,
  numberOfColumns: PropTypes.number.isRequired,
  isCES: PropTypes.bool.isRequired,
};

OrderCardSection.defaultProps = {
  bundles: null,
  isExpanded: false,
};
