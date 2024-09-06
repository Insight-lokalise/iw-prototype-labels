import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { Field } from "@insight/toolkit-react"
import { t } from '@insight/toolkit-utils'

export default function CustomDescription({ product, updateProduct, className }) {
  const { hasCustomDescription, customDescription } = product
  const classes = cn('', className)
  return (
    <div className={classes}>
      <Field
        containerClassName="u-font-size-small"
        checkboxLabel={t("Custom description")}
        checked={hasCustomDescription}
        fieldComponent={"Checkbox"}
        handleChange={() => updateProduct({
          ...product,
          hasCustomDescription: !hasCustomDescription,
          customDescription: hasCustomDescription ? {} : customDescription
        })}
        key={"hasCustomDescription"}
        name={"hasCustomDescription"}
      />
    </div>
  )
}

CustomDescription.propTypes = {
  product: PropTypes.shape({
    hasCustomDescription: PropTypes.bool,
  }),
  updateProduct: PropTypes.func,
  className: PropTypes.string
}

CustomDescription.defaultProps = {
  product: {},
  updateProduct: ()=>{},
  className: ''
}
