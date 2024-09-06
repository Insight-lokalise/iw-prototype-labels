import  React from 'react'
import { Button, ButtonGroup } from '@insight/toolkit-react'
import PropTypes from 'prop-types'

export default function FormButtons({disableSubmit, formSubmitted, viewNextStep, errorsExist, handleSubmit, submitLoading}) {
  return (
    <ButtonGroup align="right">
      <Button color="primary" isDisabled={errorsExist || disableSubmit} type="submit" onClick={handleSubmit} isLoading={submitLoading}>
        Submit
      </Button>
      {formSubmitted && <Button color="primary" onClick={viewNextStep}>Continue</Button>}
    </ButtonGroup>
  )
}

FormButtons.propTypes = {
  disableSubmit: PropTypes.bool.isRequired,
  formSubmitted: PropTypes.bool.isRequired,
  viewNextStep: PropTypes.func.isRequired,
  errorsExist: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitLoading: PropTypes.bool.isRequired
}
