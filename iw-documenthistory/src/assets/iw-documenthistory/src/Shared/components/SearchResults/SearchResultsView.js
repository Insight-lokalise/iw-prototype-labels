import React, { Component } from "react";
import PropTypes from "prop-types";
import { Pagination } from "@insight/toolkit-react";
import {
  IWLoading,
  IWResponsiveTable,
  RTRow,
} from "../../../libs/iw-components";
import { t } from "@insight/toolkit-utils/lib/labels";

import OrderCard from "../OrderCard/OrderCard";

export default class SearchResultsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
  }

  onPageChange = (startPage) => {
    this.handleAsync(this.pageChange(startPage));
  };

  handleAsync = (asyncFunc) => {
    this.setState(
      {
        isLoading: true,
      },
      () => asyncFunc
    );
  };

  pageChange = (startPage) => {
    return this.props.pageChange(startPage).then(() => {
      this.setState({ isLoading: false });
      window.scrollTo(0, 0);
    });
  };

  render() {
    const {
      isLoggedIn,
      isSEWP,
      recordsPerPage,
      results,
      totalRecords,
      currentPage,
      totalPages,
    } = this.props;
    const tableColumns = [
      {
        priority: 1,
        name: t("Order number"),
        reference: "orderNumber",
        className: "text-left",
      },
      {
        priority: 6,
        name: t("Order status"),
        reference: "orderStatus",
        className: "text-center",
      },
      {
        priority: 6,
        name: t("Order date"),
        reference: "orderDate",
        className: "text-left",
      },
      {
        priority: 6,
        name: t(`PO / ${isSEWP ? "STN" : "PO release"}`),
        reference: "po",
        className: "text-left",
      },
      {
        priority: 6,
        name: t("Reference number"),
        reference: "webReferenceNumber",
        className: "text-left",
      },
      {
        priority: 6,
        name: t("Account name / number"),
        reference: "soldtoName",
        className: "text-left",
      },
      {
        priority: 6,
        name: t("Shipping city"),
        reference: "shipToCity",
        className: "text-left",
      },
      {
        priority: 6,
        name: t("Placed by"),
        reference: "placedBy",
        className: "text-left",
      },
      {
        priority: 6,
        name: t("Order total"),
        reference: "orderTotal",
        className: "text-right",
      },
    ];

    return (
      <div>
        {this.state.isLoading ? (
          <div className="text-center">
            <IWLoading />
          </div>
        ) : (
          <IWResponsiveTable tableColumns={tableColumns}>
            {results.map((rowData, index) => (
              <RTRow
                key={index}
                render={(props) => (
                  <OrderCard
                    index={index}
                    isLoggedIn={isLoggedIn}
                    rowData={rowData}
                    {...props}
                  />
                )}
              />
            ))}
          </IWResponsiveTable>
        )}
        {totalRecords > recordsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageHandler={this.onPageChange}
          />
        )}
      </div>
    );
  }
}

SearchResultsView.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  isSEWP: PropTypes.bool.isRequired,
  pageChange: PropTypes.func.isRequired,
  recordsPerPage: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  results: PropTypes.arrayOf(PropTypes.object).isRequired,
  totalRecords: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
};
