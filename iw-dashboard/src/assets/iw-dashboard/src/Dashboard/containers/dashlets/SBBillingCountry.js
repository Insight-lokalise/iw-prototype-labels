import React, { Component } from 'react'
import { connect } from 'react-redux'

import { SBStandard } from '../../components/dashlets'
import { TAB_REPORTING, SBBILLING } from '../../components/constants'
import { connectReportingDashlets, standardPropTypes } from './shared/connectReportingDashlets'
import { IWLoading } from '../../../iw-components'

class SBBillingCountryContainer extends Component {
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
    const { editDashletSortingCategory, editDashletBackText, editDashletFilters } = this.props
    const sortingCategory = this.props.dashletSettings.sortingCategory || 'country'
    switch (sortingCategory) {
      case 'country': {
        editDashletSortingCategory('month')
        editDashletFilters({ country: dataCategory })
        editDashletBackText([dataCategory])
        break
      }
      default: {
        break
      }
    }
  }
  handleBackButton() {
    const { editDashletSortingCategory, editDashletBackText, editDashletFilters } = this.props
    editDashletSortingCategory('country')
    editDashletFilters({ country: null })
    editDashletBackText(null)
  }
  handleCurrencyDropdown(currencyObject) {
    const { userData: { currencyCode }, getRawData, editDashletCurrency } = this.props
    const currency = currencyObject ? currencyObject.value : currencyCode
    getRawData(currency)
    editDashletCurrency(currency)
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
        currency={{ label: currency, value: currency }}
        currencies={currencies}
        dashletData={userData}
        disableComparison={disableComparison}
        filters={filters}
        hasData={hasData}
        handleBarClick={this.handleBarClick}
        handleBackButton={this.handleBackButton}
        handleCurrencyDropdown={this.handleCurrencyDropdown}
        handleDateChange={editDashletDateRange}
        toggleIsCompared={editDashletComparison}
        isCompared={!!isCompared}
        rawData={rawData[currency]}
        sortingCategory={sortingCategory || 'country'}
        timeFrame={timeFrame}
        title={title || 'Spend by Billing Country'}
        toggleThisDashlet={toggleThisDashlet}
        type={'billToAmount'}
      />
    ) : (
      <div className="dashlet__loading-wrapper">
        <IWLoading />
      </div>
    )
  }
}

SBBillingCountryContainer.propTypes = standardPropTypes

const { mapStateToProps, mapDispatchToProps, mergeProps } = connectReportingDashlets(SBBILLING)

const SBBillingCountryDashlet = {
  gridProps: { w: 1, isResizable: false },
  DashletComponent: connect(mapStateToProps, mapDispatchToProps, mergeProps)(SBBillingCountryContainer),
}

export default SBBillingCountryDashlet
