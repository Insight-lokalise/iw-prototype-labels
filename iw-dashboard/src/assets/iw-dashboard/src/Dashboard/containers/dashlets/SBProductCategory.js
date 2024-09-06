import React, { Component } from 'react'
import { connect } from 'react-redux'

import { SBStandard } from '../../components/dashlets'
import { TAB_REPORTING, SBPRODUCT } from '../../components/constants'
import { connectReportingDashlets, standardPropTypes } from './shared/connectReportingDashlets'
import { IWLoading } from '../../../iw-components'

class SBProductCategoryContainer extends Component {
  constructor(props) {
    super(props)
    this.handleBackButton = this.handleBackButton.bind(this)
    this.handleBarClick = this.handleBarClick.bind(this)
    this.handleCurrencyDropdown = this.handleCurrencyDropdown.bind(this)
    this.handleCountryDropdown = this.handleCountryDropdown.bind(this)
    this.handleRegionDropdown = this.handleRegionDropdown.bind(this)
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
      dashletSettings: { subCategory, region, country },
    } = this.props
    const currency = currencyObject ? currencyObject.value : currencyCode
    editDashletCurrency(currency)
    getRawData(buildFetchPath(currency, subCategory, region, country))
  }
  /**
   * Saves the selected region and requests rawData based on the selection
   * @param  {Object} regionObject Object returned by IWSelect
   */
  handleRegionDropdown(regionObject) {
    const {
      getRawData,
      editDashletRegion,
      editDashletCountry,
      userData: { currencyCode },
      dashletSettings: { subCategory, currency },
    } = this.props
    const region = regionObject && regionObject.value
    editDashletRegion(region)
    editDashletCountry(null)
    getRawData(buildFetchPath(currency || currencyCode, subCategory, region, null))
  }
  /**
   * Saves the selected country and requests rawData based on the selection
   * @param  {Object} countryObject Object returned by IWSelect
   */
  handleCountryDropdown(countryObject) {
    const {
      getRawData,
      editDashletCountry,
      userData: { currencyCode },
      dashletSettings: { subCategory, currency, region },
    } = this.props
    const country = countryObject && countryObject.value
    editDashletCountry(country)
    getRawData(buildFetchPath(currency || currencyCode, subCategory, region, country))
  }
  /**
   * Saves the subCategory
   * @param  {String} subCategory The categorical value of the bar the user clicked
   */
  handleBarClick(newSubCategory) {
    const {
      getRawData,
      editDashletSubCategory,
      editDashletBackText,
      userData: { currencyCode },
      dashletSettings: { subCategory, currency, region, country },
    } = this.props
    if (!subCategory) {
      editDashletSubCategory(newSubCategory)
      editDashletBackText([newSubCategory])
      getRawData(buildFetchPath(currency || currencyCode, newSubCategory, region, country))
    }
  }
  /**
   * Returns bar chart to previous drill down status
   */
  handleBackButton() {
    const {
      getRawData,
      editDashletSubCategory,
      editDashletBackText,
      userData: { currencyCode },
      dashletSettings: { currency, region, country },
    } = this.props
    editDashletSubCategory(null)
    editDashletBackText(null)
    getRawData(buildFetchPath(currency || currencyCode, null, region, country))
  }

  render() {
    const {
      userData,
      editDashletComparison,
      editDashletDateRange,
      dashletSettings,
      title,
      toggleThisDashlet,
      responses: { regions, countries, currencies, hasData, initialLoad, ...rawData },
    } = this.props
    const {
      isCompared,
      disableComparison,
      filters,
      sortingCategory,
      backText,
      region,
      country,
      subCategory,
      timeFrame,
    } = dashletSettings
    const currency = dashletSettings.currency || userData.currencyCode
    const fetchPath = buildFetchPath(currency, subCategory, region, country)
    const dropdowns = initialLoad && [
      {
        label: 'Region',
        value: region,
        options: regions,
        onChange: this.handleRegionDropdown,
        placeholder: 'All',
      },
      {
        label: 'Country',
        value: country,
        options: countries[region || 'all'],
        onChange: this.handleCountryDropdown,
        placeholder: 'All',
      },
    ]
    return initialLoad ? (
      <SBStandard
        backText={backText ? backText[backText.length - 1] : undefined}
        currencies={currencies}
        currency={currency && { label: currency, value: currency }}
        dashletData={userData}
        disableComparison={disableComparison}
        dropdowns={dropdowns}
        filters={filters}
        handleBarClick={this.handleBarClick}
        handleBackButton={this.handleBackButton}
        handleCurrencyDropdown={this.handleCurrencyDropdown}
        handleDateChange={editDashletDateRange}
        hasData={hasData}
        isCompared={!!isCompared}
        rawData={rawData[fetchPath]}
        sortingCategory={sortingCategory || 'category'}
        subCategory={subCategory}
        timeFrame={timeFrame}
        title={title || 'Spend by Product Category'}
        toggleIsCompared={editDashletComparison}
        toggleThisDashlet={toggleThisDashlet}
        type={'amount'}
      />
    ) : (
      <div className="dashlet__loading-wrapper">
        <IWLoading />
      </div>
    )
  }
}

SBProductCategoryContainer.propTypes = standardPropTypes

const { mapStateToProps, mapDispatchToProps, mergeProps } = connectReportingDashlets(SBPRODUCT)

const SBProductCategoryDashlet = {
  gridProps: { w: 1, isResizable: false },
  DashletComponent: connect(mapStateToProps, mapDispatchToProps, mergeProps)(SBProductCategoryContainer),
}

/**
 * Builds a unique string to acceess the appropriate raw data
 * @param  {String} currency    currency code
 * @param  {String} subCategory selected subcategory or null
 * @param  {String} region      selected region or null
 * @param  {String} country     selected country or null
 * @return {String}             unique string to get appropriate data from back-end or redux
 */
function buildFetchPath(currency, category, region, country) {
  const areaPath = (country && `/country/${country}`) || (region && `/region/${region}`) || ''
  const categoryPath = category ? `SubCategories/${category.replace(/\//g, '%2F')}` : `Categories`
  return `getSpentBy${categoryPath}${areaPath}/${currency}`
}

export default SBProductCategoryDashlet
