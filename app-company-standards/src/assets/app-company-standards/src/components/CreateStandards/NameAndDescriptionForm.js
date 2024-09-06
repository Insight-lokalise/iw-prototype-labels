import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { Field } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'

import { LanguageContext } from '../../lib/LanguageContext'
import AssignTagsDropdownContainer from '../../containers/AssignTagsDropdownContainer'
import ImageModalButtonContainer from '../../containers/ImageModalButtonContainer'
import { FileListItem, RichTextEditor } from '../Shared'
import { TagList } from '../Shared'

export function nameAndDescriptionReducer(state, { payload, type }) {
  switch (type) {
    case 'DESCRIPTION':
      return { ...state, description: payload.description, allowEdit: payload.allowEdit }
    case 'IMAGE_URL':
      return { ...state, imageUrl: payload }
    case 'NAME':
      return { ...state, name: payload }
    case 'TAGS':
      return { ...state, tags: payload }
    case 'RESET':
      return payload
    default:
      return state
  }
}

export default function NameAndDescriptionForm({ disabled, dispatch, state, type, hideImage, enableRoutineOrder, setEnableRoutineOrder }) {
  const { languages } = useContext(LanguageContext)
  const [savable, setSavable] = useState(languages.map(() => true))
  const hasRoutineOrderFlag = window.flags && window.flags['GNA-12116-ROUTINE-ORDERS']
  const isProductGroupForm = type === "Product group"

  function rteOnChange(content, allowEdit, lang, i) {
    const newSavable = [...savable]
    newSavable[i] = allowEdit
    setSavable(newSavable)
    const payload = {
      description: { ...state.description, [lang]: content },
      allowEdit: newSavable.includes(true)
    }
    dispatch({ type: 'DESCRIPTION', payload })
  }

  return (
    <div>
      <div className="o-grid o-grid--gutters u-margin-bot">
        <div className="o-grid__item u-1/1 u-1/2@tablet">
          <div className="o-grid o-grid--gutters">
            {!hideImage &&
              <div className="o-grid__item o-grid__item--shrink">
                <div className="o-grid u-text-center" style={{ width: '150px' }}>
                  <div className="o-grid__item u-1/1">
                    <img
                      src={state.imageUrl || 'https://placehold.jp/150x150.png'}
                      alt={state.name[languages[0]]}
                      height="150"
                      width="150"
                    />
                  </div>
                  {disabled ? null : (
                    <div className="o-grid__item u-1/1">
                      <div className="o-grid">
                        <div className="o-grid__item u-1/1">
                          <ImageModalButtonContainer
                            disabled={disabled}
                            onConfirm={nextUrl => {
                              dispatch({ type: 'IMAGE_URL', payload: nextUrl })
                            }}
                            selectedImage={state.imageUrl}
                          />
                        </div>
                        <div className={cn('o-grid__item u-1/1', { 'u-invisible': !state.imageUrl })}>
                          <FileListItem
                            fileUrl={state.imageUrl || ''}
                            onRemove={() => {
                              dispatch({ type: 'IMAGE_URL', payload: '' })
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            }
            <div className="o-grid__item">
              <div className="o-grid">
                {languages.map(lang => (
                  <div key={lang} className="o-grid__item u-1/1 u-margin-bot">
                    <div className="o-grid">
                      <div className="o-grid__item u-1/1 u-margin-bot">
                        <Field
                          disabled={disabled}
                          fieldComponent={'Text'}
                          handleChange={e => {
                            dispatch({ type: 'NAME', payload: { ...state.name, [lang]: e.target.value } })
                          }}
                          label={t(`${type} name`)}
                          name={`${type} name`}
                          maxLength="150"
                          required
                          validateOnBlur
                          value={state.name[lang]}
                        />
                      </div>
                      {state.tags && (disabled ? (
                        <TagList tagOrder={state.tags} />
                      ) : (
                        <div className="o-grid__item u-1/1">
                          <AssignTagsDropdownContainer
                            selectedTags={state.tags}
                            toggleTagSelection={nextTags => {
                              dispatch({ type: 'TAGS', payload: nextTags })
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="o-grid__item u-1/1  u-1/2@tablet">
          <div className="o-grid">
            {languages.map((lang, i) => (
              <div key={lang} className="o-grid__item u-1/1 u-margin-bot">
                <RichTextEditor
                  content={state.description[lang]}
                  disabled={disabled}
                  id={`RTE-description-${lang}`}
                  key={lang}
                  label={t(`${type} description`)}
                  maxLength={1000}
                  onChange={(content, allowEdit) => rteOnChange(content, allowEdit, lang, i)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      {hasRoutineOrderFlag && isProductGroupForm &&
        <div className='c-cs-routine-order-container' id='routine-order-container'>
          <Field
            key={t('Enable Routine Order')}
            className="u-margin-bot-none"
            checkboxLabel={t('Enable Routine Order')}
            checked={enableRoutineOrder}
            disabled={disabled}
            fieldComponent={'Checkbox'}
            handleChange={() => {
              setEnableRoutineOrder(!enableRoutineOrder)
            }}
            name={t('Enable Routine Order')}
          />
          <span className='c-cs-routine-label'>{t('Add a product group to the cart in one click')}</span>
        </div>
      }
    </div>
  )
}

NameAndDescriptionForm.propTypes = {
  disabled: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
  state: PropTypes.shape({
    description: PropTypes.objectOf(PropTypes.string).isRequired,
    imageUrl: PropTypes.string.isRequired,
    name: PropTypes.objectOf(PropTypes.string).isRequired,
    tags: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  type: PropTypes.string.isRequired,
  hideImage: PropTypes.bool,
  enableRoutineOrder: PropTypes.bool,
  setEnableRoutineOrder: PropTypes.func
}

NameAndDescriptionForm.defaultProps = {
  hideImage: false
}
