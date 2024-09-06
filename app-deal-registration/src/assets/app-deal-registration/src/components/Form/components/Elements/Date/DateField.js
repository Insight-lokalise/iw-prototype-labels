import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { isDate } from 'lib'
import DayPickerInput from 'react-day-picker/DayPickerInput'

import { formatDate, parseDate, dateFieldsFormatted, noop } from '@lib'

import 'react-day-picker/lib/style.css'

export default function DateField({
	className,
	disabled,
	id,
	name,
	onChange,
	value,
        dateFormat,
	...rest
}) {
  const stringValue = useRef('')
  const classes = cn('c-date-picker', className)
  const dateFormatValue = dateFormat || 'MM/DD/YYYY'

  const handleParse = (str, format) => {
    stringValue.current = str
    if (dateFieldsFormatted(stringValue.current)) {
      const parsed = parseDate(str, format)
      if (isDate(parsed)) {
        return parsed
      }
      return undefined
    }
  }

  const handleDayChange = (selectedDay, modifiers, {input}) => {
    const typedDay = input.value
    if (disabled) {
      return
    }
    stringValue.current = formatDate(selectedDay, dateFormatValue) || typedDay
  }

  const handleDayPickerHide = () => {
    if (stringValue.current != null) {
      onChange({
        target: {
          name,
          value: stringValue.current
        }
      })
    }
  }

  return (
    <div className={classes}>
      <DayPickerInput
        className="c-date-picker__input"
        format={dateFormatValue}
        formatDate={dateFieldsFormatted(stringValue.current) ? formatDate : noop}
        inputProps={{
          disabled: !!disabled
        }}
        onDayChange={handleDayChange}
        onDayPickerHide={handleDayPickerHide}
        parseDate={handleParse}
        placeholder={dateFormatValue}
        dayPickerProps={{
          disabled: !!disabled,
          selectedDays: value,
          disabledDays: {before: new Date(2017, 1, 1)}
        }}
        value={value}
        {...rest}
      />
    </div>
  )
}
