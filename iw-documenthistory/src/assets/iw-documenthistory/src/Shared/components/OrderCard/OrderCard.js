import React, { Component } from "react";
import PropTypes from "prop-types";
import { getInObject } from "@insight/toolkit-utils";

import OrderCardHeader from "./OrderCardHeader";
import OrderCardSection from "./OrderCardSection";
import { groupByBundle } from "./helpers";

export default class OrderCard extends Component {
  constructor(props) {
    super(props);
    this.state = { isExpanded: true, isCES: null };
  }

  componentDidMount() {
    const userInfo = getInObject(window, ["Insight", "userInformation"], {});
    this.setState({ isCES: isLoggedIn ? userInfo.isCES : false });
  }

  /**
   * toggles whether or not row is expanded
   */
  toggleExpand = () => {
    const currentState = this.state.isExpanded;
    this.setState({ isExpanded: !currentState });
  };

  render() {
    const {
      index,
      isLoggedIn,
      maxExpandedPriortiy,
      numberOfColumns,
      rowData: { header, items, bundles = [] },
      tableColumns,
      visibleTableColumns,
    } = this.props;
    const { isExpanded, isCES } = this.state;

    const hiddenTableColumns = tableColumns.filter(
      (row) => row.priority > maxExpandedPriortiy
    );
    const itemGroups = items && groupByBundle(items);
    const firstItemExpandRestCollapse = expandCollapseItems(index, isExpanded);
    return (
      <tbody className="iw-table__tbody order-card">
        <OrderCardHeader
          headerInfo={header}
          isExpanded={firstItemExpandRestCollapse}
          itemGroups={itemGroups}
          toggleExpand={this.toggleExpand}
          visibleTableColumns={visibleTableColumns}
          isCES={isCES}
        />
        <OrderCardSection
          bundles={bundles}
          header={header}
          hiddenTableColumns={hiddenTableColumns}
          isExpanded={firstItemExpandRestCollapse}
          isLoggedIn={isLoggedIn}
          itemGroups={itemGroups}
          numberOfColumns={numberOfColumns}
          isCES={isCES}
        />
      </tbody>
    );
  }
}

export function expandCollapseItems(index, isExpanded) {
  return index === 0 ? isExpanded : !isExpanded;
}

OrderCard.propTypes = {
  index: PropTypes.number.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  maxExpandedPriortiy: PropTypes.number.isRequired,
  numberOfColumns: PropTypes.number.isRequired,
  rowData: PropTypes.shape({
    // Key value pair
  }).isRequired,
  tableColumns: PropTypes.arrayOf(
    PropTypes.PropTypes.shape({
      className: PropTypes.string,
      name: PropTypes.string.isRequired,
      priority: PropTypes.number.isRequired,
      reference: PropTypes.string.isRequired,
    })
  ).isRequired,
  visibleTableColumns: PropTypes.arrayOf(
    PropTypes.PropTypes.shape({
      className: PropTypes.string,
      name: PropTypes.string.isRequired,
      priority: PropTypes.number.isRequired,
      reference: PropTypes.string.isRequired,
    })
  ).isRequired,
};
