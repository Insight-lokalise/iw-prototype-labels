import React from 'react'
import { getCurrentLocale, getRegion } from '@insight/toolkit-utils/lib/helpers/localeHelpers'
import PropTypes from 'prop-types'

import Dashlet from '../Dashlet'

export default function InsightNews({ locale, title, toggleThisDashlet }) {
  return (
    <Dashlet title={title} toggleThisDashlet={toggleThisDashlet}>
      <iframe className="insight-news" src={createInsightNewsURL(locale)} />
    </Dashlet>
  )
}

InsightNews.propTypes = {
  title: PropTypes.string,
  toggleThisDashlet: PropTypes.func,
  locale: PropTypes.string.isRequired,
}

InsightNews.defaultProps = {
  title: 'Insight news',
  toggleThisDashlet: undefined,
}

function createInsightNewsURL(locale) {
    const insightLocale = getCurrentLocale('insight_locale')
    return `/${insightLocale}/cexp/insight-news.html`
}
