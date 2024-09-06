import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { t } from "@insight/toolkit-utils"

import { IWButton, IWMonthPicker } from '../'

import YearArrow from './YearArrow'
import MonthSelectionDisplay from './MonthSelectionDisplay'
import { createRangeStateOnMonthSelection } from './helpers'
import { START_IS_ACTIVE, END_IS_ACTIVE } from './types'

// TODO: test

/**
 * Two month pickers side by side allowing a user to select a beginning and an end
 * All references to months are zero-based integers from 0-11
 */
export default class IWMonthRangePicker extends Component {
  constructor(props) {
    super(props)
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()

    this.state = {
      allowedRange: props.allowedRange || {
        start: { month: currentMonth === 11 ? 0 : currentMonth + 1, year: currentYear - 2 },
        end: { month: currentMonth, year: currentYear },
      },
      lastDisplayYear: currentYear,
      selectedRange: props.selectedRange,
      startIsActive: true,
      endIsActive: false,
    }

    this.handleActiveSelectionChange = this.handleActiveSelectionChange.bind(this)
    this.handleYearChange = this.handleYearChange.bind(this)
    this.handleMonthSelectionChange = this.handleMonthSelectionChange.bind(this)
  }

  /**
   * changes active selection state
   * @param  {string} type
   * @return {undefined}
   */
  handleActiveSelectionChange(type) {
    this.setState(
      type === START_IS_ACTIVE
        ? {
            startIsActive: true,
            endIsActive: false,
          }
        : {
            startIsActive: false,
            endIsActive: true,
          }
    )
  }

  /**
   * updates state when user makes a selection change
   * @param  {object} selection {month, year}
   * @return {undefined}
   */
  handleMonthSelectionChange(selection) {
    const { startIsActive, endIsActive, selectedRange } = this.state
    const currentEnd = selectedRange.end
    const currentStart = selectedRange.start
    this.setState(createRangeStateOnMonthSelection(selection, currentStart, currentEnd, startIsActive, endIsActive))
  }

  /**
   * changes the lastDisplayYear state based on the changes made in the datepickers
   * @param  {number}  year        changed year
   * @return {undefined}
   */
  handleYearChange(year) {
    // onYearChange prop is called with the year that it is changed to.
    // This is a check if it is increasing or dexcreasing.
    this.setState({ lastDisplayYear: year === this.state.lastDisplayYear + 1 ? year : year + 1 })
  }

  render() {
    const { allowedRange, lastDisplayYear, selectedRange, startIsActive, endIsActive } = this.state
    const { monthList, onCancel, onConfirm } = this.props

    const allowYearDecrement = allowedRange.start.year < lastDisplayYear - 1
    const allowYearIncrement = allowedRange.end.year > lastDisplayYear

    return (
      <div>
        <div className="row align-justify iw-month-picker__wrapper">
          <div className="columns small-12 medium-6">
            <div className="iw-month-picker__selection-wrapper">
              <div className="row collapse">
                <MonthSelectionDisplay
                  displayText={`${monthList[selectedRange.start.month]} ${selectedRange.start.year}`}
                  isActive={startIsActive}
                  onClick={() => this.handleActiveSelectionChange(START_IS_ACTIVE)}
                />
                <MonthSelectionDisplay
                  displayText={`${monthList[selectedRange.end.month]} ${selectedRange.end.year}`}
                  isActive={endIsActive}
                  onClick={() => this.handleActiveSelectionChange(END_IS_ACTIVE)}
                />
              </div>
            </div>
          </div>
          <YearArrow
            isBackArrow
            handleClick={() => allowYearDecrement && this.handleYearChange(lastDisplayYear - 2)}
            enabled={allowYearDecrement}
          />
          <div className="columns small-12 medium-6 small-order-1 medium-order-3 iw-month-picker--first">
            <IWMonthPicker
              allowedRange={allowedRange}
              allowYearDecrement={false}
              allowYearIncrement={false}
              displayYear={lastDisplayYear - 1}
              hideYearArrows
              monthList={monthList}
              onChange={this.handleMonthSelectionChange}
              selectedRange={selectedRange}
              selection={selectedRange.start}
            />
          </div>
          <div className="columns small-12 medium-6 small-order-1 medium-order-3">
            <IWMonthPicker
              allowedRange={allowedRange}
              allowYearDecrement={false}
              allowYearIncrement={false}
              displayYear={lastDisplayYear}
              hideYearArrows
              monthList={monthList}
              onChange={this.handleMonthSelectionChange}
              selectedRange={selectedRange}
              selection={selectedRange.end}
            />
          </div>
          <YearArrow
            handleClick={() => allowYearIncrement && this.handleYearChange(lastDisplayYear + 1)}
            enabled={allowYearIncrement}
          />
          <div className="columns small-6 medium-3 small-order-2 medium-order-1">
            <IWButton className="small hollow expanded iw-month-picker__btn" onClick={onCancel}>
              {t('Cancel')}
            </IWButton>
          </div>
          <div className="columns small-6 medium-3 small-order-2 medium-order-1">
            <IWButton className="small expanded iw-month-picker__btn" onClick={() => onConfirm(selectedRange)}>
              {t('Apply')}
            </IWButton>
          </div>
        </div>
      </div>
    )
  }
}

IWMonthRangePicker.propTypes = {
  monthList: PropTypes.arrayOf(PropTypes.string).isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
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

IWMonthRangePicker.defaultProps = {
  allowedRange: { start: { month: 0, year: 2010 }, end: { month: 11, year: 2100 } },
  selectedRange: null,
}
