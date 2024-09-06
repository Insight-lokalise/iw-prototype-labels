import React, { Component } from "react";
import { IWAnchor, IWSelect, IWLoading } from "../../../libs/iw-components";
import PropTypes from "prop-types";
import cn from "classnames";
import { t } from "@insight/toolkit-utils/lib/labels";
import { Button } from '@insight/toolkit-react'
import { RadioGroup } from "@insight/toolkit-react/lib/Form/Components/Elements";
import isDesktop from '@insight/toolkit-utils/lib/media/isDesktop';

import SearchResultsView from "./SearchResultsView";
import {
  ADVANCED_SEARCH_VIEW,
  ORDER_HISTORY_VIEW,
  QUICK_SEARCH_VIEW,
  sortOrderBy,
  defaultFilters,
  TAB_KEY_CODE
} from "../../../Orders/Search/constants/Constants";
import { handleKeydownListener } from "../../../Orders/Search/helpers/helper";

export default class SimpleSearchResultsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      recordsPerPage: props.recordsPerPage,
      sortBy: props.sortBy,
      sortOrder: props.sortOrder,
    };

    this.displayPerPage = this.displayPerPage.bind(this);
    this.getRecordsPerPage = this.getRecordsPerPage.bind(this);
    this.exportFile = this.exportFile.bind(this);
    this.pageChange = this.pageChange.bind(this);
    this.sortBy = this.sortBy.bind(this);
    this.sortResultsBy = this.sortResultsBy.bind(this);
  }

  componentDidMount() {
    const {
      advancedSearch,
      getOrderHistory,
      initialValues,
      isCES,
      lastOrdersSearch,
      recordsPerPage,
      searchByNumber,
      searchView,
      simplifiedSearch,
      soldto,
      showOnlySearchByNumber,
      startPage,
      sortOrder,
      sortBy,
      simplifiedSearchState,
      wgId,
    } = this.props;
    if (showOnlySearchByNumber && searchView === "orderHistory")
      this.updateViewAndState();
    const filters = lastOrdersSearch && JSON.parse(lastOrdersSearch);

    if (isCES) {
      const { query } = simplifiedSearchState;
      const pageDetails = {
        recordsPerPage,
        startPage,
        sortOrder,
        sortBy,
      };
      simplifiedSearch(
        { filters: query, ...pageDetails, soldto, wgId },
        pageDetails
      ).then(() => this.updateViewAndState());

      return;
    }
    switch (searchView) {
      case "orderHistory":
        const { query } = simplifiedSearchState;
        const pageDetails = {
          recordsPerPage,
          startPage,
          sortOrder,
          sortBy,
        };
        getOrderHistory({ ...pageDetails, filters: query, soldto, wgId }).then(() =>
          this.updateViewAndState()
        );
        break;
      case "quickSearch":
        searchByNumber(filters, initialValues).then(() =>
          this.updateViewAndState()
        );
        break;
      case "advancedSearch":
        const [submittedFormValues, additionalSearchValues] = filters;
        advancedSearch(initialValues, additionalSearchValues).then(() =>
          this.updateViewAndState()
        );
        break;
      default:
        break;
    }
  }

  componentDidUpdate() {
    this.handleListener(true);
  }

  componentWillUnmount() {
    this.handleListener();
  }

  handleListener(addListener) {
    const { isLoggedIn, totalRecords } = this.props;
    if (isLoggedIn && totalRecords > 0) {
      const focusElem = document.querySelector('#exportButton');
      handleKeydownListener(focusElem, this.handleExportButtonFocus, addListener);
    }
  }

  handleExportButtonFocus(e) {
    if (e.keyCode === TAB_KEY_CODE) {
      const targetWrapper = document.querySelector('.export_focus_element');
      if (targetWrapper) {
        targetWrapper.focus({ preventScroll: true });
      }
    }
  }

  getRecordsPerPage = () => {
    const { recordsPerPage, sortBy, sortOrder } = this.state;
    const {
      advancedSearch,
      getOrderHistory,
      initialValues,
      isCES,
      searchByNumber,
      simplifiedSearch,
      soldto,
      searchObj,
      searchView,
      wgId,
    } = this.props;
    if (isCES) {
      const pageDetails = {
        recordsPerPage,
        startPage: 1,
        sortBy,
        sortOrder,
      };
      const filters = initialValues.filters || defaultFilters;
      simplifiedSearch(
        { filters, ...pageDetails, soldto, wgId },
        pageDetails
      ).then(() => this.updateViewAndState());
    } else if (searchView === ORDER_HISTORY_VIEW) {
      const pageDetails = {
        recordsPerPage,
        startPage: 1,
        sortBy,
        sortOrder,
      };
      const filters = initialValues.filters || defaultFilters;
      getOrderHistory({ filters, ...pageDetails, soldto, wgId }).then(() => {
        this.setState({
          isLoading: false,
        });
      });
    } else if (searchView === ADVANCED_SEARCH_VIEW) {
      const pageDetails = {
        recordsPerPage,
        startPage: 1,
        sortBy,
        sortOrder,
      };
      advancedSearch(initialValues, pageDetails).then(() => {
        this.setState({
          isLoading: false,
        });
      });
    } else if (searchView === QUICK_SEARCH_VIEW) {
      const pageDetails = {
        ...searchObj,
        recordsPerPage,
        startPage: 1,
      };
      searchByNumber(pageDetails, initialValues).then(() => {
        this.setState({
          isLoading: false,
        });
      });
    }
  };

  displayPerPage = (event) => {
    this.setState(
      {
        isLoading: true,
        recordsPerPage: event.value,
      },
      () => {
        this.getRecordsPerPage();
      }
    );
  };

  sortResultsBy = (event) => {
    this.setState(
      {
        isLoading: true,
        sortOrder: Number(event.target.value),
      },
      () => {
        this.getRecordsPerPage();
      }
    );
  };

  sortBy = (event) => {
    this.setState(
      {
        isLoading: true,
        sortBy: event.value,
      },
      () => {
        this.getRecordsPerPage();
      }
    );
  };

  updateViewAndState() {
    this.setState({ isLoading: false });
    window.scrollTo(0, 0);
  }

  exportFile = () => {
    this.props.exportResultAsXLS(this.props.isCES, this.props.searchView, this.props.searchObj);
  };

  pageChange = (startPage) => {
    const { recordsPerPage, sortBy, sortOrder } = this.state;
    const {
      advancedSearch,
      getOrderHistory,
      initialValues,
      isCES,
      searchByNumber,
      searchObj,
      searchView,
      simplifiedSearch,
      soldto,
      wgId,
    } = this.props;
    if (isCES) {
      const pageDetails = {
        recordsPerPage,
        startPage,
        sortBy,
        sortOrder,
      };
      const filters = initialValues.filters || defaultFilters;
      return simplifiedSearch(
        { filters, ...pageDetails, soldto, wgId },
        pageDetails
      ).then(() => {
        this.setState({
          isLoading: false,
        });
      });
    } else if (searchView === ORDER_HISTORY_VIEW) {
      const pageDetails = {
        recordsPerPage,
        startPage,
        sortBy,
        sortOrder,
      };
      return getOrderHistory(pageDetails, initialValues);
    } else if (searchView === ADVANCED_SEARCH_VIEW) {
      const pageDetails = {
        recordsPerPage,
        startPage,
        sortBy,
        sortOrder,
      };
      return advancedSearch(initialValues, pageDetails);
    } else if (searchView === QUICK_SEARCH_VIEW) {
      const pageDetails = {
        ...searchObj,
        recordsPerPage,
        startPage,
      };
      return searchByNumber(pageDetails, initialValues);
    }
  };

  render() {
    const options = [
      { label: t("Display 5 orders"), value: 5 },
      { label: t("Display 20 orders"), value: 20 },
    ];
    const sortType = [
      { id: "ASC", label: t("Ascending"), value: 0 },
      { id: "DES", label: t("Descending"), value: 1 },
    ];
    const exportExcel = t("Export as a file");
    const {
      isLoggedIn,
      isLoading,
      isSEWP,
      isCES,
      orders,
      recordsPerPage,
      searchView,
      showOnlySearchByNumber,
      startPage,
      totalRecords,
    } = this.props;
    const noResults = t("No results found");
    const hideHistoryView =
      showOnlySearchByNumber && searchView === "orderHistory";
    return (
      <div
        className={cn("search-results-container", {
          "search-results-container--ces": isCES,
        })}
      >
        {isLoggedIn && (
          <div>
            {totalRecords > 0 && (
              <div className="row expanded align-bottom search-results-filters">
                <div className="columns small-12 medium-3 large-2 u-padding-left-none">
                  <label className="form__label">
                    <IWSelect
                      className="search-results-filters__filter"
                      options={options}
                      placeholder={t("Display 5 orders")}
                      value={recordsPerPage}
                      onChange={this.displayPerPage}
                      clearable={false}
                      searchable={false}
                    />
                  </label>
                </div>
                <div className="columns small-12 medium-3 large-2">
                  <label className="form__label">
                    <IWSelect
                      className="search-results-filters__filter"
                      options={sortOrderBy.map((option) => ({
                        value: option.value,
                        label: t(option.displayName),
                      }))}
                      placeholder={t("Order date")}
                      value={this.state.sortBy}
                      onChange={this.sortBy}
                      clearable={false}
                      searchable={false}
                    />
                  </label>
                </div>
                <div className="columns small-12 medium-3 large-2 c-dh-format-radio">
                  <RadioGroup
                    name="sortOrder"
                    options={sortType}
                    value={this.state.sortOrder}
                    onChange={this.sortResultsBy}
                  />
                </div>
                <div className="columns medium-expand text-right hide-for-small-only">
                  {isDesktop() && <Button id="exportButton" role="button" tabIndex="0" color="link" className="orders__link letter-spacing-normal" title={exportExcel} onClick={this.exportFile}>
                    <span className="orders__link-text">{exportExcel}</span>
                    <span className="orders__ion-icon orders__ion-icon--right ion-ios-download-outline" />
                  </Button>}
                </div>
              </div>
            )}
            <div className="export_focus_element" tabindex="0"></div>
            <div className="search-results">
              {this.state.isLoading || isLoading ? (
                <div className="text-center">
                  <IWLoading />
                </div>
              ) : (
                <div>
                  {!hideHistoryView && totalRecords > 0 ? (
                    <SearchResultsView
                      isLoggedIn={isLoggedIn}
                      isSEWP={isSEWP}
                      pageChange={this.pageChange}
                      recordsPerPage={recordsPerPage}
                      currentPage={startPage}
                      results={orders}
                      searchView={searchView}
                      totalRecords={totalRecords}
                      totalPages={Math.ceil(totalRecords / recordsPerPage)}
                    />
                  ) : (
                    <p className="no-margin-bot search-results__no-results">
                      {!hideHistoryView && noResults}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}

SimpleSearchResultsView.propTypes = {
  advancedSearch: PropTypes.func.isRequired,
  exportResultAsXLS: PropTypes.func.isRequired,
  getOrderHistory: PropTypes.func.isRequired,
  initialValues: PropTypes.shape({
    // key value pair
  }).isRequired,
  isSEWP: PropTypes.bool.isRequired,
  orders: PropTypes.arrayOf(PropTypes.object).isRequired,
  searchObj: PropTypes.shape({
    // key value pair
  }).isRequired,
  isLoading: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  lastOrdersSearch: PropTypes.string.isRequired,
  recordsPerPage: PropTypes.number.isRequired,
  searchByNumber: PropTypes.func.isRequired,
  searchView: PropTypes.string.isRequired,
  showOnlySearchByNumber: PropTypes.bool,
  sortBy: PropTypes.number.isRequired,
  sortOrder: PropTypes.number.isRequired,
  startPage: PropTypes.number.isRequired,
  totalRecords: PropTypes.number,
};

SimpleSearchResultsView.defaultProps = {
  showOnlySearchByNumber: false,
  totalRecords: 0,
};
