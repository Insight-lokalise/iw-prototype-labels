import {
  EDIT_DASHLET_BACKTEXT,
  EDIT_DASHLET_COMPARISON,
  EDIT_DASHLET_COUNTRY,
  EDIT_DASHLET_CURRENCY,
  EDIT_DASHLET_FILTERS,
  EDIT_DASHLET_MANUFACTURER,
  EDIT_DASHLET_PUBLISHER,
  EDIT_DASHLET_REGION,
  EDIT_DASHLET_SUBCATEGORY,
  EDIT_DASHLET_SORTINGCATEGORY,
  EDIT_DASHLET_TIMEFRAME,
  EXISTS_POWERBI_DATA,
  EXISTS_WELCOME_DATA,
  GET_POWERBI_DATA,
  GET_WELCOME_DATA,
  SAVE_POWERBI_DATA,
  SAVE_WELCOME_DATA,
} from '../actionTypes'
import { fetchPowerBIData, fetchWelcomeData } from "../../services";
import { createMonthString } from '../components/dashlets/reporting/reportingDataHelpers'
import {
  selector_dashletSettings_currentTab_dashlet,
  selector_powerBI,
  selector_Welcome
} from '../selectors/dashletSelectors'
/**
 * Edits the settings of a dashlet
 * @param  {Object} settings dashlet settings
 * @param  {String} dashlet  dashlet reference name
 * @param  {String} tab      tab name
 * @return {Action}
 */
export function editDashletCountry(country, tab, dashlet) {
  return {
    type: EDIT_DASHLET_COUNTRY,
    payload: { tab, dashlet, setting: country },
  }
}
export function editDashletManufacturer(manufacturer, tab, dashlet) {
  return {
    type: EDIT_DASHLET_MANUFACTURER,
    payload: { tab, dashlet, setting: manufacturer },
  }
}
export function editDashletRegion(region, tab, dashlet) {
  return {
    type: EDIT_DASHLET_REGION,
    payload: { tab, dashlet, setting: region },
  }
}
export function editDashletCurrency(currency, tab, dashlet) {
  return {
    type: EDIT_DASHLET_CURRENCY,
    payload: { tab, dashlet, setting: currency },
  }
}
export function editDashletSubCategory(subCategory, tab, dashlet) {
  return {
    type: EDIT_DASHLET_SUBCATEGORY,
    payload: { tab, dashlet, setting: subCategory },
  }
}
export function editDashletPublisher(publisher, tab, dashlet) {
  return {
    type: EDIT_DASHLET_PUBLISHER,
    payload: { tab, dashlet, setting: publisher }
  }
}
export function editDashletFilters(filters, tab, dashlet) {
  return {
    type: EDIT_DASHLET_FILTERS,
    payload: { tab, dashlet, setting: filters },
  }
}
export function editDashletComparison(tab, dashlet) {
  return (dispatch, getState) => {
    const isCompared = !selector_dashletSettings_currentTab_dashlet(getState(), dashlet).isCompared
    dispatch({
      type: EDIT_DASHLET_COMPARISON,
      payload: { tab, dashlet, setting: { isCompared, disableComparison: false } },
    })
  }
}
export function editDashletSortingCategory(sortingCategory, tab, dashlet) {
  return {
    type: EDIT_DASHLET_SORTINGCATEGORY,
    payload: {
      tab,
      dashlet,
      setting: sortingCategory,
    },
  }
}
export function editDashletDateRange(dateRange, tab, dashlet) {
  const { startDate, endDate, timeFrame } = dateRange
  return (dispatch, getState) => {
    const startMonth = createMonthString(startDate.year, startDate.month + 1)
    const endMonth = createMonthString(endDate.year, endDate.month + 1)
    dispatch({
      type: EDIT_DASHLET_FILTERS,
      payload: { tab, dashlet, setting: { startMonth, endMonth } },
    })
    if (timeFrame) {
      dispatch({
        type: EDIT_DASHLET_TIMEFRAME,
        payload: { tab, dashlet, timeFrame },
      })
    }
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth()
    if (startDate.year < year - 1 || (startDate.year < year && startDate.month <= month)) {
      dispatch({
        type: EDIT_DASHLET_COMPARISON,
        payload: { tab, dashlet, setting: { isCompared: false, disableComparison: true } },
      })
    } else if (selector_dashletSettings_currentTab_dashlet(getState(), dashlet).disableComparison) {
      dispatch({
        type: EDIT_DASHLET_COMPARISON,
        payload: { tab, dashlet, setting: { isCompared: false, disableComparison: false } },
      })
    }
  }
}
export function editDashletBackText(backText, tab, dashlet) {
  return {
    type: EDIT_DASHLET_BACKTEXT,
    payload: {
      tab,
      dashlet,
      backText,
    },
  }
}

export function getWelcome() {
  return (dispatch, getState) => {
    if (selector_Welcome(getState()).hasData) {
      dispatch({ type: EXISTS_WELCOME_DATA })
      return
    }
    dispatch({ type: GET_WELCOME_DATA })
    fetchWelcomeData().then(response => {
      dispatch({ type: SAVE_WELCOME_DATA, payload: response.data})
    })
  }
}

export function getPowerBI(id) {
  return (dispatch, getState) => {
    if (selector_powerBI(getState(), id).hasData) {
      dispatch({ type: EXISTS_POWERBI_DATA })
      return
    }
    dispatch({ type: GET_POWERBI_DATA, payload: id })
    fetchPowerBIData(id).then(response => {
      dispatch({ type: SAVE_POWERBI_DATA, payload: { id, data: response.data } })
    })
  }
}