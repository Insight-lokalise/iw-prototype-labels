import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { t } from '@insight/toolkit-utils'

import FormNavButtons from './FormNavButtons'
import CatPgPsDropdownContainer, { DROPDOWN_TYPES } from '../../containers/CatPgPsDropdownContainer'
import { UniversalMessageContext, MESSAGE_TYPES } from "../UniversalMessages";

const defaultEntity = { id: '' }

export default function DuplicateProductSet(props) {
  const {
    duplicate,
    isManagerView,
    navigateOnSubmit,
    productSet,
    categoryId
  } = props;

  const [category, setCategory] = useState(defaultEntity)
  const [productGroup, setProductGroup] = useState(defaultEntity)
  const [isDuplicating, setIsDuplicating] = useState(false)
  const { setActiveMessage } = useContext(UniversalMessageContext)

  const allowContinue = !!(isDuplicating || productGroup.id)

  function changeCategory(entity) {
    setCategory(entity)
    setProductGroup(defaultEntity)
  }

  function handleSubmit() { 
    setIsDuplicating(true)
    duplicate({
      destinationId: productGroup.id,
      sourceId: productSet.id,
    }, isManagerView)
      .then(() => {
        navigateOnSubmit({
          categoryId,
          productGroupId: productSet.parents[2],
          productSetId: productSet.id,
        })
      })
      .catch((e) => {
        console.warn(e)
        setActiveMessage({
          text: t('Failed to duplicate product set'),
          type: MESSAGE_TYPES.ERROR
        })
      })
  }

  return (
    <div>
      <div className="o-grid">
        <p className="o-grid__item u-1/1 u-margin-bot u-font-size-tiny">
          {t('Duplicating will create an independent copy of this product set in the category and product group selected below.')}
        </p>
        <div className="o-grid__item u-1/1 u-margin-bot">
          <div className="o-grid">
            <div className="o-grid__item u-1/1 u-margin-bot">
              <CatPgPsDropdownContainer
                label={t('Available categories')}
                onChange={changeCategory}
                parentId={productSet.parents[0]}
                required
                type={DROPDOWN_TYPES.CATEGORY}
                useCurrentWebGroup={true}
                value={category.id}
              />
            </div>
            <div className={cn('o-grid__item u-1/1 u-margin-bot', { 'u-invisible': !category.id })}>
              <CatPgPsDropdownContainer
                label={t('Available product groups')}
                onChange={setProductGroup}
                parentId={category.id}
                required
                type={DROPDOWN_TYPES.PRODUCT_GROUP}
                useCurrentWebGroup={true}
                value={productGroup.id}
              />
            </div>
          </div>
        </div>
      </div>
      <FormNavButtons
        allowContinue={allowContinue}
        currentStepIndex={isManagerView ? 1 : 0}
        isLastStep
        isManagerView={isManagerView}
        onSubmit={handleSubmit}
        setCurrentStepIndex={() => { }}
        validNextStep={() => true}
      />
    </div>
  )
}

DuplicateProductSet.propTypes = {
  duplicate: PropTypes.func.isRequired,
  isManagerView: PropTypes.bool.isRequired,
  navigateOnSubmit: PropTypes.func.isRequired,
  productSet: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.objectOf(PropTypes.string).isRequired,
    parents: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])).isRequired,
  }).isRequired,
  categoryId: PropTypes.string,
}
