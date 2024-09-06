import React from 'react'
import PropTypes from 'prop-types'
import { Field } from '@insight/toolkit-react'

export default function Checkboxes(props) {
  const { disabled, isManagerView, options, multiple, masterWebGroup } = props

  return (
    <div className="o-grid__item u-1/1 u-margin-bot">
      <div className="o-grid">
        <div className="o-grid__item">
          {options.map(({ checked, label, onChange, hideOnMultiple }) => ((label === 'Block client admin from editing' && isManagerView) ? null :
            <Field
              containerClassName={hideOnMultiple && multiple === true && "u-hide"}
              disabled={disabled}
              key={label}
              className="u-margin-bot-none"
              checkboxLabel={label}
              checked={checked}
              fieldComponent={'Checkbox'}
              handleChange={() => {
                onChange(!checked)
              }}
              name={label}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

Checkboxes.propTypes = {
  disabled: PropTypes.bool,
  isManagerView: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      checked: PropTypes.bool.isRequired,
      label: PropTypes.string.isRequired,
      onChange: PropTypes.func.isRequired,
    }).isRequired
  ).isRequired,
  multiple: PropTypes.bool.isRequired,
}

Checkboxes.defaultProps = { disabled: false, isManagerView: false }
