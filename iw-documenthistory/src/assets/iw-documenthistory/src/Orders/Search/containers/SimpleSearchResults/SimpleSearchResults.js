import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
  selector_isLoggedIn,
  selector_isSEWPUser,
  selector_soldto,
  selector_webGroupId,
} from "../../../../Shared/selectors";

import {
  selector_lastOrdersSearch,
  selector_recordsPerPage,
  selector_searchInitialValues,
  selector_searchObject,
  selector_searchView,
  selector_simpleSearchOrders,
  selector_simpleSearchTotalRecords,
  selector_simplifiedSearch,
  selector_sortBy,
  selector_sortOrder,
  selector_startPage,
} from "./../../selectors/simpleSearchSelectors";

import {
  advancedSearch,
  getHierarchyTreeDropDown,
  getOrderHistory,
  searchByNumber,
  simplifiedSearch,
} from "./../../actions/simpleSearchActions";
import SimpleSearchResultsView from "../../../../Shared/components/SearchResults/SimpleSearchResultsView";

function mapStateToProps(state) {
  return {
    isLoggedIn: selector_isLoggedIn(state),
    isSEWP: selector_isSEWPUser(state),
    lastOrdersSearch: selector_lastOrdersSearch(state),
    orders: selector_simpleSearchOrders(state),
    recordsPerPage: selector_recordsPerPage(state),
    searchObj: selector_searchObject(state),
    searchView: selector_searchView(state),
    startPage: selector_startPage(state),
    sortBy: selector_sortBy(state),
    sortOrder: selector_sortOrder(state),
    soldto: selector_soldto(state),
    totalRecords: selector_simpleSearchTotalRecords(state),
    initialValues: selector_searchInitialValues(state),
    simplifiedSearchState: selector_simplifiedSearch(state),
    wgId: selector_webGroupId(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      advancedSearch,
      getHierarchyTreeDropDown,
      getOrderHistory,
      searchByNumber,
      simplifiedSearch,
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SimpleSearchResultsView);
