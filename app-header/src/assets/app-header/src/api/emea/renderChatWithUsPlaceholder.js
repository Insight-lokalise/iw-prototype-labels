import React from 'react'
import Button from '@insight/toolkit-react/lib/Button/Button'
import { t } from 'api'

function handleClick() {
  const element = document.querySelector('#LP_DIV_DSS a')
  if (element) {
    element.click()
  }
}

export default function renderChatWithUsPlaceholder() {
  return {
    children: <Button color="none" className="c-header-dropdown__link" fullWidth onClick={handleClick}>{t('Chat now')}</Button>
  }
}
