import React, { Fragment, useContext, useEffect, useReducer, useState } from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils'
import cn from 'classnames'

import { LanguageContext } from '../../lib'
import FindStepContainer from '../../containers/findStepContainer'
import FormNavButtons from './FormNavButtons'
import NameStep from './NameStep'
import SelectOrCreateCategoryStep from './SelectOrCreateCategoryStep'
import SelectStep from './SelectStep'
import Message from '../UniversalMessages/Message'
import { fetchProductGroupsByCategory } from '../../api'

const SELECT_WEB_GROUP = 'SELECT_WEB_GROUP'
const FIND_WEB_GROUP = 'FIND_WEB_GROUP'
const SELECT_OR_CREATE_CATEGORY = 'SELECT_OR_CREATE_CATEGORY'
const NAME_PRODUCT_GROUP = 'NAME_PRODUCT_GROUP'

const sameWebGroupTrack = [SELECT_WEB_GROUP, SELECT_OR_CREATE_CATEGORY, NAME_PRODUCT_GROUP]
const differentWebGroupTrack = [SELECT_WEB_GROUP, FIND_WEB_GROUP, SELECT_OR_CREATE_CATEGORY, NAME_PRODUCT_GROUP]

function duplicateCategoryReducer(state, action) {
  switch (action.type) {
    case 'SET_USE_CURRENT_WEB_GROUP':
      return { ...state, ...action.payload, sameWebgroup: true }
    case 'SET_USE_DIFFERENT_WEB_GROUP':
      return { ...state, ...action.payload, sameWebgroup: false }
    case 'SET_WEB_GROUP':
      return { ...state, webGroupId: action.payload }
    case 'SET_CATEGORY':
      return { ...state, category: action.payload }
    case 'SET_PRODUCT_GROUP_NAME':
      return { ...state, productGroupName: action.payload }
    case 'SET_PRODUCT_GROUPS':
      return { ...state, productGroups: action.payload }
    default:
      return state
  }
}

