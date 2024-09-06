import React, { Fragment }  from 'react'
import { FieldError } from "@insight/toolkit-react/lib/Form/Components/Decorators";
import { useCreateTnCContext } from '@context'
import { RichTextEditor } from '@components'
import { useRichTextContent } from '@lib'
import { t } from 'api'

export default function TnCContent() {

  const { errorValues, formValues } = useCreateTnCContext()
  const { handleTermsTextChange } = useRichTextContent()

  return(
    <Fragment>
      <RichTextEditor
        className={errorValues.content ? 'has-error' : 'test'}
        content={formValues.content}
        id={t(`content`)}
        key={'RTE-content'}
        onChange={ handleTermsTextChange }
      />
      {errorValues.content && <FieldError className="c-form__error" showErrorIcon>{t('Content cannot be empty.')}</FieldError>}
    </Fragment>
  )
}

