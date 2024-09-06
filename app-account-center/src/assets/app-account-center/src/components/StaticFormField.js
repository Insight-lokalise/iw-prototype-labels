import React from 'react'
import cn from 'classnames'

const StaticFormField = ({label, value, children, className, ...rest}) => (
  <div className={cn('c-form__element  is-static', className)} {...rest}>
    <span className="c-form__label">{label}</span>
    <div className="c-form__control">
      {value || children}
    </div>
  </div>
)

export default StaticFormField;


