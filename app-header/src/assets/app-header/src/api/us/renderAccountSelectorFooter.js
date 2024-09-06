import React from 'react'
import Button from '@insight/toolkit-react/lib/Button/Button'
import { t } from '@insight/toolkit-utils'

export default function renderAccountSelectorFooter(totalAccounts) {
  return (
    totalAccounts > 20 && (
      <div className="c-header-account-menu__footer  u-text-right">
        <Button className="c-header-account-menu__footer-btn" color="inline-link" href="/insightweb/userProfile#currentAccount">
          {t('See all available accounts')} {`(${totalAccounts})`}
        </Button>
      </div>
    )
  )
}
