import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { SBStandard } from '../../components/dashlets'
import { TAB_REPORTING, SBMANUFACTURER } from '../../components/constants'
import { connectReportingDashlets, standardPropTypes } from './shared/connectReportingDashlets'
import { IWLoading } from '../../../iw-components'

class SBManufacturerContainer extends Component {
  constructor(props) {
    super(props)
    this.handleBackButton = this.handleBackButton.bind(this)
    this.handleBarClick = this.handleBarClick.bind(this)
    this.handleCurrencyDropdown = this.handleCurrencyDropdown.bind(this)
  }
  /**
   * Set to get initial data from back-end
   */
  componentDidMount() {
    const { getRawData, userData: { currencyCode } } = this.props
    getRawData(buildFetchPath(currencyCode))
  }

  /**
   * Saves the selected currency and requests rawData based on the selection
   * @param  {Object} currencyObject Object returned by IWSelect
   */
  handleCurrencyDropdown(currencyObject) {
    const {
      getRawData,
      editDashletCurrency,
      userData: { currencyCode },
      dashletSettings: { manufacturer },
    } = this.props
    const currency = currencyObject ? currencyObject.value : currencyCode
    editDashletCurrency(currency)
    getRawData(buildFetchPath(currency, manufacturer))
  }
  /**
   * Saves the manufacturer selection
   * @param  {String} selection The categorical value of the bar the user clicked
   */
  handleBarClick(selection) {
    const {
      getRawData,
      editDashletManufacturer,
      editDashletSortingCategory,
      editDashletBackText,
      userData: { currencyCode },
      dashletSettings: { currency, manufacturer },
    } = this.props
    if (!manufacturer) {
      editDashletManufacturer(selection)
      editDashletSortingCategory('category')
      editDashletBackText([selection])
      getRawData(buildFetchPath(currency || currencyCode, selection))
    }
  }
  /**
   * Returns bar chart to previous drill down status
   */
  handleBackButton() {
    const {
      getRawData,
      editDashletManufacturer,
      editDashletSortingCategory,
      editDashletBackText,
      userData: { currencyCode },
      dashletSettings: { currency },
    } = this.props
    editDashletManufacturer(null)
    editDashletSortingCategory('manufacturer')
    editDashletBackText(null)
    getRawData(buildFetchPath(currency || currencyCode))
  }

  render() {
    const {
      userData,
      editDashletComparison,
      editDashletDateRange,
      dashletSettings,
      title,
      toggleThisDashlet,
      responses: { currencies, hasData, initialLoad, ...rawData },
    } = this.props
    const {
      backText,
      isCompared,
      disableComparison,
      filters,
      sortingCategory,
      manufacturer,
      subCategory,
      timeFrame,
    } = dashletSettings
    const currency = dashletSettings.currency || userData.currencyCode
    const fetchPath = buildFetchPath(currency, manufacturer)
    return initialLoad ? (
      <SBStandard
        backText={backText ? backText[backText.length - 1] : undefined}
        currencies={currencies}
        currency={currency && { label: currency, value: currency }}
        dashletData={userData}
        disableComparison={disableComparison}
        filters={filters}
        handleBarClick={this.handleBarClick}
        handleBackButton={this.handleBackButton}
        handleCurrencyDropdown={this.handleCurrencyDropdown}
        handleDateChange={editDashletDateRange}
        hasData={hasData}
        isCompared={!!isCompared}
        rawData={rawData[fetchPath]}
        sortingCategory={sortingCategory || 'manufacturer'}
        subCategory={subCategory}
        timeFrame={timeFrame}
        title={title || 'Top 10 Manufacturers'}
        toggleIsCompared={editDashletComparison}
        type={'amount'}
        toggleThisDashlet={toggleThisDashlet}
      />
    ) : (
      <div className="dashlet__loading-wrapper">
        <IWLoading />
      </div>
    )
  }
}

SBManufacturerContainer.propTypes = standardPropTypes

const { mapStateToProps, mapDispatchToProps, mergeProps } = connectReportingDashlets(SBMANUFACTURER)

const SBManufacturerDashlet = {
  gridProps: { w: 1, isResizable: false },
  DashletComponent: connect(mapStateToProps, mapDispatchToProps, mergeProps)(SBManufacturerContainer),
}

/**
 * Builds a unique string to acceess the appropriate raw data
 * @param  {String} currency     currency code
 * @param  {String} manufacturer selected manufacturer or null
 * @return {String}              unique string to get appropriate data from back-end or redux
 */
function buildFetchPath(currency, manufacturer) {
  const categoryPath = manufacturer
    ? `Categories/manufacturer/${manufacturer.replace(/\//g, '%2F')}`
    : `TopManufacturers`
  return `getSpentBy${categoryPath}/${currency}`
}

export default SBManufacturerDashlet
