import PropTypes from 'prop-types'
import React, {useState} from 'react'
import { t } from '@insight/toolkit-utils/lib/labels'
import { Button, ButtonGroup, Field, Form, Lozenge, Address } from '@insight/toolkit-react'
import Label from "@insight/toolkit-react/lib/Form/Components/Decorators/Label";
import { validatePhoneNumber } from '@insight/toolkit-utils'
import {
    overrideAddressSimple,
} from '../../../../libs/models/Address/address'

const AddressContactForm = props => {

    const {isDefaultAddress, selectedAddress, overrideFields, setOverrideFields, saveAddress} = props
    const [disableButtons, setDisableButtons] = useState(false)

    const validateForm = (formData) => {
        const errors = {}
        if(formData.phone && !validatePhoneNumber({phoneNumber: formData.phone})) {
            errors.phone = t('Please enter a valid Phone.')
        }
        return errors
    }

    const initialValues =  {
        ...overrideFields,
        selectedAddress: selectedAddress
    }

    const submitHandler = (values) => {
        setDisableButtons(true)
        //get selectedAddress from values to workaround Toolkit form submit caching issue
        const isAttentionFormFieldsChanged = overrideAddressSimple(values.selectedAddress, values)
        saveAddress({
            ...values.selectedAddress,
            ...values,
            overrideAddress: isAttentionFormFieldsChanged,
        })
        setDisableButtons(false)
        return
    }

    const updateOverrideFields = (input) => {        
        setOverrideFields(
            {
                ...overrideFields,
                [input.name]: input.value,
            }
        )
    }

    return (

        <Form
            initialValues={initialValues}
            onSubmit={submitHandler}
            validate={(formData) => validateForm(formData)}
            skipValidateOnMount
            validateOnBlur
            render={({handleSubmit}) => (
                <form onSubmit={handleSubmit} noValidate className="c-form toolkit" data-testid='add-new-form'>
                    <fieldset className="c-form__group">
                        <div className="o-grid o-grid--gutters-large">
                            <div className='o-grid__item u-1/1 u-1/2@tablet u-margin-bot'>
                            <Field
                                fieldComponent='Text'
                                name='attentionLine'
                                label={t('Contact name')}
                                type="text"
                                aria-required="true"
                                maxLength={40}
                                onBlur={e=>updateOverrideFields(e.target)}
                                data-testid={'attentionLine-input'}
                            />
                            </div>
                            <div className='o-grid__item u-1/1 u-1/2@tablet u-margin-bot'>
                                <Label id='compnay-label'>{t('Company')}</Label>
                                <div className="c-readonly">
                                    {overrideFields.companyName}
                                </div>
                            </div>
                            <div className='o-grid__item u-1/1 u-1/2@tablet u-margin-bot'>
                            <Field
                                fieldComponent='Text'
                                name='phone'
                                label={t('Phone')}
                                type="tel"
                                minLength={1}
                                maxLength={14}
                                showErrorIcon
                                onBlur={e=>updateOverrideFields(e.target)}
                                data-testid={'phone-input'}
                            />
                            </div>
                            <div className='o-grid__item u-1/1 u-1/2@tablet u-margin-bot'>
                            <label className='c-form__label'>{t('Address')}</label>
                            <Address
                                address={{
                                    address1:selectedAddress.address.address1,
                                    address2:selectedAddress.address.address2,
                                    address3:selectedAddress.address.address3,
                                    city:selectedAddress.address.city,
                                    state:selectedAddress.address.state,
                                    zipcode:selectedAddress.address.zipCode,
                                    country:selectedAddress.address.countryId,
                                }}/>
                            </div>
                            {isDefaultAddress &&
                                <div className='o-grid__item o-grid__item--shrink'>
                                    <Lozenge color='info'>{t('Default')}</Lozenge>
                                </div>
                            }
                        </div>                   
                    </fieldset>
                    <ButtonGroup align='right'>
                        <Button data-testid={'continue-button'} color="primary" isDisabled={disableButtons} type='submit'>{t('Continue')}</Button>
                    </ButtonGroup>
                </form>
            )}
        />
    )
}

export default AddressContactForm

AddressContactForm.propTypes = {
    saveAddress: PropTypes.func.isRequired,
    setOverrideFields: PropTypes.func.isRequired,
    isDefaultAddress: PropTypes.bool.isRequired,
    selectedAddress: PropTypes.object.isRequired,
    overrideFields: PropTypes.object.isRequired,
}
