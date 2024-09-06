import React, {useMemo, useState} from 'react'
import { Field } from 'redux-form'
import PropTypes from 'prop-types'

import GenericFieldContents from './genericFieldContents'
import { validateEmail, validateEmails } from '../../models/Security/validation'
import { validateField } from './validateField'
import { validateDomain } from './asyncValidate';

/**
 * [IWEmailField description]
 * @param {[type]} props [description]
 * customValidations in props is array of validators
 * this will be extended to default validation of field
 */
export function IWEmailField(props) {
  const { isSharedUser, setErrorFlag, required } = props;
  const [emailFieldHasError, setEmailFieldHasError] = useState(false);
  const [emailFieldErrorMessage, setEmailFieldErrorMessage] = useState('');
  const _validateEmail = useMemo(
    () => (value) => (validateField( value, props, { customValidate: props.multiple? validateEmails : validateEmail })),
    [props.name]
  );

  const _validateEmailDomain = async(e) => {
    if(isSharedUser && required) {
      const isDomainValid = await validateDomain({userContact: {email: e.target.value }});
      try{
          if(!isDomainValid) {
            setErrorFlag(true)
            setEmailFieldHasError(true);
            setEmailFieldErrorMessage('Invalid email domain');
          } else {
            setEmailFieldHasError(false)
            setEmailFieldErrorMessage('')
            setErrorFlag(false)
          }
        } catch(error) {
          console.error(error);
          return false;
        }
    }
  }

  return (
    <Field
      component={_emailFieldContents}
      validate={_validateEmail}
      onBlur={_validateEmailDomain}
      hasError={emailFieldHasError}
      errorMessage={emailFieldErrorMessage}
      {...props}
    />
  )
}

IWEmailField.propTypes = {
	label: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	required: PropTypes.bool,
	readOnly: PropTypes.bool,
	maxLength: PropTypes.number,
	multiple: PropTypes.bool,
	customValidate: PropTypes.func,
}

IWEmailField.defaultProps = {
	label: 'Email',
	name: 'email',
  multiple: false,
}


function _emailFieldContents(field) {
	return <GenericFieldContents field={field} type='email' />
}
