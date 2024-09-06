import React, { Component } from 'react'
import { connect } from 'react-redux'

import { SBStandard } from '../../components/dashlets'
import { TAB_REPORTING, SBMONTH } from '../../components/constants'
import { connectReportingDashlets, standardPropTypes } from './shared/connectReportingDashlets'
import { IWLoading } from '../../../iw-components'

class SBMonthContainer extends Component {
  constructor(props) {
    super(props)
    this.handleBarClick = this.handleBarClick.bind(this)
    this.handleBackButton = this.handleBackButton.bind(this)
    this.handleCurrencyDropdown = this.handleCurrencyDropdown.bind(this)
  }
  /**
   * Set to get initial data from back-end
   */
  componentDidMount() {
    const { getRawData, userData: { currencyCode } } = this.props
    getRawData(currencyCode)
  }

  handleBarClick(dataCategory) {
    const {
      dashletSettings: { backText },
      editDashletSortingCategory,
      editDashletBackText,
      editDashletFilters,
    } = this.props
    const sortingCategory = this.props.dashletSettings.sortingCategory || 'month'
    switch (sortingCategory) {
      case 'month': {
        editDashletSortingCategory('region')
        editDashletFilters({ month: dataCategory })
        editDashletBackText([dataCategory])
        break
      }
      case 'region': {
        editDashletSortingCategory('country')
        editDashletFilters({ region: dataCategory })
        editDashletBackText([dataCategory, ...backText])
        break
      }
      default: {
        break
      }
    }
  }
  handleBackButton() {
    const {
      dashletSettings: { sortingCategory, backText },
      editDashletSortingCategory,
      editDashletBackText,
      editDashletFilters,
    } = this.props
    switch (sortingCategory) {
      case 'country': {
        editDashletSortingCategory('region')
        editDashletFilters({ region: null })
        editDashletBackText([backText[1]])
        break
      }
      case 'region': {
        editDashletSortingCategory('month')
        editDashletFilters({ month: null })
        editDashletBackText(null)
        break
      }
      default: {
        break
      }
    }
  }
  handleCurrencyDropdown(currency) {
    const { userData: { currencyCode }, getRawData, editDashletCurrency } = this.props
    const currencyValue = currency ? currency.value : currencyCode
    getRawData(currencyValue)
    editDashletCurrency(currencyValue)
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
    const { isCompared, disableComparison, filters, sortingCategory, backText, timeFrame } = dashletSettings
    const currency = dashletSettings.currency || userData.currencyCode
    return initialLoad ? (
      <SBStandard
        backText={backText ? backText[0] : undefined}
        currencies={currencies}
        currency={{ label: currency, value: currency }}
        dashletData={userData}
        disableComparison={disableComparison}
        filters={filters}
        hasData={hasData}
        handleBarClick={this.handleBarClick}
        handleBackButton={this.handleBackButton}
        handleCurrencyDropdown={this.handleCurrencyDropdown}
        handleDateChange={editDashletDateRange}
        isCompared={!!isCompared}
        rawData={rawData[currency]}
        sortingCategory={sortingCategory || 'month'}
        timeFrame={timeFrame}
        title={title || 'Spend by Month'}
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

SBMonthContainer.propTypes = standardPropTypes

const { mapStateToProps, mapDispatchToProps, mergeProps } = connectReportingDashlets(SBMONTH)

const SBMonthDashlet = {
  gridProps: { w: 1, isResizable: false },
  DashletComponent: connect(mapStateToProps, mapDispatchToProps, mergeProps)(SBMonthContainer),
}

export default SBMonthDashlet
