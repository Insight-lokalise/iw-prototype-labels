import React from 'react'
import PropTypes from 'prop-types'
import { IWSelect } from '../../../../iw-components'
import { t } from '@insight/toolkit-utils/lib/labels'
export default function DashletDropdowns({ dropdowns }) {
  return dropdowns ? (
    <div className="row collapse align-middle">
      {dropdowns.map(dropdown => {
        const { label, value, options, onChange, placeholder } = dropdown
        const disabled = options.length === 1
        const selection = disabled ? options[0].value : value
        return (
          <div className="column small-12 medium-6" key={label}>
            <label className="dashlet__label">
              {t(`${label}:`)}
              <IWSelect
                disabled={disabled}
                onChange={onChange}
                options={options}
                className="dashlet__select"
                value={selection}
                placeholder={placeholder}
              />
            </label>
          </div>
        )
      })}
    </div>
  ) : null
}

DashletDropdowns.propTypes = {
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
}

DashletDropdowns.defaultProps = {
  dropdowns: undefined,
}
