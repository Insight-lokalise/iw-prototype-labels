import React from 'react'
import { t } from '@insight/toolkit-utils/lib/labels'
import { Button } from '@insight/toolkit-react'

const EmptyCartMessage = (props) => {
  const { isCES, locale, isLoggedOutDefaultUser } = props
  return (
    <div className="empty-cart--container">
      {t('There are no items in your cart.')}
      {(isCES || isLoggedOutDefaultUser) && (
        <div className="empty-cart--ces-help-links">
          <Button
            color="link"
            size="small"
            href={`/content/insight-web/${locale}/shop/hardware.html`}
          >
            {t('Shop all hardware')}
          </Button>
          <Button
            color="link"
            size="small"
            href={`/content/insight-web/${locale}/shop/software.html`}
          >
            {t('Shop all software')}
          </Button>
          <Button
            color="link"
            size="small"
            href={`/content/insight-web/${locale}/shop/partner.html`}
          >
            {t('Shop all brands')}
          </Button>
        </div>
      )}
    </div>
  )
}

export default EmptyCartMessage
