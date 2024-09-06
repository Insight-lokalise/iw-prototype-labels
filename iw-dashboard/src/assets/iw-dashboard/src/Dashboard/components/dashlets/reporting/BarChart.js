import React from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import PropTypes from 'prop-types'
import { Currency } from "@insight/toolkit-react"
import { t } from '@insight/toolkit-utils/lib/labels'

import { color_deep_pink, color_red_fuchsia, color_turquoise, color_warm_gray_8, color_green, color_warm_gray_5 } from '../../ada_colors'

// Simplified interface for rendering a bar chart
export default function MixedBarChart({
  barKeys,
  countries,
  currencyCode,
  data,
  dataKey,
  endDate,
  handleBarClick,
  hasData,
  monthNames,
  startDate,
  vertical,
}) {
  // Finds the maximum value in the data array
  const maxValue = Math.max(
    ...data.map(entry => Math.max(...Object.values(entry).filter(value => typeof value === 'number' && !isNaN(value))))
  )
  // formats tick information to condense large numbers
  const tickFormatter = tick => {
    if (tick === 0) return tick
    const multiplierUnit = (maxValue > 999999 && 'm') || (maxValue > 999 && 'k') || null
    switch (multiplierUnit) {
      case 'k':
        return `${Math.floor(tick / 100) / 10}k`
      case 'm':
        return `${Math.floor(tick / 100000) / 10}m`
      default:
        return tick
    }
  }
  // formats dates into month names ( '2017-03' => 'Mar' )
  const monthFormatter = date => {
    const month = Number(date.slice(5)) - 1
    const startYear = Number(startDate.slice(2, 4))
    const endYear = Number(endDate.slice(2, 4))
    const year = startYear !== endYear && barKeys.length === 1 ? ` ${date.slice(2, 4)}` : ''
    return `${monthNames[month]}${year}`
  }
  // Formats values to appear as the appropriate currency
  const moneyFormatter = value => <Currency value={value} currencyCode={currencyCode} />
  // Formats country name capitalization
  const countryFormatter = country => {
    if (country.toUpperCase() === 'USCONTRACTS') return t('US Contracts')
    const splitCountry = country
      .split(' ')
      .map(word => `${word.slice(0, 1).toUpperCase()}${word.slice(1).toLowerCase()}`)
    return t(splitCountry.join(' '))
  }
  const countryCode = country => {
    const code = countries[country.toUpperCase()] || countryFormatter(country)
    return code
  }
  /**
   * Truncates labels if they are more than 6 characters long
   * @param  {String} label The originallabel
   * @return {String}       The new label
   */
  const truncater = label => {
    const newLabel = dataKey === 'country' ? countryFormatter(label) : t(label)
    if (newLabel.length < 11) {
      return newLabel
    }
    return `${newLabel.slice(0, 7)}...`
  }
  /**
   * Translates the first word of the legend labels for the SBManufacturers dashlet
   * @param  {String} label Original label
   * @return {String}       Translated Label
   */
  const translateManufacturerLabels = label => {
    const labelSplit = label.split(' ')
    labelSplit[0] = t(labelSplit[0])
    return labelSplit.join(' ')
  }
  /**
   * Establishes the upper limit for the domain on the numerical axis
   * @param  {Number} dataMax Largest value in the dataset
   * @return {Number}         Normalized number for generating convenient ticks
   */
  const maxTick = dataMax => {
    // array of numbers that, when multiplied by 1, 1000, or 1000000, create aesthetic max tick values
    const breakpoints = [
      4,
      6,
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48,
      60,
      80,
      100,
      120,
      160,
      200,
      240,
      320,
      400,
      500,
      600,
      800,
      1000,
      1200,
      1600,
      2000,
      2400,
      3000,
      4000,
      4800,
    ]
    // Determines if the breakpoints array needs to be multiplied by 1, 1000, or 1000000
    let multiplier = 1
    while (multiplier * breakpoints[29] < dataMax) {
      multiplier *= 1000
    }
    return breakpoints.reduce((acc, breakpoint) => {
      if (acc) return acc
      if (breakpoint * multiplier >= dataMax) return breakpoint * multiplier
      return 0
    }, 0)
  }
  // settings for the categorical axis
  const categoricalAxis = {
    dataKey,
    type: 'category',
    tickFormatter:
      (vertical && truncater) ||
      (dataKey === 'month' && monthFormatter) ||
      (dataKey === 'country' && countryCode) ||
      (data.length > 6 && !vertical && truncater) ||
      null,
  }
  // settings for the numerical axis
  const numericalAxis = {
    dataKey: null,
    type: 'number',
    tickFormatter,
    domain: [0, maxTick],
    allowDataOverflow: true,
  }
  // settings for XAxis
  const xAxis = {
    tick: { transform: 'translate(0, 5)' },
  }
  // settings for YAxis
  const yAxis = {
    tick: { transform: 'translate(-5, 0)' },
  }
  // optional color array
  const colors = [color_deep_pink, color_turquoise, color_warm_gray_8, color_green, color_red_fuchsia, color_warm_gray_5]
  return hasData ? (
    <ResponsiveContainer>
      <BarChart
        data={data}
        margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
        layout={vertical ? 'vertical' : 'horizontal'}
        onClick={e => handleBarClick(e.activeLabel)}
      >
        {vertical ? <XAxis {...xAxis} {...numericalAxis} /> : <XAxis {...xAxis} {...categoricalAxis} />}
        {vertical ? (
          <YAxis width={80} interval={0} {...yAxis} {...categoricalAxis} />
        ) : (
          <YAxis {...yAxis} {...numericalAxis} />
        )}
        <CartesianGrid vertical={vertical} horizontal={!vertical} stroke={'#999'} />
        <Tooltip
          labelFormatter={
            (dataKey === 'month' && monthFormatter) || (dataKey === 'country' && countryFormatter) || t
          }
          formatter={moneyFormatter}
          cursor={{ fill: '#eeeeee' }}
        />
        <Legend formatter={barKeys.length > 2 ? translateManufacturerLabels : null} />
        {barKeys.map((entry, i) => (
          <Bar
            key={`${entry.dataKey}_${entry.stackId}`}
            dataKey={entry.dataKey}
            fill={entry.fill || colors[barKeys.length - 1 - i]}
            stackId={entry.stackId}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  ) : (
    <p className="dashlet__no-data-message">{t('There is no data for this selection')}</p>
  )
}

MixedBarChart.propTypes = {
  barKeys: PropTypes.arrayOf(
    PropTypes.shape({
      dataKey: PropTypes.string.isRequired,
      stack: PropTypes.string,
      color: PropTypes.string,
    })
  ).isRequired,
  countries: PropTypes.objectOf(PropTypes.string),
  currencyCode: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  dataKey: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  handleBarClick: PropTypes.func,
  hasData: PropTypes.bool.isRequired,
  monthNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  startDate: PropTypes.string.isRequired,
  vertical: PropTypes.bool,
}

MixedBarChart.defaultProps = {
  countries: {},
  handleBarClick: () => {},
  vertical: false,
}
