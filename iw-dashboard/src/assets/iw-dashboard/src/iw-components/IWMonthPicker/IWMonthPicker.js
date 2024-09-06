import React, { Component } from 'react'
import PropTypes from 'prop-types'

import YearSelector from './YearSelector'
import MonthOption from './MonthOption'
import { createMonthString, isMonthWithinRange } from './helpers'

/**
 * A month picker
 * All references to months are zero-based integers from 0-11
 */
export default class IWMonthPicker extends Component {
  constructor(props) {
    super(props)

    const { displayYear, selection } = props

    this.state = {
      displayYear: displayYear || selection.year,
      selection,
    }

    this.handleMonthSelection = this.handleMonthSelection.bind(this)
    this.handleYearChange = this.handleYearChange.bind(this)
  }

  /**
   * used to update state and fire onChange prop
   * @param  {object} selection     {month, year}
   * @return {function}             onChange prop
   */
  handleMonthSelection(selection) {
    this.setState({ selection })
    return this.props.onChange(selection)
  }

  /**
   * changes display year
   * @param  {number} displayYear year
   * @return {function}           onYearChange props
   */
  handleYearChange(displayYear) {
    this.setState({ displayYear })
    return this.props.onYearChange(displayYear)
  }

  render() {
    const { selection } = this.state
    const {
      allowedRange,
      allowYearDecrement,
      allowYearIncrement,
      hideYearArrows,
      monthList,
      selectedRange,
    } = this.props
    const displayYear = this.props.displayYear || this.state.displayYear
    const maxMonth = allowedRange.end.month
    const maxYear = allowedRange.end.year
    const minMonth = allowedRange.start.month
    const minYear = allowedRange.start.year

    return (
      <fieldset className="iw-month-picker">
        <YearSelector
          allowYearDecrement={allowYearDecrement && displayYear > minYear}
          allowYearIncrement={allowYearIncrement && displayYear < maxYear}
          hideYearArrows={hideYearArrows}
          onChange={this.handleYearChange}
          year={displayYear}
        />
        <div className="row collapse iw-month-picker__calendar">
          {monthList.map((month, i) => {
            const monthDisplayNumber = i

            const isStartOfRange =
              selectedRange &&
              (displayYear === selectedRange.start.year && monthDisplayNumber === selectedRange.start.month)

            const isEndOfRange =
              selectedRange &&
              (displayYear === selectedRange.end.year && monthDisplayNumber === selectedRange.end.month)

            return (
              <MonthOption
                key={createMonthString(displayYear, monthDisplayNumber)}
                displayName={month}
                isDisabled={!isMonthWithinRange(maxYear, maxMonth, minYear, minMonth, monthDisplayNumber, displayYear)}
                inSelectedRange={
                  selectedRange &&
                  isMonthWithinRange(
                    selectedRange.end.year,
                    selectedRange.end.month,
                    selectedRange.start.year,
                    selectedRange.start.month,
                    monthDisplayNumber,
                    displayYear
                  )
                }
                option={{ month: monthDisplayNumber, year: displayYear }}
                onClick={this.handleMonthSelection}
                isSelected={
                  (selectedRange && (isStartOfRange || isEndOfRange)) ||
                  (!selectedRange && displayYear === selection.year && monthDisplayNumber === selection.month)
                }
              />
            )
          })}
        </div>
      </fieldset>
    )
  }
}

IWMonthPicker.propTypes = {
  allowedRange: PropTypes.shape({
    start: PropTypes.shape({
      month: PropTypes.number.isRequired,
      year: PropTypes.number.isRequired,
    }).isRequired,
    end: PropTypes.shape({
      month: PropTypes.number.isRequired,
      year: PropTypes.number.isRequired,
    }).isRequired,
  }),
  allowYearDecrement: PropTypes.bool,
  allowYearIncrement: PropTypes.bool,
  displayYear: PropTypes.oneOfType([PropTypes.number.isRequired, null]),
  hideYearArrows: PropTypes.bool,
  monthList: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  onYearChange: PropTypes.func,
  selection: PropTypes.shape({
    year: PropTypes.number.isRequired,
    month: PropTypes.number.isRequired,
  }),
  selectedRange: PropTypes.shape({
    start: PropTypes.shape({
      month: PropTypes.number.isRequired,
      year: PropTypes.number.isRequired,
    }).isRequired,
    end: PropTypes.shape({
      month: PropTypes.number.isRequired,
      year: PropTypes.number.isRequired,
    }).isRequired,
  }),
}

IWMonthPicker.defaultProps = {
  allowedRange: { start: { month: 0, year: 2010 }, end: { month: 11, year: 2100 } },
  allowYearDecrement: true,
  allowYearIncrement: true,
  displayYear: null,
  hideYearArrows: false,
  selection: {
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  },
  selectedRange: null,
  onYearChange: () => undefined,
}
