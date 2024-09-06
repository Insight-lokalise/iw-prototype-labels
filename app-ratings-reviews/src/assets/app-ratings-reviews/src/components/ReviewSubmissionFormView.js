import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { Field, Form, Icon, Loading, StarRating } from '@insight/toolkit-react'
import {
  FieldError,
  Label,
} from '@insight/toolkit-react/lib/Form/Components/Decorators'
import { RadioGroup } from '@insight/toolkit-react/lib/Form/Components/Elements'
import { t } from '@insight/toolkit-utils'
import CharacterCounter from './CharacterCounter'

export default function ReviewSubmissionFormView(props) {
  const {
    agreedToTermsAndConditions,
    errors,
    handleReviewSubmission,
    hasFormFields,
    locale,
    nickNameMsg,
    reviewMsg,
    titleMsg,
    toggleTermsAndCondition,
  } = props
  const recommendedOptions = [
    { id: 'recommended', label: 'Yes', value: 'true' },
    { id: 'notRecommended', label: 'No', value: 'false' },
  ]
  return (
    <div className="c-modal-grid">
      {!hasFormFields ? (
        <div>
          <Loading />
        </div>
      ) : (
        <Form
          onSubmit={handleReviewSubmission}
          skipValidateOnMount
          validateOnBlur
          validate={(values) => {
            const errors = {}
            if (!values.rating || values.rating < 1) {
              errors.rating = t('Required')
            }
            if (!values.title) {
              errors.title = t('Review title is required.')
            } else if (values.title.trim().length < 5) {
              errors.title = t(
                'Please enter a review title of at least 5 characters.'
              )
            }
            if (!values.reviewText) {
              errors.reviewText = t('Your review is required.')
            } else if (values.reviewText.trim().length < 10) {
              errors.reviewText = t(
                'Please enter a review of at least 10 characters.'
              )
            }
            if (!values.userNickName) {
              errors.userNickName = t('Nickname is required.')
            } else if (values.userNickName.trim().length < 5) {
              errors.userNickName = t(
                'Please enter a nickname of at least 5 characters.'
              )
            }
            if (!values.recommended) {
              errors.recommended = t('This is a required selection.')
            }
            return errors
          }}
          render={({ handleSubmit }) => (
            <form
              className="c-form"
              onSubmit={handleSubmit}
              id="review-submission-form"
            >
              <h4>{t('My review')}</h4>
              {errors.map((code) => (
                <small
                  aria-live="polite"
                  className="c-submit-review-modal__form-error c-form__help"
                >
                  <Icon icon="alert" type="error" />
                  <span className="c-submit-review-modal__form-error-text">
                    {t(code)}
                  </span>
                </small>
              ))}
              <div className="c-form--bordered">
                <Field name="rating" id="rating">
                  {({ fieldProps, meta }) => (
                    <div className="c-form__element">
                      <div className="o-grid  o-grid--gutters">
                        <div className="o-grid__item o-grid__item--shrink c-review__star-rating-label">
                          <Label required id="rating">
                            {t('Overall rating')}
                          </Label>
                          <span className="u-hide@tablet">
                            &nbsp;&nbsp;{t('(Click to rate)')}
                          </span>
                          <div className="o-grid__item o-grid__item--shrink u-hide@tablet">
                            <StarRating
                              containerClassName="c-star-rating"
                              editable
                              onStarClick={(value) => {
                                fieldProps.onChange(value)
                                fieldProps.onBlur()
                              }}
                              stars={5}
                            />
                          </div>
                        </div>
                        <div className="o-grid__item o-grid__item--shrink u-show@tablet">
                          <StarRating
                            containerClassName="c-star-rating"
                            editable
                            rating={0}
                            onStarClick={(value) => {
                              fieldProps.onChange(value)
                              fieldProps.onBlur()
                            }}
                            stars={5}
                          />
                        </div>
                        <div className="o-grid__item o-grid__item--shrink u-show@tablet c-review__star-rating-help">
                          {t('(Click to rate)')}
                        </div>
                        <div className="o-grid__item">
                          <div className="c-review__star-rating-error">
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
                    </div>
                  )}
                </Field>
                <Field name="title" id="title">
                  {({ fieldProps, meta }) => (
                    <div
                      className={cn(
                        'c-form__element c-form__element--bordered',
                        {
                          'has-error': titleMsg || (meta.touched && meta.error),
                        }
                      )}
                    >
                      <Label required id="title">
                        {t('Review title')}
                      </Label>
                      <div className="c-form__control">
                        <input
                          className="c-input"
                          maxLength={50}
                          type="text"
                          placeholder={t('Example: Great features')}
                          {...fieldProps}
                        />
                        <div className="o-grid c-form__element-meta">
                          <div className="o-grid__item ">
                            {(titleMsg || (meta.touched && meta.error)) && (
                              <FieldError
                                className="c-form__control-error"
                                showErrorIcon
                              >
                                {titleMsg || meta.error}
                              </FieldError>
                            )}
                          </div>
                          <div className="o-grid__item o-grid__item--shrink">
                            <CharacterCounter
                              currentLength={fieldProps.value || ''}
                              maxLength={50}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Field>
                <Field name="reviewText" id="reviewText">
                  {({ fieldProps, meta }) => (
                    <div
                      className={cn(
                        'c-form__element c-form__element--bordered',
                        {
                          'has-error':
                            reviewMsg || (meta.touched && meta.error),
                        }
                      )}
                    >
                      <Label required id="reviewText">
                        {t('Your review')}
                      </Label>
                      <div className="c-form__control">
                        <textarea
                          className="c-input c-textarea c-review-form-text-area"
                          maxLength={1000}
                          placeholder={t(
                            'Example: My team bought this a month ago and we are so happy we did…'
                          )}
                          {...fieldProps}
                        />
                        <div className="c-form__element-meta o-grid">
                          <div className="o-grid__item">
                            {(reviewMsg || (meta.touched && meta.error)) && (
                              <FieldError
                                className="c-form__control-error"
                                showErrorIcon
                              >
                                {reviewMsg || meta.error}
                              </FieldError>
                            )}
                          </div>
                          <div className="o-grid__item o-grid__item--shrink">
                            <CharacterCounter
                              currentLength={fieldProps.value || ''}
                              maxLength={1000}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Field>
                <Field name="userNickName" id="userNickName">
                  {({ fieldProps, meta }) => (
                    <div
                      className={cn(
                        'c-form__element c-form__element--bordered',
                        {
                          'has-error':
                            nickNameMsg || (meta.touched && meta.error),
                        }
                      )}
                    >
                      <Label required id="userNickName">
                        {t('Nickname')}
                      </Label>
                      <div className="c-form__control">
                        <input
                          className="c-input"
                          maxLength={25}
                          type="text"
                          placeholder={t('Example: Robert23')}
                          {...fieldProps}
                        />
                        <div className="c-form__element-meta o-grid o-grid--justify-between">
                          <div className="o-grid__item u-1/2 c-submit-review-modal__form-microcopy">
                            {t(
                              'Enter a nickname you like. For privacy reasons do not use your full name or email address.'
                            )}
                          </div>
                          <div className="o-grid__item o-grid__item--shrink">
                            <CharacterCounter
                              currentLength={fieldProps.value || ''}
                              maxLength={25}
                            />
                          </div>
                        </div>
                        <div>
                          {(nickNameMsg || (meta.touched && meta.error)) && (
                            <FieldError
                              className="c-form__control-error"
                              showErrorIcon
                            >
                              {nickNameMsg || meta.error}
                            </FieldError>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </Field>
                <Field id="recommended" name="recommended">
                  {({ fieldProps, meta }) => (
                    <div
                      className={cn(
                        'c-form__element c-form__element--bordered',
                        {
                          'has-error': meta.touched && meta.error,
                        }
                      )}
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
                        <FieldError
                          className="c-form__control-error"
                          showErrorIcon
                        >
                          {meta.error}
                        </FieldError>
                      )}
                    </div>
                  )}
                </Field>
              </div>
              <div className="c-submit-review-modal__form-required">
                <abbr className="c-form__required" title="Required">
                  *
                </abbr>
                {t('Required field')}
              </div>
              <div className="c-submit-review-modal__form-agreement c-form__element">
                <div className="c-form__control">
                  <div className="c-checkbox__container">
                    <input
                      type="checkbox"
                      className="c-checkbox"
                      id="agreedToTermsAndConditions"
                      name="agreedToTermsAndConditions"
                      defaultChecked={agreedToTermsAndConditions}
                      onChange={toggleTermsAndCondition}
                    />
                    <label
                      className="c-form__label  c-form__label--checkbox"
                      htmlFor="agreedToTermsAndConditions"
                    >
                      {t('I agree to the')}{' '}
                      <a
                        target="blank"
                        href={`/${locale}/help/terms-of-use.html`}
                      >
                        {t('terms & conditions.')}
                      </a>
                    </label>
                  </div>
                </div>
              </div>
            </form>
          )}
        />
      )}
    </div>
  )
}

ReviewSubmissionFormView.propTypes = {
  agreedToTermsAndConditions: PropTypes.bool.isRequired,
  errors: PropTypes.arrayOf(PropTypes.string).isRequired,
  hasFormFields: PropTypes.bool.isRequired,
  locale: PropTypes.string.isRequired,
  toggleTermsAndCondition: PropTypes.func.isRequired,
}
