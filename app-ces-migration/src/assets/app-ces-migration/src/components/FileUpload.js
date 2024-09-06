import React, { useState } from 'react'
import cn from 'classnames'

import {FieldError, Label} from "@insight/toolkit-react/lib/Form/Components/Decorators";

export default function FileUpload(props) {
  const {fieldProps, meta} = props
  const {onChange, value, ...rest} = fieldProps
  const handleOnChange = (e) => {
    onChange(e.target.files[0])
  }


  return (
      <div className={cn('c-form__element c-form__element--bordered', {
        'has-error': (meta.touched && meta.error)
      })}>
        <Label id="file">{'File upload'}</Label>
        <div className="c-form__control">
          <input className="c-input" type="file" {...rest} onChange={handleOnChange} accept={'text/csv'}/>
          <div className="o-grid c-form__element-meta">
            <div className="o-grid__item ">
              {(meta.touched && meta.error) &&
                <FieldError className="c-form__error">{meta.error}</FieldError>}
            </div>
          </div>
        </div>
      </div>
  )
}
