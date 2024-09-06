import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils'

import {
  IWMonthRangePicker,
  IWOverlayAdvanced,
  IWOverlayController,
  IWOverlayBody,
  OverlayPropsProvider,
} from '../'

import TimeFrameSelection from './TimeFrameSelection'
import {
  createCustomDateState,
  createInitialState,
  createLastTwelveMonthsState,
  createYearToDateState,
  TIME_FRAME_TYPES,
} from './helpers'

/**
 * Allows the user to select a time fram with the options of Year To Date, Last 12 Months and Custom
 * NOTE: if you pass in a timeFrame prop it will ignore both startDate and endDate props
 */
export default class IWTimeFrameSelector extends Component {
  constructor(props) {
    super(props)

    const { startDate, endDate, timeFrame } = props
    this.state = { ...createInitialState({ selectedStartDate: startDate, selectedEndDate: endDate, timeFrame }) }

    this.handleYearToDateSelection = this.handleYearToDateSelection.bind(this)
    this.handleLastTwelveMonthsSelection = this.handleLastTwelveMonthsSelection.bind(this)
    this.handleCustomDateSelection = this.handleCustomDateSelection.bind(this)
    this.handleCustomDateSelectionConfirmation = this.handleCustomDateSelectionConfirmation.bind(this)
  }

  componentDidMount() {
    return this.props.onChange({
      startDate: this.state.selectedStartDate,
      endDate: this.state.selectedEndDate,
    })
  }

  /**
   * changes the selectedTimeFrame to year to date
   * @return {function} onChange prop called with { startDate, endDate }
   */
  handleYearToDateSelection() {
    const newState = createYearToDateState(this.state.currentMonth, this.state.currentYear)
    this.setState({ ...newState })
    this.props.onChange({
      startDate: newState.selectedStartDate,
      endDate: newState.selectedEndDate,
      timeFrame: newState.timeFrame,
    })
  }

  /**
   * changes the selectedTimeFrame to last 12 months
   * @return {function} onChange prop called with { startDate, endDate }
   */
  handleLastTwelveMonthsSelection() {
    const newState = createLastTwelveMonthsState(this.state.currentMonth, this.state.currentYear)
    this.setState({ ...newState })
    this.props.onChange({
      startDate: newState.selectedStartDate,
      endDate: newState.selectedEndDate,
      timeFrame: newState.timeFrame,
    })
  }

  /**
   * opens IWMonthRangePicker
   * @return {undefined}
   */
  handleCustomDateSelection() {
    this.setState({
      timeFrame: TIME_FRAME_TYPES.CUSTOM,
    })
  }

  /**
   * changes the selectedTimeFrame to year to custom based on the selection in the IWMonthRangePicker
   * @return {function} onChange prop called with { startDate, endDate }
   */
  handleCustomDateSelectionConfirmation({ start, end }) {
    const newState = createCustomDateState(this.state.currentMonth, this.state.currentYear, {
      selectedStartDate: start,
      selectedEndDate: end,
    })
    this.setState({ ...newState })
    this.props.onChange({
      startDate: newState.selectedStartDate,
      endDate: newState.selectedEndDate,
      timeFrame: newState.timeFrame,
    })
  }

  render() {
    const { monthList } = this.props
    const { currentMonth, currentYear, selectedStartDate, selectedEndDate, timeFrame } = this.state

    const periodText = t('Period')
    const yearToDateText = currentYear.toString()
    const lastTwelveMonthsText = t('Last 12 months')
    const customText = t('Custom')

    return (
      <IWOverlayAdvanced>
        <div className="iw-time-frame-selector">
          <div className="iw-time-frame-selector__table-cell hide-for-small-only">
            <h3 className="iw-time-frame-selector__heading">{periodText}:</h3>
          </div>
          <div className="iw-time-frame-selector__table-cell">
            <TimeFrameSelection
              onClick={this.handleYearToDateSelection}
              selected={timeFrame === TIME_FRAME_TYPES.YEAR_TO_DATE}
              text={yearToDateText}
            />
          </div>
          <div className="iw-time-frame-selector__table-cell">
            <TimeFrameSelection
              onClick={this.handleLastTwelveMonthsSelection}
              selected={timeFrame === TIME_FRAME_TYPES.LAST_TWELVE_MONTHS}
              text={lastTwelveMonthsText}
            />
          </div>
          <div className="iw-time-frame-selector__table-cell">
            <IWOverlayController onClick={this.handleCustomDateSelection}>
              <TimeFrameSelection isLink={false} selected={timeFrame === TIME_FRAME_TYPES.CUSTOM} text={customText} />
              {timeFrame === TIME_FRAME_TYPES.CUSTOM && (
                <div className="iw-time-frame-selector__custom hide-for-small-only">
                  {`${monthList[selectedStartDate.month]} ${selectedStartDate.year} - ${
                    monthList[selectedEndDate.month]
                  } ${selectedEndDate.year}`}
                </div>
              )}
            </IWOverlayController>
          </div>
        </div>
        <div className="iw-time-frame-selector__separator">
          <IWOverlayController onClick={this.handleCustomDateSelection}>
            {timeFrame === TIME_FRAME_TYPES.CUSTOM && (
              <div className="iw-time-frame-selector__custom">
                {`${monthList[selectedStartDate.month]} ${selectedStartDate.year} - ${
                  monthList[selectedEndDate.month]
                } ${selectedEndDate.year}`}
              </div>
            )}
          </IWOverlayController>
        </div>
        <IWOverlayBody position="bottom" className="iw-time-frame-selector__overlay" hideArrow hideHeader>
          <OverlayPropsProvider
            render={overlayProps => (
              <IWMonthRangePicker
                allowedRange={{
                  start: { month: currentMonth === 11 ? 0 : currentMonth + 1, year: currentYear - 2 },
                  end: { month: currentMonth, year: currentYear },
                }}
                monthList={monthList}
                onCancel={overlayProps.iwOverlay.unmountOverlay}
                onConfirm={date => {
                  overlayProps.iwOverlay.unmountOverlay()
                  this.handleCustomDateSelectionConfirmation(date)
                }}
                selectedRange={{
                  start: selectedStartDate,
                  end: selectedEndDate,
                }}
              />
            )}
          />
        </IWOverlayBody>
      </IWOverlayAdvanced>
    )
  }
}

IWTimeFrameSelector.propTypes = {
  endDate: PropTypes.shape({
    month: PropTypes.number.isRequired,
    year: PropTypes.number.isRequired,
  }),
  monthList: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  timeFrame: PropTypes.oneOf([...Object.values(TIME_FRAME_TYPES), null]),
  startDate: PropTypes.shape({
    month: PropTypes.number.isRequired,
    year: PropTypes.number.isRequired,
  }),
}

IWTimeFrameSelector.defaultProps = {
  timeFrame: null,
}
