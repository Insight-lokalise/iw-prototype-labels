// @todo will move this design system and also include expired card logic
import React from 'react'
import cn from 'classnames'
import { t } from '@insight/toolkit-utils/lib/labels'
import { PaymentCardIcon } from '@insight/toolkit-react/lib/PaymentCardIcon'
import Icon from '@insight/toolkit-react/lib/Icon/Icon'
import { checkExpired } from './../../lib/helpers'
import { CARD_ICON_MAPPING } from '@constants'
import TextView from '@insight/toolkit-react/lib/TextView/TextView'



const PaymentCardView = (props) => {

  const { card, className, children, ...rest } = props
  const classes = cn('c-payment-card', className);
  const {
    cardNum, cardDesc, cardExpMonth, cardExpYear,
    cardHolderName, cardId, cardToken, cardType,
  } = card

  const isExpired = checkExpired(cardExpMonth, cardExpYear)

  return (
    <div className={classes} {...rest} data-private="true">
      <div className='o-grid'>
        <div className='o-grid__item u-1/1 u-1/3@desktop c-payment-card__item' >
          <div className='c-form__element  is-static'>
            <span className="c-form__label">{t('Description')}</span>
            <div className="c-form__control">
              <TextView text={cardDesc} />
            </div>
          </div>
        </div>
        <div className='o-grid__item u-1/1 u-1/3@desktop c-payment-card__item' >
          <div className='c-form__element  is-static'>
            <span className="c-form__label">{t('Card type')}</span>
            <div className="c-form__control">
              <PaymentCardIcon type={CARD_ICON_MAPPING[cardType]} />
              {cardType}
            </div>
          </div>
        </div>
        <div className='o-grid__item u-1/1 u-1/3@desktop c-payment-card__item' >
          <div className='c-form__element  is-static'>
            <span className="c-form__label">{t('Number')}</span>
            <div className="c-form__control">{cardNum}</div>
          </div>
        </div>
        <div className='o-grid__item u-1/1 u-1/3@desktop c-payment-card__item' >
          <div className='c-form__element  is-static'>
            <span className="c-form__label">{t('Exp. date')}</span>
            <div className={cn('c-form__control', { 'c-form__error u-margin-top-none': isExpired })}>
              {isExpired && <Icon type="error" icon="alert" className="c-form__error-icon" />}
              {`${cardExpMonth}/${cardExpYear}`}
            </div>
          </div>
        </div>
        <div className='o-grid__item u-1/1 u-2/3@desktop c-payment-card__item' >
          <div className='c-form__element  is-static'>
            <span className="c-form__label">{t('Cardholder name')}</span>
            <div className="c-form__control">
              <TextView text={cardHolderName} />
            </div>
          </div>
        </div>

      </div>
      {children}
    </div>
  )

}

export default PaymentCardView;
