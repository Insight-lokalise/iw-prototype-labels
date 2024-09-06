import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Icon, Field, Tooltip } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'

import { AttachmentUpload } from '../Shared'

export function productSetFormReducer(state, { payload, type }) {
  switch (type) {
    case 'ATTACHMENT':
      return { ...state, attachment: payload }
    case 'SELECTION_TYPE':
      return { ...state, type: payload }
    case 'RESET':
      return { ...payload }
    default:
      return state
  }
}

export default function ProductSetForm({ disabled, dispatch, psID, state, webGroupId, setMultiple, setDisableQuantityChange }) {
  const enableSingleWithNoneOption = window.flags && window.flags["GNA-10010-CS-SINGLE-NONE"];
  const selectionTypeOptions = [
    { value: 'SINGLE', label: t('Single selection') },
    { value: 'MULTIPLE', label: t('Multiple selections') },
    { value: 'MANDATORY', label: t('Mandatory selections') },
  ]
  enableSingleWithNoneOption && selectionTypeOptions.splice(1,0,{ value: 'SINGLEWITHNONE', label: t('Single selection with "NONE" option') })

  selectionTypeOptions.map(({ label, value }) => ({
    className: 'u-margin-bot-none',
    id: value,
    label,
    value,
  }))
  const selectionTypeMessage = (
    <Fragment>
      <span>
        {t('Selection Type enables you to control how users purchase products from a product group.')}
        <br />
        <span className="u-text-bolded">{t('Multiple (default):')}</span>{` ${t('Users can choose more than one item for purchase.')}`}
        <br />
        <span className="u-text-bolded">{t('Single:')}</span>{` ${t('Users can only choose one item for purchase.')}`}
        <br />
        {
          enableSingleWithNoneOption &&
          <>
            <span className="u-text-bolded">
              {t('Single with "NONE" option:')}
            </span>
            {` ${t('Users can only choose one item for purchase.')}`}
          </>
        }
        <br />
        <span className="u-text-bolded">{t('Mandatory:')}</span>{` ${t('A user must select an item from the product set.')}`}
      </span>
    </Fragment>
  );
  return (
    <div className="o-grid o-grid--gutters u-margin-bot">
      <div className="o-grid__item u-1/1  u-1/2@tablet">
        <Field
          disabled={disabled}
          value={state.type}
          fieldComponent={"RadioGroup"}
          handleChange={e => {
            dispatch({ type: "SELECTION_TYPE", payload: e.target.value });
            if (e.target.value === "MULTIPLE") {
              setMultiple(true);
              setDisableQuantityChange(false);
            } else {
              setMultiple(false);
            }
          }}
          id={"Selection type"}
          label={
            <span className="o-grid o-grid--full-height o-grid--center">
              {t("Selection type")}
              <span className="u-margin-left-tiny">
                <Tooltip
                  className="c-cs-product-set__tooltip"
                  position="bottom"
                  content={selectionTypeMessage}
                >
                  <Icon icon="help-circle" type="info" />
                </Tooltip>
              </span>
            </span>
          }
          name={"selectionType"}
          options={selectionTypeOptions}
        />
      </div>
      {/* attachment upload has been commented out to retain until post-pilot CS */}
      <div className="o-grid__item u-1/1  u-1/2@tablet u-text-right">
        <AttachmentUpload
          disabled={disabled}
          fileUrl={state.attachment}
          psID={psID}
          setFileUrl={url => {
            dispatch({ type: 'ATTACHMENT', payload: url })
          }}
          webGroupId={webGroupId}
        >
          {disabled ? null : (
            <div className="c-button  c-button--secondary has-icon">
              <span className="c-button__content">
                <span className="c-button__text">{t('Add an attachment')}</span>
                <Icon icon="attach" className="c-button__icon c-button__icon--right" />
              </span>
            </div>
          )}
        </AttachmentUpload>
      </div>
    </div>
  );
}

ProductSetForm.propTypes = {
  disabled: PropTypes.bool,
  dispatch: PropTypes.func.isRequired,
  psID: PropTypes.string.isRequired,
  state: PropTypes.shape({
    type: PropTypes.string.isRequired,
  }).isRequired,
  webGroupId: PropTypes.number.isRequired,
  setMultiple: PropTypes.func.isRequired,
  setDisableQuantityChange: PropTypes.func.isRequired,
}

ProductSetForm.defaultProps = { disabled: false }