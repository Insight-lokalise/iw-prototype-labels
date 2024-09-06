import React, { useState } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { Field } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'
import Tooltip from "../Tooltip/Tooltip";

import AddToSetButtonContainer from '../../containers/AddToSetButtonContainer'

export default function StandardEntryTab(props) {
  const [materialIds, setMaterialIds] = useState('')
  const [quantity, setQuantity] = useState(1)

  function resetFields() {
    setMaterialIds('')
    setQuantity(1)
  }

  return (
    <div className="o-grid">
      <div className="o-grid__item u-1/1">
        <div className='o-grid'>
          <span className="c-form__label" >{t('Part number')}</span>
          <Tooltip >{t('Please separate each part by a comma when entering multiple parts.')}</Tooltip>
        </div>
      </div>
      <div className="o-grid__item u-1/1 u-margin-bot">
        <div className="o-grid o-grid--gutters">
          <div className="o-grid__item">
            <Field
              fieldComponent={"TextArea"}
              handleChange={e => {
                setMaterialIds(e.target.value);
              }}
              disabled={props.isShared}
              value={materialIds}
              className={cn('u-font-size-tiny', { 'c-cs-admin-rte-disabled': props.isShared })}
            />
          </div>
        </div>
      </div>
      <div className="o-grid__item u-1/1">
        <AddToSetButtonContainer
          materialIds={materialIds
            .split(/[,;\s]/)
            .filter(matId => matId)
            .map(matId => matId.trim())}
          onSuccess={resetFields}
          productSetId={props.productSetId}
          quantity={quantity}
          isShared={props.isShared}
        />
      </div>
    </div>
  );
}

StandardEntryTab.propTypes = {
  productSetId: PropTypes.string.isRequired,
}
