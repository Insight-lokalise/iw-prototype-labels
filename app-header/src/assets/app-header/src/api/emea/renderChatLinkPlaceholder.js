import React from 'react'
import Button from '@insight/toolkit-react/lib/Button/Button'
import { t } from 'api'

function handleClick() {
  const element = document.querySelector('#LP_DIV_DSS a')
  if (element) {
    element.click()
  }
}

export default function renderChatLinkPlaceholder() {
  return {
    children: <Button color="subtle" className="c-header-top__link" onClick={handleClick}>{t('Chat now')}</Button>
  }
}
