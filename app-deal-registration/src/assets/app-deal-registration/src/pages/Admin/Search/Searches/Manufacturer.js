import React, { useCallback, useState, Fragment } from 'react'
import PropTypes from 'prop-types'
import { DebouncedInput } from 'components'
import { isRequired } from 'lib'
import { Field } from '@insight/toolkit-react'

export default function Manufacturer({ handleChange, manufacturers, searchFieldValue}) {
  const [isChecked, setChecked] = useState(false)
  const toggleCheckboxState = useCallback(() => {
    setChecked(checked => !checked)
  }, [])

  const displaySelectOption = () => {
	  const commonProps = {
      handleChange: handleChange,
      label: "Manufacturer",
      name: "manufacturer",
      required: true,
      validate: isRequired,
      value: searchFieldValue
    }
	  if (isChecked) {
      return (
        <DebouncedInput
          fieldComponent="Text"
          placeholder="Enter search text here"
          {...commonProps}
        />
      )
    }
    const options = manufacturers.map(({ manufacturer }) => ({ text: manufacturer }))
    return (
      <DebouncedInput
        fieldComponent="Dropdown"
        fullWidth
        options={options}
        {...commonProps}
      />
    )
  }

  if (!manufacturers || !manufacturers.length > 0) {
    return null
  }

  return (
    <Fragment>
      {displaySelectOption()}
      <Field
        checkboxLabel="Manual search"
        checked={isChecked}
        fieldComponent="Checkbox"
        handleChange={toggleCheckboxState}
        name="manualSearch"
      />
    </Fragment>
  )
}
