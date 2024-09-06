import React from 'react'

import { t } from '@insight/toolkit-utils'
import { Button } from '@insight/toolkit-react'

export default function Personalization(props) {
  const { account, isEMEA, locale, goToHashLink } = props
  const personalObject = [
    {
      title: account?.personalObj?.personalProductList ? 'personalProduct' : ``,
      href: `/insightweb/search/personalProducts`,
    },
    {
      title: account?.personalObj?.userSubscriptions ? 'userSubscriptions' : ``,
      href: isEMEA
        ? `/${locale}/content-and-resources/subscription.html`
        : `https://pages.insight.com/insight-subscription-center.html`,
      target: 'new',
    },
    {
      title:
        account?.personalObj?.userProfile ||
        account?.personalObj?.userPreferences
          ? 'userProfile'
          : ``,
      onClick: () => goToHashLink('/insightweb/userProfile#profileInfo'),
    },
  ]
  return personalObject.map((personal) => {
    if (personal?.title && !personal?.target) {
      return (
        <li>
          <Button {...personal}>{t(personal.title)}</Button>
        </li>
      )
    }
  })
}
