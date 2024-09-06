import React, {useState} from 'react'
import PropTypes from 'prop-types'
import { FieldArray } from 'redux-form'
import Button from '@insight/toolkit-react/lib/Button/Button'
import { t } from '@insight/toolkit-utils/lib/labels'
import { IWTextField, IWEmailField } from '../../../../libs/iw-components/iw-form'
import { FieldErrorMessage } from '../../../../libs/iw-components/iw-form/formSFCs'
import { handleEmailInput } from './ShippingOptionsHelpers'


export default function ShippingNotificationsView(props) {

    const { isCES, notes, canSaveASNEmails } = props
    const [showShippingNotes, setShowShippingNotes] = useState(notes ? true : false)
    const notificationsText = t('Notifications')
    const relatedNotesLabel = t('Shipping related notes')

    return (
        <fieldset className="fieldset">
            <legend className='u-hide'>
                <span>{notificationsText}</span>
            </legend>
            <div className="o-grid" data-private="true">
            {canSaveASNEmails &&
                <div className="o-grid__item">
                    <FieldArray
                        name="additionalEmails"
                        component={renderEmailInputs}
                        validate={emailArrayValidation}
                    />
                </div>}
            </div>
            {!isCES &&
                <>
                {showShippingNotes ?
                    <div className="o-grid">
                        <div className="o-grid__item u-1/1 u-1/2@tablet">
                            <IWTextField name="notes" label={relatedNotesLabel} maxLength={35} />
                        </div>
                    </div> :
                    <Button
                        className='u-text-left'
                        onClick={() => setShowShippingNotes(true)}
                        color="link"
                        icon='add'>
                        {t('Add shipping notes')}
                    </Button>
                }
                </>
            }           
        </fieldset>
    )
}

ShippingNotificationsView.propTypes = {
    canSaveASNEmails: PropTypes.bool.isRequired,
    notes: PropTypes.string.isRequired,
    isCES: PropTypes.bool.isRequired,
}

export function renderEmailInputs({ fields, meta }) {
    const fieldLabel = t('Notification email(s):')
    const removeEmailText = t('Remove email')
    const asnEmailsText = t('Add additional email')
    const fieldClass = meta.error ? 'form__field--error' : ''
    return (
        <section>
            {fields.map((name, index) =>
            <div key={index} className="o-grid">
                <div className="o-grid__item u-5/6 u-1/2@tablet">                
                    <IWEmailField
                        className={fieldClass}
                        name={name}
                        label={fieldLabel}
                        hideLabel={index > 0}
                        onChange={handleEmailInput.bind(null, fields, index)}
                    />
                </div>
                <div className="o-grid__item o-grid__item--shrink"> 
                    {index > 0 &&
                        <Button
                            className='ion__inline-input'
                            onClick={() => fields.remove(index)}
                            color='link'
                            icon='close'
                        >
                            <span className="show-for-sr">
                                {removeEmailText}
                            </span>
                        </Button>
                    }
                </div>
            </div>
            )}
            <FieldErrorMessage showError={!!meta.error} messageText={meta.error} />
            {fields && fields.length < 5 &&
                <Button
                    className='u-text-left u-margin-bot'
                    onClick={() => fields.push('')}
                    color="link"
                    icon='add'>
                    {asnEmailsText}
                </Button>
            }            
        </section>
    )
}

export function emailArrayValidation(emails) {
    const asnEmailsLengthError = t('Email addresses must total less than 256 characters')
    return emails.join(';').length > 255 ? asnEmailsLengthError : undefined
}
