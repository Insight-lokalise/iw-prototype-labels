import React from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils/lib/labels'

export function ReadOnlyAttentionFields({ selectedAddress }) {
    const attentionText = t('Attention:')
    const phoneText = t('Phone:')
    const address3Text = t('Location ID/Store number:')
    
    return selectedAddress && (
        <div>
            <span>
                <label className="form__label--readonly">
                    {attentionText}
                    <p>{selectedAddress.attentionLine}</p>
                </label>
            </span>
            <span>
                <label className="form__label--readonly">
                    {phoneText}
                    <p>{selectedAddress.phone}</p>
                </label>
            </span>
            <span>
                <label className="form__label--readonly">
                    {address3Text}
                    <p>{selectedAddress.address.address3}</p>
                </label>
            </span>
        </div>
    )
}

ReadOnlyAttentionFields.propTypes = {
    selectedAddress: PropTypes.object.isRequired,
}
