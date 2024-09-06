import React from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils/lib/labels'

import BarChart from '../../../containers/BarChart'
import StandardDashletOptions from './StandardDashletOptions'
import { formatData } from './reportingDataHelpers'
import Dashlet from '../Dashlet'
import { IWLoading, IWAnchor } from '../../../../iw-components'

function SBStandard({
  backText,
  currencies,
  currency,
  dashletData: { currencyCode, monthNames, locale },
  disableComparison,
  dropdowns,
  filters,
  handleBackButton,
  handleBarClick,
  handleCurrencyDropdown,
  handleDateChange,
  hasData,
  isCompared,
  rawData,
  sortingCategory,
  timeFrame,
  title,
  toggleIsCompared,
  toggleThisDashlet,
  type,
}) {
  const formattedData = hasData
    ? formatData(type, monthNames, rawData, isCompared, sortingCategory, filters)
    : { barChartInfo: {} }
  const { barChartInfo: { data, barKeys, dataKey }, startMonth, endMonth } = formattedData
  const currencyValue = currency ? currency.value : currencyCode
  const userLocale = currencyValue !== currencyCode ? currencyValue : locale
  const selectedStartDate =
    (startMonth && monthToObject(startMonth)) ||
    (filters && filters.startMonth && monthToObject(filters.startMonth)) ||
    undefined
  const selectedEndDate =
    (endMonth && monthToObject(endMonth)) ||
    (filters && filters.endMonth && monthToObject(filters.endMonth)) ||
    undefined
  const timeFrameProps = {
    monthList: monthNames,
    onChange: handleDateChange,
    selectedStartDate,
    selectedEndDate,
    timeFrame,
  }
  return (
    <Dashlet title={title} toggleThisDashlet={toggleThisDashlet}>
      <StandardDashletOptions
        backText={backText}
        currencies={currencies}
        currency={currency}
        currencyCode={currencyCode}
        disableComparison={disableComparison}
        dropdowns={dropdowns}
        handleBackButton={handleBackButton}
        handleCurrencyDropdown={handleCurrencyDropdown}
        handleDateChange={handleDateChange}
        isCompared={isCompared}
        monthNames={monthNames}
        timeFrameProps={timeFrameProps}
        toggleIsCompared={toggleIsCompared}
      />
      <div className="dashlet__chart-wrapper">
        {hasData ? (
          <BarChart
            barKeys={barKeys}
            currencyCode={currencyValue}
            data={data}
            dataKey={dataKey}
            endDate={endMonth}
            handleBarClick={handleBarClick}
            hasData={!!data.length}
            locale={userLocale}
            monthNames={monthNames}
            startDate={startMonth}
            vertical={vertical(sortingCategory)}
          />
        ) : (
          <div className="dashlet__loading-wrapper">
            <IWLoading />
          </div>
        )}
      </div>
      <div className="row align-middle align-justify dashlet__footer">
        <div className="column shrink">
          <IWAnchor className="dashlet__footer-link ion-document" href={'reportingLists#standard'}>
            {t('Standard reports')}
          </IWAnchor>
        </div>
        <div className="column shrink text-right">
          <span className="dashlet__footer-text">{`* ${t('Displaying current data up to previous day')}`}</span>
        </div>
      </div>
    </Dashlet>
  )
}

SBStandard.propTypes = {
  backText: PropTypes.string,
  currencies: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  currency: PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string.isRequired,
  }),
  dashletData: PropTypes.shape({
    currencyCode: PropTypes.string.isRequired,
    isLoading: PropTypes.bool,
    monthNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  disableComparison: PropTypes.bool,
  dropdowns: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          value: PropTypes.string.isRequired,
        })
      ),
      onChange: PropTypes.func.isRequired,
    })
  ),
  handleBackButton: PropTypes.func,
  handleBarClick: PropTypes.func,
  filters: PropTypes.objectOf(PropTypes.string),
  handleCurrencyDropdown: PropTypes.func.isRequired,
  handleDateChange: PropTypes.func.isRequired,
  hasData: PropTypes.bool.isRequired,
  isCompared: PropTypes.bool,
  rawData: PropTypes.arrayOf(
    PropTypes.shape({
      shipToAmount: PropTypes.number,
      billToAmount: PropTypes.number,
      amount: PropTypes.number,
      country: PropTypes.string,
      month: PropTypes.string,
      category: PropTypes.string,
    })
  ).isRequired,
  sortingCategory: PropTypes.string.isRequired,
  timeFrame: PropTypes.string,
  title: PropTypes.string.isRequired,
  toggleIsCompared: PropTypes.func.isRequired,
  toggleThisDashlet: PropTypes.func,
  type: PropTypes.string.isRequired,
}

SBStandard.defaultProps = {
  backText: undefined,
  currency: undefined,
  disableComparison: undefined,
  dropdowns: undefined,
  handleBackButton: () => {},
  handleBarClick: () => {},
  filters: {},
  isCompared: false,
  timeFrame: 'YEAR_TO_DATE',
  toggleThisDashlet: undefined,
}

/**
 * Determines if a graph should display vertically or horizontally
 * @param  {String}  sortingCategory Key being used for the categorical axis
 * @param  {Number}  length          # of data points
 * @return {Boolean}                 Whether categorical axis should be vertical
 */
function vertical(sortingCategory) {
  switch (sortingCategory) {
    case 'region':
    case 'country':
    case 'month': {
      return false
    }
    default: {
      return true
    }
  }
}
/**
 * Converts YYYY-MM to object format of IWTimeFrameSelector
 * @param  {String} month YYYY-MM format
 * @return {Object}       Contains year and month keys with numbers as values
 */
function monthToObject(month) {
  const dateArray = month.split('-')
  return { year: Number(dateArray[0]), month: Number(dateArray[1] - 1) }
}

export default SBStandard
