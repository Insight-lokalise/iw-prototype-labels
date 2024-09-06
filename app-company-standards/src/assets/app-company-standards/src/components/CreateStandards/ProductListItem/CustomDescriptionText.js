import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { Field } from "@insight/toolkit-react"
import { LanguageContext } from "../../../lib"

export default function CustomDescriptionText({ product, updateProduct, className }) {
  const { hasCustomDescription, customDescription } = product
  const { languages } = useContext(LanguageContext);
  const classes = cn('', className)
  return (
    <div className={classes}>
      {hasCustomDescription && languages.map(lang => (
        <Field
          key={lang}
          fieldComponent={"TextArea"}
          handleChange={e => updateProduct({ ...product, customDescription: { ...customDescription, [lang]: e.target.value } })}
          name={"customDescriptionText"}
          value={customDescription[lang]}
        />
        ))}
    </div>
  )
}

CustomDescriptionText.propTypes = {
  product: PropTypes.shape({
    hasCustomDescription: PropTypes.bool,
    customDescription: PropTypes.shape({}).isRequired,
  }),
  updateProduct: PropTypes.func,
  className: PropTypes.string
}

CustomDescriptionText.defaultProps = {
  product: {},
  updateProduct: () => { },
  className: ''
}