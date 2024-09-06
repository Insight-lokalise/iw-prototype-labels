import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import Modal from '@insight/toolkit-react/lib/Modal/Modal'
import { getCurrentLocale, getRegion } from '@insight/toolkit-utils/lib/helpers/localeHelpers'
import { INSIGHT_LOCALE_COOKIE_NAME, INSIGHT_CURRENT_LOCALE_COOKIE_NAME  } from '../../../api/common/locales'
import { t } from 'api'

import IAHeaderContext from '../../../context/IAHeaderContext'

export default function InsightNewsModal(props) {
  const { onClose } = props

  const {
    headerInfo: { locale },
  } = useContext(IAHeaderContext)

  return (
    <Modal isOpen onClose={onClose} size="medium">
      <Modal.Header onClick={onClose}>{t('Insight news')}</Modal.Header>
      <Modal.Body>
        <div className="c-insight-news">
          <iframe className="c-insight-news__iframe" src={buildInsightNewsURL(locale)} title={t('Insight news')} />
        </div>
      </Modal.Body>
    </Modal>
  )
}

InsightNewsModal.propTypes = {
  onClose: PropTypes.func.isRequired,
}

function buildInsightNewsURL(locale) {
  const isEMEA = getRegion(INSIGHT_CURRENT_LOCALE_COOKIE_NAME) === 'EMEA';
  if(isEMEA){
    const insightLocale = getCurrentLocale(INSIGHT_LOCALE_COOKIE_NAME)
    return `/${insightLocale}/ecom/insight-news.html`
  }else{
    const localePathChunk = locale
      .split('_')
      .reverse()
      .join('/')
      .toLowerCase()

    return `/content/insight/${localePathChunk}/ecom/insight-news.html`
  }

}
