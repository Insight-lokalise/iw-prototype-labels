import React from 'react'
import Button from '@insight/toolkit-react/lib/Button/Button'
import { t } from 'api'

function handleClick() {
  const element = document.querySelector('#LP_DIV_DSS a')
  if (element) {
    element.click()
  }
}

export default function renderChatMobilePlaceholder() {
  return {
    children: <Button color="none" className="c-header-nav__link" onClick={handleClick}><span className="c-header-nav__text">{t('Chat now')}</span></Button>
  }
}
