import React from 'react'
import PropTypes from 'prop-types'
import { FormSection } from 'redux-form'

import { t } from '@insight/toolkit-utils/lib/labels'
import {
    IWTextField,
    IWTelephoneField,
} from '../../../../libs/iw-components/iw-form'

const attentionText = t('Attention')
const phoneText = t('Phone')
const address3Text = t('Location ID/Store number')

export function AttentionFormSection({ name, requireAttentionLine, isAPAC, isEMEA }) {
    return (
        <FormSection name={name}>
            <IWTextField
                label={attentionText}
                name='attentionLine'
                maxLength={40}
                required={requireAttentionLine}
                />
            <IWTelephoneField
                label={phoneText}
                name='phone'
                isAPAC={isAPAC}
                isEMEA={isEMEA}
                />
            <IWTextField
                label={address3Text}
                name='address3'
                maxLength={40}
                />
        </FormSection>
    )
}

AttentionFormSection.propTypes = {
    name: PropTypes.string.isRequired,
    requireAttentionLine: PropTypes.bool,
    isAPAC: PropTypes.bool.isRequired,
    isEMEA: PropTypes.bool.isRequired,
}
