import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { Field } from "@insight/toolkit-react"
import Tooltip from '../../Tooltip/Tooltip'
import { t } from '@insight/toolkit-utils'

export default function DeviceEnroll({ product, updateProduct, className, hasEnrollment,  isUSSalesOrg }) {
  const {enrollment} = product
  const classes = cn('o-grid o-grid', className)
  return (
    (hasEnrollment &&  isUSSalesOrg)  &&
    <div className={classes}>
      <Field
        className=' c-fieldWrapper'
        containerClassName="u-font-size-small"
        checkboxLabel={t("Force Device Enroll")}
        checked={enrollment}
        fieldComponent={"Checkbox"}
        handleChange={() => updateProduct({
          ...product,
         enrollment: !enrollment
        })}
        key={t("Force Device Enroll")}
        name={t("Force Device Enroll")}
      />
      <Tooltip>
        {t('Use this checkbox to require enrollment for this part. Please note: If this option is selected, the user will be unable to deselect the enrollment in the cart.')}
      </Tooltip>
    </div>
  )
}

DeviceEnroll.propTypes = {
  product: PropTypes.shape({
   enrollment: PropTypes.bool,
  }),
  updateProduct: PropTypes.func,
  className: PropTypes.string,
  hasEnrollment : PropTypes.bool,
  isUSSalesOrg : PropTypes.bool
}

DeviceEnroll.defaultProps = {
  product: {},
  updateProduct: ()=>{},
  className: '',
  hasEnrollment: false,
  isUSSalesOrg : false
}
