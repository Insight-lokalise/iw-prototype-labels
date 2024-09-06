import React from 'react'
import { t } from '@insight/toolkit-utils/lib/labels'
import Button from '@insight/toolkit-react/lib/Button/Button'
import Disconnected from './../../public/disconnected.svg'

export default function NotFound(props) {
  return (
    <div className="c-page-not-found o-wrapper">
      <div className="o-grid o-grid--center c-page-not-found-row">
        <div className="o-grid__item u-1/1 u-2/3@tablet">
          <h1 tabIndex={0} className='u-text-bold'>{t("We're sorry, the page you're looking for can't be found.")}</h1>
          <p tabIndex={0}>{t('The URL you are trying to access may have changed, or the page no longer exists.')}</p>
          <Button className='u-text-bold' color="primary" href={self.origin}>{t('Back to homepage')}</Button>
        </div>
        <div className="o-grid__item u-1/1 u-1/3@tablet">
          <div className="c-image u-margin-bot-none">
            <Disconnected aria-label={t('Image describing page not found')} className="c-image__image"/>
          </div>
        </div>
      </div>
    </div>
  )
}
