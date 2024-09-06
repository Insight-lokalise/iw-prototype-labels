import React from 'react'
import PropTypes from 'prop-types'
import { FormSection } from 'redux-form'

import {
    IWTextField,
    IWEmailField,
    IWTelephoneField,
} from '../../../../libs/iw-components/iw-form'

export default function ContactFormSection(props) {
    let headerText = ''
    if (props.showHeaderText) {
        headerText = <p className="columns small-12">{props.headerText} </p>
    }
    return (
        <div data-private="true">
            <FormSection className="row expanded" name={props.sectionName}>
                {headerText}
                <div className="columns small-12 medium-6 large-4">
                    <IWTextField className="form__field"
                        name='name'
                        label='Name'
                        readOnly={props.isNameReadOnly}
                        maxLength={props.nameMaxLength}
                        required/>
                </div>
                <div className="columns small-12 medium-6 large-4">
                    <IWTelephoneField className="form__field"
                        name='phone'
                        label='Phone'
                        isAPAC={props.isAPAC}
                        isEMEA={props.isEMEA}
                        readOnly={props.isPhoneReadOnly}
                        required/>
                </div>
                <div className="columns small-12 medium-6 large-4">
                    <IWEmailField className="form__field"
                        name='email'
                        label='Email'
                        readOnly={props.isEmailReadOnly}
                        isSharedUser={props.isSharedUser}
                        setErrorFlag={props.setErrorFlag}
                        required/>
                </div>
            </FormSection>
        </div>
    )
}

ContactFormSection.propTypes = {
    sectionName: PropTypes.string.isRequired,
    headerText: PropTypes.string,
    isNameReadOnly: PropTypes.bool,
    isPhoneReadOnly: PropTypes.bool,
    isEmailReadOnly: PropTypes.bool,
    nameMaxLength: PropTypes.number,
}

ContactFormSection.defaultProps = {
    isNameReadOnly: false,
    isPhoneReadOnly: false,
    isEmailReadOnly: false,
}
