import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Field } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'

import AddToSetButtonContainer from '../../containers/AddToSetButtonContainer'

export default function LabFeesTab({ options, productSetId }) {
  const [labFeeMaterialId, setLabFeeMaterialId] = useState('')

  return (
    <div className="o-grid">
      <div className="o-grid__item u-1/1 u-margin-bot">
        <Field
          fieldComponent={'Select'}
          fullWidth
          handleChange={e => {
            setLabFeeMaterialId(e.target.value)
          }}
          label={t('Lab fee')}
          name={'Lab fee'}
          options={options}
          required
          value={labFeeMaterialId}
        />
      </div>
      <div className="o-grid__item u-1/1">
        <AddToSetButtonContainer
          materialIds={[labFeeMaterialId]}
          onSuccess={() => {
            setLabFeeMaterialId('')
          }}
          productSetId={productSetId}
          quantity={1}
        />
      </div>
    </div>
  )
}

LabFeesTab.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  productSetId: PropTypes.string.isRequired,
}
