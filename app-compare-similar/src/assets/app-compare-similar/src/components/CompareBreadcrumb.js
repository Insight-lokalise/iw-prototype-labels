import React from 'react'
import { Breadcrumbs } from '@insight/toolkit-react'
import { t, getCurrentLocale } from '@insight/toolkit-utils'

export const CompareBreadcrumb = () => {
  const locale = getCurrentLocale('insight_locale')
  return (
    <section className="c-compare-similar__breadcrumb">
      <Breadcrumbs>
        <Breadcrumbs.Item href="/">{t('Home')}</Breadcrumbs.Item>
        <Breadcrumbs.Item href={`/${locale}/search.html`}>
          {t('Search')}
        </Breadcrumbs.Item>
        <Breadcrumbs.Item current>{t('Product compare')}</Breadcrumbs.Item>
      </Breadcrumbs>
    </section>
  )
}

export default CompareBreadcrumb
