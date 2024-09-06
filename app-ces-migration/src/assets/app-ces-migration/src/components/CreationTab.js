import React, {useState} from 'react'

import { Button, Form, Field, ButtonGroup } from '@insight/toolkit-react'
import { createWebgroups } from "../api";
import FileUpload from "./FileUpload";

const creationTab = ({ isWebGrp }) =>  {
  const [isLoading, setIsLoading] = useState(false)

  function validateForm(values) {
    const errors = {}
    if(values.file == '' || values.file == undefined){
      errors.file = isWebGrp ? 'Please pick a CSV of webgroups' : 'Please pick a CSV of users'
    }
    return errors
  }

  function onSubmit(values, { reset }) {
    setIsLoading(true)
    createWebgroups({values, isWebGrp}).then((data)=>{
      setIsLoading(false)
      if(data.status !== 200){
        alert(isWebGrp ? 'Error in creating webgroups' : 'Error in creating Username/passwords')
      }else{
        alert(isWebGrp ? 'Webgroup creations will be processed and results will be sent in email' : 'User creations will be processed and results will be sent in email')
      }
      reset()
    })
  }

  return(
    <div className='c-migration-tool-tab'>
      <Form
        initialValues={{
          file: undefined
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
                    name='file'
                    label={'File upload'}
                    component={FileUpload}
                    data-testid={'file-input'}
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
)}

export default creationTab
