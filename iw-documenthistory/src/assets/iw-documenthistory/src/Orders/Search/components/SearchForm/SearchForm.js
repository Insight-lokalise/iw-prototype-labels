import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
  selector_isLoggedIn,
  selector_isPCMUSUser,
  selector_hasLimitOnSearchPermission,
  selector_hasMyOrdersOnlyPermission,
  selector_userDataIsLoading,
  selector_soldto,
  selector_webGroupId,
} from "../../../../Shared/selectors";

import {
  selector_advancedSearchInitialValues,
  selector_isAdvancedSearch,
  selector_opsCenterList,
  selector_regionsList,
  selector_selectionList,
  selector_searchInitialValues,
  selector_recordsPerPage,
  selector_sortBy,
  selector_sortOrder,
  selector_startPage,
  selector_simplifiedSearch,
} from "../../selectors/simpleSearchSelectors";

import {
  selector_genericAuthType,
  selector_genericSearchType,
} from "../../selectors/genericSearchResults";

import exportResultAsXLS from "../../../../models/OrderUtilities/actions/OrderUtilitiesActions";
import {
  advancedSearch,
  getGenericOrderSearch,
  getHierarchyTreeDropDown,
  getOrderHistory,
  getRegionsByBillTo,
  searchByNumber,
  simplifiedSearch,
} from "./../../actions/simpleSearchActions";
import {
  clearSearch,
  updateQuery,
  setIsInit,
} from "./../../actions/simplifiedSearchActions";

import SearchFormView from "./SearchFormView";

const mapStateToProps = (state) => ({
  advancedSearchInitialValues: selector_advancedSearchInitialValues(state),
  authType: selector_genericAuthType(state),
  simpleSearchInitialValues: selector_searchInitialValues(state),
  isAdvancedSearch: selector_isAdvancedSearch(state),
  isLoggedIn: selector_isLoggedIn(state),
  isPCMUSUser: selector_isPCMUSUser(state),
  opsCentersList: selector_opsCenterList(state),
  recordsPerPage: selector_recordsPerPage(state),
  regionList: selector_regionsList(state),
  searchType: selector_genericSearchType(state),
  selectionList: selector_selectionList(state),
  showOnlyMyOrders: selector_hasMyOrdersOnlyPermission(state),
  soldto: selector_soldto(state),
  sortBy: selector_sortBy(state),
  sortOrder: selector_sortOrder(state),
  startPage: selector_startPage(state),
  showOnlySearchByNumber: selector_hasLimitOnSearchPermission(state),
  userDataIsLoading: selector_userDataIsLoading(state),
  simplifiedSearchState: selector_simplifiedSearch(state),
  wgId: selector_webGroupId(state),
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      advancedSearch,
      exportResultAsXLS,
      getGenericOrderSearch,
      getHierarchyTreeDropDown,
      getOrderHistory,
      getRegionsByBillTo,
      searchByNumber,
      simplifiedSearch,
      clearSearch,
      updateQuery,
      setIsInit,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(SearchFormView);
