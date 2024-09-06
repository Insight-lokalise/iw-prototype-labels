import React from 'react'
import ReactDOM from 'react-dom'
import ReviewSubmissionForm from './components/ReviewSubmissionForm'
import { getCurrentLocale } from '@insight/toolkit-utils/lib/helpers/localeHelpers'
import getLabels from './duck/operations'
import './scss/index.scss'

const localeValue = getCurrentLocale('insight_current_locale', 'insight_locale')
const element = document.getElementById('react-app-review-submission')
const bvInfo = {
  bvcampaignId: element.getAttribute('bvcampaignId'),
  bvuserToken: element.getAttribute('bvuserToken'),
  fingerPrint: element.getAttribute('fingerPrint'),
  locale: element.getAttribute('locale'),
  materialId: element.getAttribute('bvproductId'),
}

Promise.resolve(getLabels(localeValue)).then(() => {
  ReactDOM.render(<ReviewSubmissionForm bvInfo={bvInfo} />, element)
})
