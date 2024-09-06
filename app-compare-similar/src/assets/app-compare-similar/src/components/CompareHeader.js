// React Modules
import React from 'react'
import { Button } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'
import { useHistory } from 'react-router-dom'
import CompareSimilarOptions from './CompareSimilarOptions'

export const CompareHeader = () => {
  const history = useHistory()
  const goBack = () => history.goBack()
  return (
    <section className="c-compare-similar__header">
      <h3 className="c-compare-similar__header__title u-h3 u-text-bold u-margin-bot-tiny">
        {t('Product compare')}
      </h3>
      <Button
        className="c-compare-similar__header__back-to-search"
        color="inline-link"
        onClick={goBack}
      >
        {t('Back to search results')}
      </Button>
      <CompareSimilarOptions />
    </section>
  )
}

export default CompareHeader
