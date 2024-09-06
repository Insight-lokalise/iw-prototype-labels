import React from 'react'
import Button from '@insight/toolkit-react/lib/Button/Button'
import { t } from 'api'

export default function renderAccountSelectorFooter() {
  return (
    <div className="c-header-account-menu__footer  u-text-right">
      <Button className="c-header-account-menu__footer-btn" color="inline-link" href={`${window.siteHrefCurrentBase}/apps/account/index.php?a=sa`}>
          {t('See all available accounts')}
        </Button>
    </div>
  )
}
