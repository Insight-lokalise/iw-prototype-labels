import React, { Component } from "react";
import PropTypes from "prop-types";
import { IWAnchor } from "../../../libs/iw-components";
import Currency from "@insight/toolkit-react/lib/Currency/Currency";
import Date from "@insight/toolkit-react/lib/Date/Date";
import { withRouter } from "react-router";
import cn from "classnames";
import { t } from "@insight/toolkit-utils/lib/labels";

import { headerText } from "./helpers";
import { classNameStatusMap } from "../StatusBar/StatusBar";

/**
 * A row of header-level information for an order
 */
class OrderCardHeader extends Component {
  constructor() {
    super();
  }

  navigateToDetails = (event) => {
    event.preventDefault();

    const {
      headerInfo: { source },
    } = this.props;

    const url = this.generateDetailUrl();

    if (source === "PCM") {
      window.open(url, "_self");
    } else {
      if (event.button === 0) {
        this.props.history.push(url);
      } else if (event.button === 1) {
        window.open(url, "_blank");
      }
    }
  };

  generateDetailUrl = () => {
    const {
      headerInfo: { orderNumber, soldtoNumber, source },
    } = this.props;

    if (source === "PCM") {
      return `orderDetails/legacy?ordNum=${orderNumber}&ops_center=81`;
    } else {
      return `orderDetails/${orderNumber}/${soldtoNumber}`;
    }
  };

  renderCellValue = (reference) => {
    const { headerInfo, isCES } = this.props;
    const viewOrderDetailLink = (
      <IWAnchor
        href={this.generateDetailUrl()}
        onMouseDown={this.navigateToDetails}
      >
        {t("View order details")}
      </IWAnchor>
    );
    if (reference === "orderNumber") {
      return (
        <div>
          <span className="order-card-header__title">{t("Order number")}</span>
          <IWAnchor
            className="orders__link order-card-header__link"
            href={this.generateDetailUrl()}
            onMouseDown={this.navigateToDetails}
          >
            {headerInfo[reference]}
          </IWAnchor>
        </div>
      );
    } else if (reference === "orderTotal") {
      return (
        <Currency
          className="nowrap"
          currencyCode={headerInfo.currency}
          value={headerInfo[reference]}
        />
      );
    } else if (reference === "orderDate") {
      return <span className="nowrap">
        {isCES ? <Date date={headerInfo[reference]} type='date' /> : headerInfo[reference]}
      </span>;
    } else if (reference === "orderStatus") {
      return (
        <span
          className={cn(
            "nowrap order-status",
            `order-status--${classNameStatusMap[headerInfo[reference]]}`
          )}
        >
          {t(headerInfo[reference])}
        </span>
      );
    } else if (reference === "placedBy") {
      return <span data-private="true">{headerInfo[reference]}</span>;
    }

    return headerInfo[reference] === "" || headerInfo[reference]
      ? headerText(headerInfo, reference)
      : viewOrderDetailLink;
  };

  render() {
    const { isExpanded, toggleExpand, visibleTableColumns } = this.props;
    const expandableIcon = (
      <IWAnchor className="iw-table__icon" onClick={toggleExpand}>
        {isExpanded ? (
          <span className="iw-table__icon-ion ion-chevron-down" />
        ) : (
          <span className="iw-table__icon-ion ion-chevron-right" />
        )}
      </IWAnchor>
    );

    return (
      <tr
        className={cn("iw-table__row order-card-header", {
          "order-card-header--expanded": isExpanded,
        })}
      >
        <td className="iw-table__column">{expandableIcon}</td>
        {visibleTableColumns.map((column) => (
          <td
            key={column.reference}
            className={cn("iw-table__column", column.className)}
          >
            {this.renderCellValue(column.reference)}
          </td>
        ))}
      </tr>
    );
  }
}

export default withRouter(OrderCardHeader);

OrderCardHeader.propTypes = {
  headerInfo: PropTypes.shape({
    // Key value pair
  }).isRequired,
  history: PropTypes.shape({
    // Key value pair
    push: PropTypes.func.isRequired,
  }).isRequired,
  isExpanded: PropTypes.bool.isRequired,
  toggleExpand: PropTypes.func.isRequired,
  visibleTableColumns: PropTypes.arrayOf(
    PropTypes.shape({
      reference: PropTypes.string.isRequired,
    })
  ).isRequired,
  isCES: PropTypes.bool,
};
