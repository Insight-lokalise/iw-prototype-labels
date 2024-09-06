import React, { useState } from "react";
import PropTypes from 'prop-types'
import { t } from "@insight/toolkit-utils/lib/labels";
import Field from '@insight/toolkit-react/lib/Form/Field/Field'
import Tooltip from '@insight/toolkit-react/lib/Tooltip/Tooltip'
import Icon from "@insight/toolkit-react/lib/Icon/Icon";

function ValueAddedServices(props) {
  const { handleVASOptionSelect, vasOptions } = props
  const initialVasValues = vasOptions.map(option => ({
    id: option.vasId,
    description: option.vasDescription,
    value: option.vasId,
    disabled: false
  }))
  const [ data, setData ] = useState(initialVasValues)
  const [ checkboxOptions, setCheckboxOptions ] = useState({})

  const selectVASOptions = ({target: {checked}}, index, option) => {
    setCheckboxOptions((state) => ({
      ...state,
      [option.id]: state[option.id]
        ? null
        : {
          id: option.id,
          checkboxLabel: option.description,
          value: option.value,
          disabled: false
        }
    }));

    /* This logic needs to be updated when the needed response is available */
    let newData = [...data]
    newData = newData.map((obj) => {
      if(option.id === 'AM' && !obj.disabled && obj.id === 'PM' || option.id === 'PM' && !obj.disabled && obj.id === 'AM') {
        return {...obj, disabled: true};
      }else{
        return {...obj, disabled: false};
      }
      return obj
    })
    setData(newData)
    handleVASOptionSelect(checked, option)
  }

  return(
      <div className='row expanded'>
        <div className='column small-12'>
          <label className="form__label">
            <span className="form__label__text">{t('Delivery Value Added Services')}</span>
            <Tooltip
              className="vas-tooltip"
              content={t('DVAS pricing estimated. Other offerings contact your insight representative.')}
              position="right"
            >
              <Icon icon="help-circle" type="info" />
            </Tooltip>
          </label>
          <div className='vas-section'>
          {data.map((option, index) => {
            return(
              <Field
                fieldComponent="Checkbox"
                type="checkbox"
                id={`vasOptionsByCarrier_${option.id}`}
                name='vasOptions'
                checked={checkboxOptions[option.id]}
                checkboxLabel={option.description}
                onChange={(e) => selectVASOptions(e, index, option)}
                value={option.value}
                disabled={option.disabled}
                className='vas-section--options'
              />
            )
          })}
          </div>
        </div>
      </div>
    )
}

export default ValueAddedServices

ValueAddedServices.propTypes = {
  handleVASOptionSelect: PropTypes.func.isRequired,
  vasOptions: PropTypes.arrayOf(PropTypes.object).isRequired
}
