import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import cn from "classnames";
import { connectToLocale } from "@insight/toolkit-react";
import { IWAnchor, IWLoading } from "../../../../libs/iw-components";
import { currentLocale } from "../../../../libs/iw-components/IWUser/model/User/locale";
import { t } from "@insight/toolkit-utils/lib/labels";
import { defaultFilters } from "../../constants/Constants";

import AdvancedSearchFormView from "./AdvancedSearchFormView";
import GenericSearchFormView from "./GenericSearchFormView";
import SimpleSearchFormView from "./SimpleSearchFormView";
import SimplifiedSearchView from "./SimplifiedSearchView";

import SimpleSearchResults from "../../containers/SimpleSearchResults/SimpleSearchResults";

export class SearchFormView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdvancedSearch: props.isAdvancedSearch,
      isLoading: false,
    };
    this.toggleSearch = this.toggleSearch.bind(this);
    this.advancedSearch = this.advancedSearch.bind(this);
    this.handleAdvancedSearchFormSubmit =
      this.handleAdvancedSearchFormSubmit.bind(this);
    this.handleSimpleSearchFormSubmit =
      this.handleSimpleSearchFormSubmit.bind(this);
    this.handleAsync = this.handleAsync.bind(this);
    this.reloadOrderHistoryResults = this.reloadOrderHistoryResults.bind(this);
    this.simplifiedSearchSubmit = this.simplifiedSearchSubmit.bind(this);
    this.simplifiedSearchDefault = this.simplifiedSearchDefault.bind(this);
  }

  componentDidMount() {
    moment.locale(currentLocale());
  }

  toggleSearch() {
    this.setState({
      isAdvancedSearch: !this.state.isAdvancedSearch,
    });
  }

  advancedSearch(values) {
    const pageDetails = {
      recordsPerPage: 5,
      startPage: 1,
      sortOrder: 1,
      sortBy: 3,
    };
    const { advancedSearch } = this.props;
    advancedSearch(values, pageDetails).then(() => {
      this.setState({
        isLoading: false,
      });
    });
  }

  handleAdvancedSearchFormSubmit(values) {
    this.handleAsync(this.advancedSearch(values));
  }

  handleAsync(asyncFunc) {
    this.setState(
      {
        isLoading: true,
      },
      asyncFunc
    );
  }

  handleSimpleSearchFormSubmit(value) {
    this.handleAsync(this.searchByNumber(value));
  }

  reloadOrderHistoryResults() {
    this.props.getOrderHistory({ recordsPerPage: 5, startPage: 1 });
  }

  searchByNumber(value) {
    const { searchByNumber } = this.props;
    const searchObj = value.searchBy
      ? { [value.searchBy]: value[value.searchBy].trim() }
      : value;

    const paramObj = {
      startPage: 1,
      recordsPerPage: 5,
      filters: searchObj,
    };
    searchByNumber(paramObj, value).then(() => {
      this.setState({
        isLoading: false,
      });
    });
  }

  simplifiedSearchSubmit(values) {
    this.setState({
      isLoading: true,
    });
    const { recordsPerPage, startPage, sortOrder, sortBy, soldto, wgId } =
      this.props;
    const pageDetails = {
      recordsPerPage,
      startPage: 1,
      sortOrder,
      sortBy,
    };

    this.props
      .simplifiedSearch(
        { filters: { ...values }, ...pageDetails, soldto, wgId },
        pageDetails
      )
      .then(() => {
        this.setState({
          isLoading: false,
        });
      });
  }

  simplifiedSearchDefault() {
    this.props.clearSearch();
    this.setState({
      isLoading: true,
    });
    const { recordsPerPage, sortBy, sortOrder, soldto, wgId } = this.props;
    const pageDetails = {
      recordsPerPage,
      startPage: 1,
      sortOrder,
      sortBy,
    };

    this.props
      .simplifiedSearch(
        { filters: defaultFilters, ...pageDetails, soldto, wgId },
        pageDetails
      )
      .then(() => {
        this.setState({
          isLoading: false,
        });
      });
  }

  render() {
    const advanceOrderSearchText = t("Advanced order search");
    const collapseAdvancedORderSearchText = t("Collapse advanced order search");
    const { isAdvancedSearch } = this.state;
    const {
      advancedSearchInitialValues,
      authType,
      context,
      exportResultAsXLS,
      getGenericOrderSearch,
      getHierarchyTreeDropDown,
      getRegionsByBillTo,
      isLoggedIn,
      isPCMUSUser,
      opsCentersList,
      regionList,
      searchType,
      selectionList,
      simpleSearchInitialValues,
      showOnlyMyOrders,
      showOnlySearchByNumber,
      userDataIsLoading,
    } = this.props;
    const { isCES } = context;
    const showInitialSearchView = (
      <div
        className={cn(
          "row expanded is-collapse-child align-justify order__details",
          { "order__details--ces": isCES }
        )}
      >
        <div className="columns small-12 medium-expand">
          <h1 className="orders-search__title">{t("Recent Orders")}</h1>
          {!showOnlySearchByNumber /* Show advance order link if search by number only permission is OFF */ && (
            <p>
              <IWAnchor
                href="javascript:void(0)"
                title={advanceOrderSearchText}
                onClick={this.toggleSearch}
              >
                {!isAdvancedSearch
                  ? advanceOrderSearchText
                  : collapseAdvancedORderSearchText}
              </IWAnchor>
            </p>
          )}
        </div>
      </div>
    );
    return (
      <div className="orders__container">
        {userDataIsLoading && (
          <div className="text-center">
            <IWLoading />
          </div>
        )}
        {!userDataIsLoading && isLoggedIn && (
          <div>
            {!isCES && showInitialSearchView}
            {isAdvancedSearch && !isCES && (
              <AdvancedSearchFormView
                getHierarchyTreeDropDown={getHierarchyTreeDropDown}
                getRegionsByBillTo={getRegionsByBillTo}
                handleAdvancedSearchFormSubmit={
                  this.handleAdvancedSearchFormSubmit
                }
                initialValues={advancedSearchInitialValues}
                opsCentersList={opsCentersList}
                regionList={regionList}
                reloadOrderHistoryResults={this.reloadOrderHistoryResults}
                selectionList={selectionList}
                showOnlyMyOrders={showOnlyMyOrders}
                isPCMUSUser={isPCMUSUser}
              />
            )}
            {!isAdvancedSearch && !isCES && (
              <SimpleSearchFormView
                initialValues={simpleSearchInitialValues}
                handleSimpleSearchFormSubmit={this.handleSimpleSearchFormSubmit}
                reloadOrderHistoryResults={this.reloadOrderHistoryResults}
                isPCMUSUser={isPCMUSUser}
              />
            )}
            {isCES && (
              <SimplifiedSearchView
                onSubmit={this.simplifiedSearchSubmit}
                onClear={this.simplifiedSearchDefault}
                simplifiedSearchState={this.props.simplifiedSearchState}
                updateQuery={this.props.updateQuery}
                setIsInit={this.props.setIsInit}
              />
            )}
            <div className="filter_focus_element" tabindex="0" ></div>
            <SimpleSearchResults
              exportResultAsXLS={exportResultAsXLS}
              isLoading={this.state.isLoading}
              showOnlySearchByNumber={showOnlySearchByNumber}
              isCES={isCES}
            />
          </div>
        )}
        {!userDataIsLoading && !isLoggedIn && (
          <div>
            <GenericSearchFormView
              authType={authType}
              getGenericOrderSearch={getGenericOrderSearch}
              handleFormSubmit={this.handleFormSubmit}
              isLoggedIn={isLoggedIn}
              searchType={searchType}
            />
          </div>
        )}
      </div>
    );
  }
}