export default function DuplicateProductGroup(props) {
  const {
    categories,
    differentWebgroupCategories,
    category,
    duplicate,
    isManagerView,
    productGroup,
    navigateOnSubmit
  } = props;

  const { language, languages } = useContext(LanguageContext)
  const initialProductGroupName = props.productGroup.name
  const initialWebGroupId = props.productGroup.parents[0]

  const initialState = {
    category: {
      id: category.id,
      name: languages.reduce((prev, lang) => {
        prev[lang] = category.name[lang]
        return prev
      }, {}),
    },
    productGroupName: initialProductGroupName,
    productGroups: languages.reduce((prev, lang) => {
      prev[lang] = []
    }, {}),
    webGroupId: initialWebGroupId,
    sameWebgroup: true
  }

  const emptyCategory = languages.reduce(
    (prev, curr) => {
      prev.name[curr] = ''
      return prev
    },
    { id: '', name: {} }
  )

  const [state, dispatch] = useReducer(duplicateCategoryReducer, initialState)
  const [currentStepIndex, setCurrentStepIndex] = useState(isManagerView ? 1 : 0)
  const [isDuplicating, setIsDuplicating] = useState(false)
  const [useExistingCategory, setUseExistingCategory] = useState(true)
  const [foundWebGroups, setFoundWebGroups] = useState([])
  const [errorMessage, setErrorMessage] = useState('')

  const useCurrentWebGroup = state.webGroupId === initialWebGroupId
  const track = useCurrentWebGroup ? sameWebGroupTrack : differentWebGroupTrack
  const step = track[currentStepIndex]

  const allowContinue = (() => {
    if (
      isDuplicating ||
      (step === FIND_WEB_GROUP && !state.webGroupId) ||
      (step === SELECT_OR_CREATE_CATEGORY && !state.category.name[language]) ||
      (step === NAME_PRODUCT_GROUP && !state.productGroupName[language])
    ) {
      return false
    }
    return true
  })()

  const checkDuplicateInNewCategory = () => {
    const currentCategories = useCurrentWebGroup ? categories : differentWebgroupCategories;
    if (Object.values(currentCategories).length > 0) {
      return !!Object.values(currentCategories).find(ele =>
        ele.name[language].toLowerCase().trim() === state.category.name[language].toLowerCase().trim()
      )
    } else {
      return false
    }
  }

  const checkDuplicateInNewProductGroup = () => {
    if (Object.values(state.productGroups[language]).length > 0) {
      return !!state.productGroups[language]?.find(ele =>
        ele.toLowerCase().trim() === state.productGroupName[language].toLowerCase().trim()
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
    if (useExistingCategory && (step === NAME_PRODUCT_GROUP) && checkDuplicateInNewProductGroup()) {
      setErrorMessage(t('Product group could not be created due to existing product group name'))
      return false;
    }
    setErrorMessage('')
    return true;
  }

  function handleSubmit() {
    setIsDuplicating(true)
    duplicate({
      ...(state.category.id
        ? {
          destinationId: state.category.id,
        }
        : {
          categoryName: state.category.name,
          destinationId: state.webGroupId,
        }),
      productGroupName: state.productGroupName,
      sourceId: productGroup.id,
    }, state.sameWebgroup)
      .then(() => {
        navigateOnSubmit({ categoryId: category.id, productGroupId: productGroup.id })
      })
  }

  useEffect(() => {
    setErrorMessage('')
  }, [useExistingCategory])

  const getProductGroupsByCategory = async () => {
    const payload = { categoryId: state.category.id }
    if (!isManagerView) payload.wId = state.webGroupId
    const { data } = await fetchProductGroupsByCategory(payload)
    const productGroupsName = Object.values(data).map(ele => ele.name[language])
    dispatch({
      type: 'SET_PRODUCT_GROUPS',
      payload: { ...state.productGroups, [language]: productGroupsName }
    })
  }

  useEffect(() => {
    if (step !== SELECT_WEB_GROUP) getProductGroupsByCategory()
  }, [state.category.id, step]);

  return (
    <div>
      <div className="o-grid">
        <p className="o-grid__item u-1/1 u-margin-bot u-font-size-tiny">
          {t('Duplicating will create a copy of this product group in the specified web group & category.')}
        </p>
        {!useCurrentWebGroup && [SELECT_OR_CREATE_CATEGORY, NAME_PRODUCT_GROUP].includes(step) && (
          <div className="o-grid__item u-1/1 u-margin-bot">
            <div> {t('specified web group / category')}</div>
            <div>
              {foundWebGroups[0].name} - {foundWebGroups[0].id}
              {!!state.category.name[language] && <Fragment> / {state.category.name[language]}</Fragment>}
            </div>
          </div>
        )}
        <div className="o-grid__item u-1/1 u-margin-bot">
          {step === SELECT_WEB_GROUP && (
            <SelectStep
              currentWebGroup={initialWebGroupId}
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
                    payload: { category: { name: category.name }, webGroupId: '' },
                  })
                }
                setUseExistingCategory(true)
              }}
            />
          )}
          {step === FIND_WEB_GROUP && (
            <FindStepContainer
              webGroupId={productGroup.parents[0]}
              updateWebGroup={webGroupId => {
                dispatch({ type: 'SET_WEB_GROUP', payload: webGroupId })
              }}
              setCategory={cat => {
                dispatch({ type: 'SET_CATEGORY', payload: cat })
              }}
              emptyCategory={emptyCategory}
              foundWebGroups={foundWebGroups}
              setFoundWebGroups={setFoundWebGroups}
            />
          )}
          {step === SELECT_OR_CREATE_CATEGORY && (
            <SelectOrCreateCategoryStep
              category={state.category}
              emptyCategory={emptyCategory}
              setCategory={cat => {
                dispatch({ type: 'SET_CATEGORY', payload: cat })
              }}
              initialState={initialState}
              isManagerView={isManagerView}
              webGroupId={state.webGroupId}
              useCurrentWebGroup={useCurrentWebGroup}
              useExistingCategory={useExistingCategory}
              setUseExistingCategory={setUseExistingCategory}
            />
          )}
          {step === NAME_PRODUCT_GROUP && (
            <NameStep
              handleChange={e => {
                dispatch({
                  type: 'SET_PRODUCT_GROUP_NAME',
                  payload: { ...state.productGroupName, [language]: e.target.value },
                })
              }}
              label={t('Product group name')}
              value={state.productGroupName[language]}
            />
          )}
          {(step === SELECT_OR_CREATE_CATEGORY || step === NAME_PRODUCT_GROUP) && (
            <div className={cn('o-grid__item u-1/1', { 'u-invisible': !errorMessage })}>
              <Message message={errorMessage} type='ERROR' />
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
        onSubmit={handleSubmit}
        validNextStep={validNextStep}
        setCurrentStepIndex={setCurrentStepIndex}
      />
    </div>
  )
}

DuplicateProductGroup.propTypes = {
  categories: PropTypes.object.isRequired,
  category: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.objectOf(PropTypes.string).isRequired,
  }).isRequired,
  differentWebgroupCategories: PropTypes.object.isRequired,
  duplicate: PropTypes.func.isRequired,
  isManagerView: PropTypes.bool.isRequired,
  navigateOnSubmit: PropTypes.func.isRequired,
  productGroup: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.objectOf(PropTypes.string).isRequired,
    parents: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])).isRequired,
  }).isRequired,
}
