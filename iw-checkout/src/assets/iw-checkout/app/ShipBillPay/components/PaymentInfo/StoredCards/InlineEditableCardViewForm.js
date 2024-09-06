import React from 'react'
import { t } from '@insight/toolkit-utils/lib/labels'
import { reduxForm } from 'redux-form'
import { IWTextField, IWSelectField } from './../../../../../libs/iw-components/iw-form'
import { allowedMonths, allowedYears } from './../paymentInfoHelpers'
import { IWAnchor } from './../../../../../libs/iw-components'

export function InlineEditableCardView(props) {
    const card = props.card
    return (
        <form className="form" onSubmit={props.handleSubmit(props.handleFormSubmit)}>
            <div className="table__body">
                <div className="table__row">
                    <div className="row is-collapse-child align-middle">
                        <div className="column small-1 table__col"></div>
                        <div className="column table__col">
                            <div className="row align-middle">
                                <div className="column small-5 hide-for-medium">
                                    <p className="stored-cards-modal__heading">{t('Card description')}</p>
                                </div>
                                <div className="column small-7 medium-3">
                                    <p className="stored-cards-modal__text">{card.storedCardDesc}</p>
                                </div>
                                <div className="column small-5 hide-for-medium">
                                    <p className="stored-cards-modal__heading">{t('Card')}</p>
                                </div>
                                <div className="column small-7 medium-3">
                                    <IWTextField
                                        label={t('Card number')}
                                        name="storedCardToken"
                                        required
                                        hideLabel
                                        maxLength={19}
                                        size={19}
                                    />
                                </div>
                                <div className="column small-5 hide-for-medium">
                                    <p className="stored-cards-modal__heading">{t('Expiration date')}</p>
                                </div>
                                <div className="column small-7 medium-2 large-3">
                                    <div className="row row__gutter--tiny collapse">
                                        <div className="column">
                                            <IWSelectField className="form__field"
                                                placeholder={t('Month')}
                                                optionsArrayOrFunction={allowedMonths}
                                                label={t('Month')}
                                                hideLabel
                                                name='storedCardExpMonth'
                                                required />
                                        </div>
                                        <div className="column">
                                            <IWSelectField className="form__field"
                                                placeholder={t('Year')}
                                                optionsArrayOrFunction={allowedYears()}
                                                label={t('Year')}
                                                hideLabel
                                                name='storedCardExpYear'
                                                required />
                                        </div>
                                    </div>
                                </div>
                                <div className="column small-5 hide-for-medium">
                                    <p className="stored-cards-modal__heading">{t('Name on card')}</p>
                                </div>
                                <div className="column small-7 medium-expand">
                                    <p className="stored-cards-modal__text">{card.storedCardHolderName}</p>
                                </div>
                                <div className="column small-12 medium-shrink">
                                    <IWAnchor href="#" className="ion-close ion color--crimson" title={t('Cancel')} onClick={()=>props.onToggleCardEditable(card.storedCardId)}><strong className="hide-for-medium"> {t('Cancel')}</strong></IWAnchor>
                                    <IWAnchor href="#" className="ion-checkmark ion--right color--crimson" title={t('Save')} onClick={props.handleSubmit(props.handleFormSubmit)}><strong className="hide-for-medium"> {t('Save')}</strong></IWAnchor>
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
    destroyOnUnmount: false,
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
})(InlineEditableCardView)
