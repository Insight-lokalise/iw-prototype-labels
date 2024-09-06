import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { Field } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'

import CatPgPsDropdownContainer, { DROPDOWN_TYPES } from '../../containers/CatPgPsDropdownContainer'
import { LanguageContext } from '../../lib'

export default function SelectOrCreateCategoryStep(props) {
  const {
    category,
    emptyCategory,
    setCategory,
    initialState,
    isManagerView,
    webGroupId,
    useCurrentWebGroup,
    useExistingCategory,
    setUseExistingCategory
  } = props
  const { language } = useContext(LanguageContext)

  return (
    <div className="o-grid">
      <h2 className="o-grid__item u-1/1">{`Duplicate to`}</h2>
      <div className="o-grid__item u-1/1 u-margin-bot">
        <div className="o-grid o-grid--center">
          <div className="o-grid__item o-grid__item--shrink u-margin-right">
            <Field
              checked={useExistingCategory}
              fieldComponent={'Radio'}
              handleChange={() => {
                setUseExistingCategory(true)
                setCategory(initialState.category)
              }}
              id={'useExistingCategory'}
              label={t('Use existing category')}
              name={'useExistingCategory'}
            />
          </div>
          <div className={cn('o-grid__item o-grid__item--shrink', { 'u-invisible': !useExistingCategory })}>
            <CatPgPsDropdownContainer
              isManagerView={isManagerView}
              onChange={setCategory}
              parentId={webGroupId}
              required
              type={DROPDOWN_TYPES.CATEGORY}
              value={category.id}
              useCurrentWebGroup={useCurrentWebGroup}
            />
          </div>
        </div>
      </div>
      <div className="o-grid__item u-1/1 u-margin-bot">
        <div className="o-grid o-grid--center">
          <div className="o-grid__item o-grid__item--shrink u-margin-right">
            <Field
              checked={!useExistingCategory}
              fieldComponent={'Radio'}
              handleChange={() => {
                setUseExistingCategory(false)
                setCategory(emptyCategory)
              }}
              id={'createNewCategory'}
              label={t('Create new category')}
              name={'useExistingCategory'}
            />
          </div>
          <div className={cn('o-grid__item o-grid__item--shrink', { 'u-invisible': useExistingCategory })}>
            <Field
              fieldComponent={'Text'}
              handleChange={e => {
                setCategory({ id: '', name: { ...category?.name, [language]: e.target.value } })
              }}
              name={`categoryName`}
              maxLength="50"
              required
              validate={() => { }}
              validateOnBlur
              value={category.name[language]}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

SelectOrCreateCategoryStep.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.objectOf(PropTypes.string).isRequired,
  }).isRequired,
  emptyCategory: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.objectOf(PropTypes.string).isRequired,
  }).isRequired,
  setCategory: PropTypes.func.isRequired,
  webGroupId: PropTypes.number.isRequired,
  useExistingCategory: PropTypes.bool.isRequired,
  setUseExistingCategory: PropTypes.func.isRequired,
}
