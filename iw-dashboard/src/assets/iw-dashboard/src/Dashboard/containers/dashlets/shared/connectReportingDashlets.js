import PropTypes from 'prop-types'

import { selector_prevAPICalls } from '../../../selectors/reportingSelectors'
import { selector_currentTab } from '../../../selectors/settingsSelectors'
import { selector_userData } from '../../../selectors/userSelectors'
import { selector_dashletSettings_currentTab_dashlet } from '../../../selectors/dashletSelectors'
import { getSBStandard, getSBProduct, getSBManufacturer } from '../../../actions/reportingActions'
import {
  editDashletDateRange,
  editDashletSortingCategory,
  editDashletComparison,
  editDashletCurrency,
  editDashletCountry,
  editDashletRegion,
  editDashletManufacturer,
  editDashletSubCategory,
  editDashletBackText,
  editDashletFilters,
} from '../../../actions/dashletActions'
import { SBPRODUCT, SBMANUFACTURER } from '../../../components/constants'

export function connectReportingDashlets(type) {
  function mapStateToProps(state) {
    return {
      responses: selector_prevAPICalls(state, type),
      currentTab: selector_currentTab(state),
      dashletSettings: selector_dashletSettings_currentTab_dashlet(state, type),
      userData: selector_userData(state),
    }
  }
  function mapDispatchToProps(dispatch) {
    let getData
    switch (type) {
      case SBPRODUCT: {
        getData = getSBProduct
        break
      }
      case SBMANUFACTURER: {
        getData = getSBManufacturer
        break
      }
      default: {
        getData = getSBStandard
      }
    }
    return {
      dispatchGetRawData: identifier => dispatch(getData(identifier, type)),
      dispatchEditDashletDateRange: (dateRange, currentTab) =>
        dispatch(editDashletDateRange(dateRange, currentTab, type)),
      dispatchEditDashletSortingCategory: (sortingCategory, currentTab) =>
        dispatch(editDashletSortingCategory(sortingCategory, currentTab, type)),
      dispatchEditDashletComparison: currentTab => dispatch(editDashletComparison(currentTab, type)),
      dispatchEditDashletCurrency: (currency, currentTab) => dispatch(editDashletCurrency(currency, currentTab, type)),
      dispatchEditDashletCountry: (country, currentTab) => dispatch(editDashletCountry(country, currentTab, type)),
      dispatchEditDashletRegion: (region, currentTab) => dispatch(editDashletRegion(region, currentTab, type)),
      dispatchEditDashletSubCategory: (subCategory, currentTab) =>
        dispatch(editDashletSubCategory(subCategory, currentTab, type)),
      dispatchEditDashletBackText: (backText, currentTab) => dispatch(editDashletBackText(backText, currentTab, type)),
      dispatchEditDashletManufacturer: (manufacturer, currentTab) =>
        dispatch(editDashletManufacturer(manufacturer, currentTab, type)),
      dispatchEditDashletFilters: (filters, currentTab) => dispatch(editDashletFilters(filters, currentTab, type)),
    }
  }
  function mergeProps(stateProps, dispatchProps, ownProps) {
    const { responses, currentTab, dashletSettings, userData } = stateProps
    const {
      dispatchGetRawData,
      dispatchEditDashletDateRange,
      dispatchEditDashletSortingCategory,
      dispatchEditDashletComparison,
      dispatchEditDashletCurrency,
      dispatchEditDashletCountry,
      dispatchEditDashletRegion,
      dispatchEditDashletSubCategory,
      dispatchEditDashletBackText,
      dispatchEditDashletManufacturer,
      dispatchEditDashletFilters,
    } = dispatchProps
    const { toggleThisDashlet } = ownProps
    return {
      responses,
      currentTab,
      dashletSettings,
      userData,
      getRawData: dispatchGetRawData,
      toggleThisDashlet,
      editDashletDateRange: dateRange => dispatchEditDashletDateRange(dateRange, currentTab),
      editDashletSortingCategory: sortingCategory => dispatchEditDashletSortingCategory(sortingCategory, currentTab),
      editDashletComparison: () => dispatchEditDashletComparison(currentTab),
      editDashletCurrency: currency => dispatchEditDashletCurrency(currency, currentTab),
      editDashletCountry: country => dispatchEditDashletCountry(country, currentTab),
      editDashletRegion: region => dispatchEditDashletRegion(region, currentTab),
      editDashletSubCategory: subCategory => dispatchEditDashletSubCategory(subCategory, currentTab),
      editDashletBackText: backText => dispatchEditDashletBackText(backText, currentTab),
      editDashletManufacturer: manufacturer => dispatchEditDashletManufacturer(manufacturer, currentTab),
      editDashletFilters: filters => dispatchEditDashletFilters(filters, currentTab),
    }
  }
  return { mapStateToProps, mapDispatchToProps, mergeProps }
}

export const standardPropTypes = {
  currentTab: PropTypes.string.isRequired,
  dashletSettings: PropTypes.shape({
    backText: PropTypes.arrayOf(PropTypes.string),
    filters: PropTypes.shape({
      startMonth: PropTypes.string,
      endMonth: PropTypes.string,
      country: PropTypes.string,
    }),
    sortingCategory: PropTypes.string,
  }).isRequired,
  editDashletBackText: PropTypes.func,
  editDashletComparison: PropTypes.func.isRequired,
  editDashletCountry: PropTypes.func,
  editDashletCurrency: PropTypes.func.isRequired,
  editDashletDateRange: PropTypes.func.isRequired,
  editDashletFilters: PropTypes.func,
  editDashletManufacturer: PropTypes.func,
  editDashletRegion: PropTypes.func,
  editDashletSortingCategory: PropTypes.func.isRequired,
  editDashletSubCategory: PropTypes.func,
  getRawData: PropTypes.func.isRequired,
  responses: PropTypes.shape({
    currencies: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.string,
      })
    ),
    hasData: PropTypes.bool.isRequired,
    initialLoad: PropTypes.bool.isRequired,
  }).isRequired,
  userData: PropTypes.shape({
    currencyCode: PropTypes.string.isRequired,
    initialLoad: PropTypes.bool,
    monthNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
}
