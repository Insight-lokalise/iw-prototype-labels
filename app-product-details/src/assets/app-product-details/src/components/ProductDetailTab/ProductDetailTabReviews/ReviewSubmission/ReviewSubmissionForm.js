import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import {
  ButtonGroup,
  Button,
  Field,
  Form,
  Icon,
  Loading,
  StarRating,
} from '@insight/toolkit-react'
import {
  FieldError,
  Label,
} from '@insight/toolkit-react/lib/Form/Components/Decorators'
import { RadioGroup } from '@insight/toolkit-react/lib/Form/Components/Elements'
import { t } from '@insight/toolkit-utils'
import { ReviewsContext } from '../../../../context/reviews'

export const ReviewSubmissionForm = ({
  closeModal,
  submitReview,
  submitReviewState,
}) => {
  const { getReviewsSubmissionForm } = useContext(ReviewsContext)
  const [form, loading] = getReviewsSubmissionForm()

  const fields = form?.Data?.Fields
  const hasFormFields = fields && Object.keys(fields).length > 0
  const recommendedOptions = [
    { id: 'recommended', label: 'Yes', value: 'true' },
    { id: 'notRecommended', label: 'No', value: 'false' },
  ]

  const renderErrors = () => {
    if (!submitReviewState.errors || !submitReviewState.errors.length) {
      return null
    }
    return submitReviewState.errors.map((code) => (
      <small
        aria-live="polite"
        className="c-submit-review-modal__form-error c-form__help"
      >
        <Icon icon="alert" type="error" />
        <span className="c-submit-review-modal__form-error-text">
          {t(code)}
        </span>
      </small>
    ))
  }

  if (loading || !hasFormFields) {
    return (
      <div>
        <Loading />
      </div>
    )
  }
  const validate = (formData) => {
    const validationErrors = {}
    if (!formData.rating || formData.rating < 1) {
      validationErrors.rating = t('Required')
    }
    if (!formData.title) {
      validationErrors.title = t('Review title is required.')
    } else if (formData.title.trim().length < 5) {
      validationErrors.title = t(
        'Please enter a review title of at least 5 characters.'
      )
    }
    if (!formData.reviewText) {
      validationErrors.reviewText = t('Your review is required.')
    } else if (formData.reviewText.trim().length < 10) {
      validationErrors.reviewText = t(
        'Please enter a review of at least 10 characters.'
      )
    }
    if (!formData.userNickName) {
      validationErrors.userNickName = t('Nickname is required.')
    } else if (formData.userNickName.trim().length < 5) {
      validationErrors.userNickName = t(
        'Please enter a nickname of at least 5 characters.'
      )
    }
    if (!formData.recommended) {
      validationErrors.recommended = t('This is a required selection.')
    }
    return validationErrors
  }
  return (
    <Form
      initialValues={{
        agreedToTermsAndConditions: false,
        rating: 0,
      }}
      onSubmit={submitReview}
      skipValidateOnMount
      validateOnBlur
      validate={validate}
      render={({ handleSubmit, values }) => (
        <form
          className="c-form"
          onSubmit={handleSubmit}
          id="review-submission-form"
        >
          <h4>{t('My review')}</h4>
          {renderErrors()}
          <div className="c-form--bordered">
            <Field name="rating" id="rating">
              {({ fieldProps, meta }) => (
                <div className="c-form__element">
                  <div className="o-grid  o-grid--gutters">
                    <div className="o-grid__item o-grid__item--shrink">
                      <Label required id="rating">
                        {t('Overall rating')}
                      </Label>
                    </div>
                    <div className="o-grid__item o-grid__item--shrink">
                      <StarRating
                        containerClassName="c-star-rating"
                        editable
                        rating={0}
                        onStarClick={(value) => fieldProps.onChange(value)}
                        stars={5}
                      />
                    </div>
                    <div className="o-grid__item o-grid__item--shrink">
                      {t('(Click to rate)')}
                    </div>
                    <div className="o-grid__item">
                      {meta.touched && meta.error && (
                        <FieldError
                          className="c-form__control-error"
                          showErrorIcon
                        >
                          {meta.error}
                        </FieldError>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </Field>
            <Field
              fieldComponent="Text"
              name="title"
              id="title"
              label={t('Review title')}
              showCounter
              max={50}
              placeholder={t('Example: Great features')}
              required
              showErrorIcon
            />
            <Field
              fieldComponent="TextArea"
              name="reviewText"
              id="reviewText"
              label={t('Your review')}
              showCounter
              max={1000}
              placeholder={t(
                'Example: My team bought this a month ago and we are so happy we did…'
              )}
              required
              showErrorIcon
            />
            <Field
              fieldComponent="Text"
              name="userNickName"
              id="userNickName"
              label={t('Nickname')}
              showCounter
              max={25}
              helpText={t(
                'Enter a nickname you like. For privacy reasons do not use your full name or email address.'
              )}
              placeholder={t('Example: Robert23')}
              required
              showErrorIcon
            />
            <Field id="recommended" name="recommended">
              {({ fieldProps, meta }) => (
                <div
                  className={cn('c-form__element c-form__element--bordered', {
                    'has-error': meta.touched && meta.error,
                  })}
                >
                  <div className="o-grid  o-grid--justify-between">
                    <div className="o-grid__item ">
                      <Label required id="recommended">
                        {t('Would you recommend this product?')}
                      </Label>
                    </div>
                    <div className="o-grid__item o-grid__item--shrink">
                      <div className="c-form__control">
                        <div className="c-form__radio">
                          <RadioGroup
                            {...fieldProps}
                            options={recommendedOptions}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {meta.touched && meta.error && (
                    <FieldError className="c-form__control-error" showErrorIcon>
                      {meta.error}
                    </FieldError>
                  )}
                </div>
              )}
            </Field>
          </div>
          <div className="c-submit-review-modal__form-agreement c-form__element">
            <div className="c-form__control">
              <div className="c-checkbox__container">
                <Field
                  fieldComponent="Checkbox"
                  id="agreedToTermsAndConditions"
                  name={t('agreedToTermsAndConditions')}
                />
                <label
                  className="c-form__label  c-form__label--checkbox"
                  htmlFor="agreedToTermsAndConditions"
                >
                  {t('I agree to the')}{' '}
                  <a
                    target="blank"
                    href={`/${form.Locale}/help/terms-of-use.html`}
                  >
                    {t('terms & conditions.')}
                  </a>
                </label>
              </div>
            </div>
          </div>
          <ButtonGroup align="right">
            <Button onClick={closeModal} color="secondary">
              {t('Cancel')}
            </Button>
            <Button
              color="primary"
              isDisabled={
                !values.agreedToTermsAndConditions || submitReviewState.loading
              }
              isLoading={submitReviewState.loading}
              type="submit"
            >
              {t('Submit')}
            </Button>
          </ButtonGroup>
        </form>
      )}
    />
  )
}

ReviewSubmissionForm.propTypes = {
  closeModal: PropTypes.func.isRequired,
  submitReview: PropTypes.func.isRequired,
  submitReviewState: PropTypes.object.isRequired,
}

export default ReviewSubmissionForm
