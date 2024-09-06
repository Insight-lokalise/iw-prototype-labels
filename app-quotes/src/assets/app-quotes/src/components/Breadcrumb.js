import React from 'react'
import { t } from '@insight/toolkit-utils/lib/labels'
import Breadcrumbs from '@insight/toolkit-react/lib/Breadcrumbs/Breadcrumbs'
import { Link } from 'react-router-dom'
import BreadcrumbsItem from '@insight/toolkit-react/lib/Breadcrumbs/BreadcrumbsItem'
import { getShoppingRequestEnabledFlag } from '@insight/toolkit-utils/lib/helpers/getShoppingRequestEnabledFlag'
import { getCurrentLocale } from '@insight/toolkit-utils'
import { ROUTES } from '../constants'

const Breadcrumb = ({ breadcrumb, isCES, key, match, routeName, webGroupId }) => {
  const crumbRenderer = ({ name, url }) => {
    if (routeName === ROUTES.SAVE_QUOTE_CONFIRM.name) {
      return (
        <>
          {t(name)}
          {ROUTES.QUOTE_DETAIL.name && match.params.id
            ? ` #${match.params.id}`
            : ''}
        </>
      )
    }

    if (name !== routeName) return <Link to={url}>{t(name)}</Link>

    if (match?.params.id) return `${t(name)} #${match.params.id}`

    return t(name)
  }

  const locale = getCurrentLocale('insight_current_locale')

  const isShoppingReqWGEnabled = isCES && window?.flags['GNA-11686-CES-SHOPPING-CART'].indexOf(webGroupId) !== -1
  const isShoppingCartEnabled = getShoppingRequestEnabledFlag(locale, false, isShoppingReqWGEnabled)

  return (
    <div
      className="c-app-quotes__breadcrumb hide-for-print"
      data-testid="breadcrumb"
    >
      <Breadcrumbs key={key}>
        <Breadcrumbs.Item href={'/'}>{t('Home')}</Breadcrumbs.Item>
        {(routeName === ROUTES.SAVE_QUOTE.name ||
          routeName === ROUTES.SAVE_QUOTE_CONFIRM.name) && (
          <BreadcrumbsItem href={isShoppingCartEnabled ? '/insightweb/cart' : '/insightweb/viewCart' }>
            {t('Cart')}
          </BreadcrumbsItem>
        )}
        {breadcrumb.map(({ name, url }, bkey) => (
          <Breadcrumbs.Item key={bkey}>
            {crumbRenderer({ name, url })}
          </Breadcrumbs.Item>
        ))}
      </Breadcrumbs>
    </div>
  )
}

export default Breadcrumb