export default connectToLocale(SearchFormView);

SearchFormView.propTypes = {
  advancedSearch: PropTypes.func.isRequired,
  advancedSearchInitialValues: PropTypes.shape({
    // key value pair
  }).isRequired,
  authType: PropTypes.string.isRequired,
  isAdvancedSearch: PropTypes.bool.isRequired,
  searchType: PropTypes.string.isRequired,
  simpleSearchInitialValues: PropTypes.shape({
    // key value pair
  }).isRequired,
  exportResultAsXLS: PropTypes.func.isRequired,
  getGenericOrderSearch: PropTypes.func.isRequired,
  getHierarchyTreeDropDown: PropTypes.func.isRequired,
  getOrderHistory: PropTypes.func.isRequired,
  getRegionsByBillTo: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  isPCMUSUser: PropTypes.bool.isRequired,
  opsCentersList: PropTypes.arrayOf(PropTypes.object).isRequired,
  regionList: PropTypes.arrayOf(PropTypes.object).isRequired,
  searchByNumber: PropTypes.func.isRequired,
  selectionList: PropTypes.arrayOf(PropTypes.object).isRequired,
  showOnlyMyOrders: PropTypes.bool,
  showOnlySearchByNumber: PropTypes.bool,
  userDataIsLoading: PropTypes.bool.isRequired,
  simplifiedSearchState: PropTypes.object,
  updateQuery: PropTypes.func.isRequired,
  setIsInit: PropTypes.func.isRequired,
};

SearchFormView.defaultProps = {
  showOnlyMyOrders: false,
  showOnlySearchByNumber: false,
};
