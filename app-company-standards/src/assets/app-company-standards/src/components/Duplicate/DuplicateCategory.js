import React, { useContext, useReducer, useState } from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils'
import cn from 'classnames'

import NameDisplay from '../MulitpleViews/NameDisplay'
import FindStepContainer from '../../containers/findStepContainer'
import FormNavButtons from './FormNavButtons'
import NameStep from './NameStep'
import SelectStep from './SelectStep'
import { LanguageContext } from '../../lib'
import Message from '../UniversalMessages/Message'

const SELECT_WEB_GROUP = 'SELECT_WEB_GROUP'
const FIND_WEB_GROUP = 'FIND_WEB_GROUP'
const SELECT_OR_CREATE_CATEGORY = 'SELECT_OR_CREATE_CATEGORY'

const sameWebGroupTrack = [SELECT_WEB_GROUP, SELECT_OR_CREATE_CATEGORY]
const differentWebGroupTrack = [SELECT_WEB_GROUP, FIND_WEB_GROUP, SELECT_OR_CREATE_CATEGORY]

function duplicateCategoryReducer(state, action) {
  switch (action.type) {
    case 'SET_USE_CURRENT_WEB_GROUP':
      return { ...state, ...action.payload, sameWebgroup: true }
    case 'SET_USE_DIFFERENT_WEB_GROUP':
      return { ...state, ...action.payload, sameWebgroup: false }
    case 'SET_WEB_GROUP':
      return { ...state, webGroupId: action.payload }
    case 'SET_NAME':
      return { ...state, categoryName: action.payload }
    default:
      return state
  }
}

export default function DuplicateCategory(props) {
  const { categories, differentWebgroupCategories, category, duplicate, isManagerView, navigateOnSubmit } = props
  const { language, languages } = useContext(LanguageContext)
  const [foundWebGroups, setFoundWebGroups] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const initialWebGroup = category.parents[0]

  const initialState = {
    categoryName: languages.reduce((prev, lang) => {
      prev[lang] = ''
      return prev
    }, {}),
    webGroupId: initialWebGroup,
    sameWebgroup: true
  }

  const [state, dispatch] = useReducer(duplicateCategoryReducer, initialState)
  const [currentStepIndex, setCurrentStepIndex] = useState(isManagerView ? 1 : 0)
  const [isDuplicating, setIsDuplicating] = useState(false)
  const [useExistingCategory, setUseExistingCategory] = useState(false)
  const useCurrentWebGroup = state.webGroupId === initialWebGroup
  const track = useCurrentWebGroup ? sameWebGroupTrack : differentWebGroupTrack
  const step = track[currentStepIndex]
  const description = isManagerView
    ? t('Duplicating will create a copy of this category in your current web group.')
    : t('Duplicating will create a copy of this category to either your current web group or a different web group.')

  const allowContinue = (() => {
    if (isDuplicating || (step === FIND_WEB_GROUP && !state.webGroupId) || (step === SELECT_OR_CREATE_CATEGORY && !state.categoryName[language])) {
      return false
    }
    return true
  })()

  const checkDuplicateInNewCategory = () => {
    const currentCategories = useCurrentWebGroup ? categories : differentWebgroupCategories;
    if (Object.values(currentCategories).length > 0) {
      return !!Object.values(currentCategories).find(ele =>
        ele.name[language].toLowerCase().trim() === state.categoryName[language].toLowerCase().trim()
      )
    } else {
      return false
    }
  }

  const validNextStep = () => {
    if (!useExistingCategory && (step === SELECT_OR_CREATE_CATEGORY) && checkDuplicateInNewCategory()) {
      setErrorMessage(t('Category could not be created due to existing category name'))
      return false;
    }
    setErrorMessage('')
    return true;
  }

  return (
    <div>
      <div className="o-grid">
        <p className="o-grid__item u-1/1 u-margin-bot u-font-size-tiny">
          {description}
        </p>
        <div className="o-grid__item u-1/1 u-margin-bot">
          <NameDisplay categoryName={category.name[language]} />
        </div>
        <div className="o-grid__item u-1/1 u-margin-bot">
          {step === SELECT_WEB_GROUP && (
            <SelectStep
              currentWebGroup={initialWebGroup}
              useCurrentWebGroup={useCurrentWebGroup}
              toggleUseCurrentWebGroup={nextUseCurrentWG => {
                if (nextUseCurrentWG) {
                  dispatch({
                    type: 'SET_USE_CURRENT_WEB_GROUP',
                    payload: initialState,
                  })
                } else {
                  dispatch({
                    type: 'SET_USE_DIFFERENT_WEB_GROUP',
                    payload: { categoryName: category.name, webGroupId: '' },
                  })
                }
                setUseExistingCategory(false)
              }}
            />
          )}
          {step === FIND_WEB_GROUP && (
            <FindStepContainer
              webGroupId={state.webGroupId}
              updateWebGroup={webGroupId => {
                dispatch({ type: 'SET_WEB_GROUP', payload: webGroupId })
              }}
              setCategory={cat => {
                dispatch({ type: 'SET_CATEGORY', payload: cat })
              }}
              foundWebGroups={foundWebGroups}
              setFoundWebGroups={setFoundWebGroups}
            />
          )}
          {step === SELECT_OR_CREATE_CATEGORY && (
            <div>
              <NameStep
                handleChange={e => {
                  dispatch({ type: 'SET_NAME', payload: { ...state.categoryName, [language]: e.target.value } })
                }}
                label={t('Category name')}
                value={state.categoryName[language]}
              />
              <div className={cn('o-grid__item u-1/1', { 'u-invisible': !errorMessage })}>
                <Message message={errorMessage} type='ERROR' />
              </div>
            </div>
          )
          }
        </div>
      </div>
      <FormNavButtons
        allowContinue={allowContinue}
        currentStepIndex={currentStepIndex}
        isLastStep={currentStepIndex === track.length - 1}
        isManagerView={isManagerView}
        onSubmit={() => {
          setIsDuplicating(true)
          duplicate({ categoryName: state.categoryName, destinationId: state.webGroupId, sourceId: category.id }, state.sameWebgroup).then(
            () => {
              navigateOnSubmit({ categoryId: category.id })
            }
          )
        }}
        validNextStep={validNextStep}
        setCurrentStepIndex={setCurrentStepIndex}
      />
    </div>
  )
}

DuplicateCategory.propTypes = {
  categories: PropTypes.object.isRequired,
  category: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.objectOf(PropTypes.string).isRequired,
    parents: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])).isRequired,
  }).isRequired,
  differentWebgroupCategories: PropTypes.object.isRequired,
  duplicate: PropTypes.func.isRequired,
  isManagerView: PropTypes.bool.isRequired,
  navigateOnSubmit: PropTypes.func.isRequired,
}
