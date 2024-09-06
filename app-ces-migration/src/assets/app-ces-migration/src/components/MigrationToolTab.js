import React, {useState} from 'react'

import {Form, Field, ButtonGroup, Button} from '@insight/toolkit-react'
import {validateEmail} from "@insight/toolkit-utils";
import {processWebgroups} from '../api'

import FileUpload from './FileUpload'

const MigrationToolTab = () =>  {
  const [isLoading, setIsLoading] = useState(false)
  const migrationOptions = [
    {
      text: 'Select from below',
      value: '',
    },
    {
      text: 'Opt-in',
      value: 1,
    },
    {
      text: 'Opt-out',
      value: 2,
    },
  ]

  function validateForm(values) {
    const invalidEmailError = 'Please enter a valid email address.'
    const errors = {}
    if(values.userEmail !== '' && values.userEmail !== undefined){
      const isInvalid = !validateEmail(values.userEmail)
      if(isInvalid) {
        errors.userEmail = invalidEmailError
      }
    }
    if((values.webGroups == '' || values.webGroups == undefined) && (values.file == '' || values.file == undefined)){
      // both webgroups and file is empty
      const invalidWebGroups = "Please populate webgroups text field or pick a CSV of webgroups"
      errors.webGroups = invalidWebGroups
      errors.file = invalidWebGroups
    }
    if(values.optIn == '' || values.optIn == undefined){
      const invalidOption = "Please select either opt-in or opt-out"
      errors.optIn = invalidOption
    }
    return errors
  }

  function onSubmit(values, {reset}) {
    setIsLoading(true)
    processWebgroups(values).then(()=>{
      setIsLoading(false)
      alert("Webgroups will be processed and results will be sent in email")
      reset()
    })
  }

  return <div className='c-migration-tool-tab'>
    <Form
      initialValues={{ userEmail: '',
        webGroups: '',
        file: undefined,
        optIn: ''
      }}
      onSubmit={onSubmit}
      skipValidateOnMount
      validateOnBlur={false}
      validate={validateForm}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit} className="c-form">
          <div className="o-grid  o-grid--gutters-large">
            <div className="o-grid__item  u-1/1  u-1/2@desktop  u-margin-bot">
              <fieldset className="c-form__group">
                <Field
                  fieldComponent='TextArea'
                  name='webGroups'
                  label={'Webgroups'}
                  type="text"
                  aria-required="true"
                  autoFocus
                  data-testid={'webgroups-input'}
                />
                <Field
                  fieldComponent='Text'
                  name='userEmail'
                  label={'Email'}
                  type="text"
                  aria-required="true"
                  autoFocus
                  data-testid={'email-input'}
                />
                <Field
                  name='file'
                  label={'File upload'}
                  component={FileUpload}
                  data-testid={'file-input'}
                />
                <Field
                  fieldComponent='Select'
                  name='optIn'
                  label={'Select opt in / opt out'}
                  type="select"
                  aria-required="true"
                  options={migrationOptions}
                  value={''}
                />
              </fieldset>
            </div>
          </div>

          <ButtonGroup align="right">
            <Button color="primary" onClick={handleSubmit} isDisabled={isLoading}>
              {"Submit"}
            </Button>
          </ButtonGroup>
        </form>
      )}
    />

  </div>
}

export default MigrationToolTab
