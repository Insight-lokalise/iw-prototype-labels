import React, { Component } from 'react'
import { connect } from 'react-redux'

import { SBStandard } from '../../components/dashlets'
import { TAB_REPORTING, SBSHIPPING } from '../../components/constants'
import { connectReportingDashlets, standardPropTypes } from './shared/connectReportingDashlets'
import { IWLoading } from '../../../iw-components'

class SBShippingCountryContainer extends Component {
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
        sortingCategory={sortingCategory || 'country'}
        timeFrame={timeFrame}
        title={title || 'Spend by Shipping Country'}
        toggleIsCompared={editDashletComparison}
        toggleThisDashlet={toggleThisDashlet}
        type={'shipToAmount'}
      />
    ) : (
      <div className="dashlet__loading-wrapper">
        <IWLoading />
      </div>
    )
  }
}

SBShippingCountryContainer.propTypes = standardPropTypes

const { mapStateToProps, mapDispatchToProps, mergeProps } = connectReportingDashlets(SBSHIPPING)

const SBShippingCountryDashlet = {
  gridProps: { w: 1, isResizable: false },
  DashletComponent: connect(mapStateToProps, mapDispatchToProps, mergeProps)(SBShippingCountryContainer),
}

export default SBShippingCountryDashlet
