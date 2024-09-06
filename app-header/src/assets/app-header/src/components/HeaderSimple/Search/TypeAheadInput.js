import React from 'react'
import KEY_CODES from '@insight/toolkit-utils/lib/types/keyCodes'
import PropTypes from 'prop-types'

export default function TypeAheadInput(props) {
  const { 
    name,
    handleChange, 
    handleFocus, 
    handleKeyUp, 
    placeholder, 
    value,
    hint,
    className,
    ariaLabel,
    ...rest
  } = props

  const onKeyDownHandler = (event) => {
    if (event.keyCode === KEY_CODES.TAB && hint && value != hint) {
      event.preventDefault()
      handleChange(
        {target: {value: hint}}
      )
    }
  }
  

  return (
    <div className="c-type-ahead">
      {hint &&
        <input
          name={`${name}-typeahead-hint`}
          className={`c-input ${className} c-type-ahead-hint`}
          value={hint}
          aria-label={ariaLabel}
        />
      }
      <input
        name={`${name}-typeahead-value`}
        className={`c-input ${className} c-type-ahead-input`}
        autoComplete="off"
        onChange={handleChange}
        onFocus={handleFocus}
        onClick={handleFocus}
        onKeyDown={onKeyDownHandler}
        onKeyUp={handleKeyUp}
        placeholder={placeholder}
        value={value}
        aria-label={ariaLabel}
        maxLength={275}
        {...rest}
      />
    </div>
  )
}

TypeAheadInput.propTypes = {
  name: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleFocus: PropTypes.func.isRequired,
  handleKeyUp: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  hint: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string
}

TypeAheadInput.defaultProps = {
  className: '',
  placeholder: '',
}
