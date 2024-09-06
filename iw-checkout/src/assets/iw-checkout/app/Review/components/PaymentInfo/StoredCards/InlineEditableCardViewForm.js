import React from 'react'
import { t } from '@insight/toolkit-utils/lib/labels'
import { reduxForm } from 'redux-form'
import {
  IWTextField,
  IWSelectField,
} from './../../../../../libs/iw-components/iw-form'
import {
  allowedMonths,
  allowedYears,
  checkExpired,
} from './../paymentInfoHelpers'
import { IWAnchor } from './../../../../../libs/iw-components'

function validate({ storedCardExpMonth, storedCardExpYear }) {
  const errors = {}
  if (!storedCardExpMonth || !storedCardExpYear) {
    return errors
  }
  if (checkExpired(parseInt(storedCardExpMonth), parseInt(storedCardExpYear))) {
    errors.storedCardExpMonth = t('Invalid date')
  }
  return errors
}

export function InlineEditableCardView(props) {
  const { card, isRequisition, isCyberSource } = props
  let lastFourDigits = card.displayCardNum && card.displayCardNum.slice(-4)
  if (!card.displayCardNum) {
    lastFourDigits = card.storedCardToken && card.storedCardToken.slice(-4)
  }

  const enableCardScreening = window.flags && window.flags['GNA-9004-CS']

  return (
    <form
      className="form"
      onSubmit={props.handleSubmit(props.handleFormSubmit)}
    >
      <div className="table__body">
        <div className="table__row">
          <div className="row is-collapse-child align-middle">
            <div className="column table__col">
              <div className="row align-middle">
                <div className="column small-5 hide-for-medium">
                  <p className="stored-cards-modal__heading">
                    {t('Card description')}
                  </p>
                </div>
                <div className="column small-7 medium-3">
                  <p className="stored-cards-modal__text">
                    {card.storedCardDesc}
                  </p>
                </div>
                <div className="column small-5 hide-for-medium">
                  <p className="stored-cards-modal__heading">{t('Card')}</p>
                </div>
                <div className="column small-7 medium-3">
                  <p className="stored-cards-modal__text">
                    <span
                      className={`icon-cards icon-cards--${card.storedCardType}`}
                    />
                    {t(' ending in')} {lastFourDigits}
                  </p>
                </div>
                <div className="column small-5 hide-for-medium">
                  <p className="stored-cards-modal__heading">
                    {t('Expiration date')}
                  </p>
                </div>
                <div className="column small-7 medium-2 large-3">
                  <div className="row row__gutter--tiny collapse">
                    <div className="column">
                      <IWSelectField
                        className="form__field"
                        placeholder={t('Month')}
                        optionsArrayOrFunction={allowedMonths}
                        label={t('Month')}
                        hideLabel
                        name="storedCardExpMonth"
                        required
                      />
                    </div>
                    <div className="column">
                      <IWSelectField
                        className="form__field"
                        placeholder={t('Year')}
                        optionsArrayOrFunction={allowedYears()}
                        label={t('Year')}
                        hideLabel
                        name="storedCardExpYear"
                        required
                      />
                    </div>
                    {enableCardScreening && !isRequisition && isCyberSource && (
                      <div className="column">
                        <IWTextField
                          name="cvvNumber"
                          maxLength={4}
                          required
                          className="c-paymetric-cvv"
                          placeholder={t('CVV')}
                          errorMessage={t('Security code is required.')}
                          hideLabel
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="column small-5 hide-for-medium">
                  <p className="stored-cards-modal__heading">
                    {t('Name on card')}
                  </p>
                </div>
                <div className="column small-7 medium-expand">
                  <p className="stored-cards-modal__text">
                    {card.storedCardHolderName}
                  </p>
                </div>
                <div className="column small-12 medium-shrink">
                  <IWAnchor
                    href="#"
                    className="ion-close ion color--crimson"
                    title={t('Cancel')}
                    onClick={() =>
                      props.onToggleCardEditable(card.storedCardId)
                    }
                  >
                    <strong className="hide-for-medium"> {t('Cancel')}</strong>
                  </IWAnchor>
                  <IWAnchor
                    href="#"
                    className="ion-checkmark ion--right color--crimson"
                    title={t('Save')}
                    onClick={props.handleSubmit(props.handleFormSubmit)}
                  >
                    <strong className="hide-for-medium"> {t('Save')}</strong>
                  </IWAnchor>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
export default reduxForm({
  form: 'InlineEditableCardView',
  pure: true,
  destroyOnUnmount: true,
  enableReinitialize: true,
  keepDirtyOnReinitialize: false,
  validate,
})(InlineEditableCardView)
