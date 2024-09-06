import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'

import DuplicateButton from './DuplicateButton'
import ROUTES from '../Shared/constants'

export default function FormNavButtons(props, { router }) {
  const {
    allowContinue,
    currentStepIndex,
    isLastStep,
    isManagerView,
    validNextStep,
    onSubmit,
    setCurrentStepIndex
  } = props
  const isFirstStep = currentStepIndex === (isManagerView ? 1 : 0)

  const handleClick = () => {
    if (validNextStep()) {
      setCurrentStepIndex(currentStepIndex + 1)
    }
  }

  const handleSubmit = async () => {
    if (validNextStep()) {
      onSubmit()
    }
  }

  return (
    <div className="o-grid__item u-1/1 u-padding-top u-text-right">
      <Button
        className="u-margin-right"
        color="secondary"
        onClick={() => router.history.push(ROUTES.STANDARDS)}
      >
        {t('Cancel')}
      </Button>
      {!isFirstStep && (
        <Button
          className="u-margin-right"
          color="secondary"
          onClick={() => {
            setCurrentStepIndex(currentStepIndex - 1)
          }}
        >
          {t('Back')}
        </Button>
      )}
      {!isLastStep && (
        <Button
          color="primary"
          isDisabled={!allowContinue}
          onClick={handleClick}
        >
          {t('Continue')}
        </Button>
      )}
      {isLastStep && <DuplicateButton isDisabled={!allowContinue} onSubmit={handleSubmit} />}
    </div>
  )
}

FormNavButtons.propTypes = {
  allowContinue: PropTypes.bool.isRequired,
  currentStepIndex: PropTypes.number.isRequired,
  isLastStep: PropTypes.bool.isRequired,
  isManagerView: PropTypes.bool.isRequired,
  validNextStep: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  setCurrentStepIndex: PropTypes.func.isRequired,
}

FormNavButtons.contextTypes = {
  router: PropTypes.shape({
    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    }),
  }),
};