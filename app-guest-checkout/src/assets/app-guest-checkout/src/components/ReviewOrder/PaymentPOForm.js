import React from 'react';
import PropTypes from 'prop-types';
import { Field, Form } from "@insight/toolkit-react";
import Button from "@insight/toolkit-react/lib/Button/Button";
import { t } from '@insight/toolkit-utils/lib/labels'

export const PaymentPOForm = ({ onSubmit, paymentMethod, submitButtonRef, hasPOFields = false, isPONumberRequired = false, isSupressPOReleaseNumber = false }) => {
  return (
    <div>
      <Form
        initialValues={{ paymentMethod }}
        onSubmit={onSubmit}
        skipValidateOnMount
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit} className="c-form" aria-labelledby="PreferencesHeading">
            <fieldset className="c-form__group">
              {paymentMethod === 3 && (
                <div className='o-grid'>
                  <div className="o-grid__item u-1/1">
                    <label className="form__label--readonly u-text-bold u-margin-bot-tiny">
                      {t('Reporting fields')}
                    </label>
                  </div>
                  <div className="o-grid__item u-1/1">
                    <div className='o-grid o-grid--gutters-small'>
                      {/* we just need four static fields so looping arond a static array */}
                      {[0, 1, 2, 3].map((item, index) => {
                        return (
                          <div
                            key={index}
                            className="o-grid__item u-1/1 u-1/2@tablet u-1/4@desktop u-margin-bot-small"
                          >
                            <Field
                              fieldComponent='Text'
                              name={`reportingField${item}`}
                              type='text'
                              hideLabel
                              maxLength={40}
                            />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}
              <div className="o-grid o-grid--gutters-small">
                <div className='o-grid__item'>
                  <div className='o-grid o-grid--gutters-large'>
                    <div className='o-grid__item'>
                      <Field
                        fieldComponent='Text'
                        name='poNumber'
                        label={t(
                          isPONumberRequired
                            ? 'P.O. number'
                            : 'P.O. number (optional)'
                        )}
                        type="text"
                        aria-required={isPONumberRequired ? "true" : "false"}
                        showErrorIcon
                        required={isPONumberRequired}
                        data-testid={'po-number-input'}
                      />
                    </div>
                    <div className='o-grid__item' >
                      <Field
                        fieldComponent='Text'
                        name='poReleaseNumber'
                        label={t('P.O. release number (optional)')}
                        type="text"
                        minLength={6}
                        showErrorIcon
                        data-testid={'po-release-number-input'}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </fieldset>
            <Button
              buttonRef={submitButtonRef}
              color="primary"
              data-testid='po-submit-btn'
              onClick={handleSubmit}
              className="u-hide"
            >
              {t('Submit')}
            </Button>
          </form>
        )}
      />
    </div>
  );
};

PaymentPOForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  submitButtonRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  hasPOFields: PropTypes.bool,
  isPONumberRequired: PropTypes.bool,
  isSupressPOReleaseNumber: PropTypes.bool,
};

