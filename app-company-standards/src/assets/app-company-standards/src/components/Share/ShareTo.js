import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {Button, Icon} from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'

import CatPgPsDropdownContainer, {DROPDOWN_TYPES, NONE_SELECTED} from '../../containers/CatPgPsDropdownContainer'
import FindWebGroup from '../MulitpleViews/FindWebGroup'
import WebGroupsTable from '../MulitpleViews/WebGroupsTable'
import cn from "classnames";

export default function ShareTo(props) {
  const [errorMessage, setErrorMessage] = useState('')
  const [validateCategoryMessage, setValidateCategoryMessage] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  function handleFind(foundWebGroup, foundWebgroupCategories) {
    if (!foundWebGroup.id) {
      setErrorMessage(t('The specified web group could not be located. Please try again.'))
    } else if (foundWebGroup.id === props.currentWebGroupId) {
      setErrorMessage(t('You cannot share to the current web group.'))
    } else if (foundWebGroup.salesareaid !== props.currentSalesArea) {
      setErrorMessage(t('This web group belongs to a different sales org'))
    } else if (props.foundAndUnsharedWebGroups.filter(wg => wg.id === foundWebGroup.id).length > 0) {
      setErrorMessage(t('This web group has already been added'))
    } else if (foundWebgroupCategories?.data?.length === 0) {
      setErrorMessage(t('The specified web group does not contain any categories to share to.'))
    }
    else {
      props.addFoundAndUnsharedWebGroup({ id: foundWebGroup.id, name: foundWebGroup.name })
      setErrorMessage('')
    }
  }

  function validateSelectedCategory(webGroup, selectedCategoryId) {
    if (!selectedCategoryId || selectedCategoryId === NONE_SELECTED) {
       return (()=> {setValidateCategoryMessage(t('Select a category to share to'))})
    }  else {
      setValidateCategoryMessage('')
      return props.handleShare({ id: props.hasCategories ? selectedCategoryId : webGroup.id })
    }
  }

  return (
    <div className="o-grid">
      <h2 className="o-grid__item u-1/1 u-margin-bot-small">{t('Share to:')}</h2>
      <div className="o-grid__item u-1/1 u-margin-bot">
        <FindWebGroup message={errorMessage} handleFind={handleFind} />
      </div>
      <div className="o-grid__item u-1/1 u-margin-bot">
        <WebGroupsTable
          entityType={false}
          hasCategories={props.hasCategories}
          webGroupList={props.foundAndUnsharedWebGroups}
          listItemFunc={webGroup => (
            <div key={webGroup.id} className="o-grid__item u-1/1 u-padding-tiny u-border-bot">
              <div className="o-grid">
                <Button
                  className="o-grid__item o-grid__item--shrink c-button--small u-margin-right"
                  color="primary"
                  isDisabled={false}
                  onClick={validateSelectedCategory(webGroup, selectedCategory?.id) }
                >
                  {t('Share')}
                </Button>
                <div className="o-grid__item o-grid__item--center">{`${webGroup.name} / ${webGroup.id}`}</div>
                {props.hasCategories && (
                  <div className="o-grid__item o-grid__item--center c-share__category">
                    <CatPgPsDropdownContainer
                      onChange={setSelectedCategory}
                      optionsFilter={opt => opt.master}
                      parentId={webGroup.id}
                      type={DROPDOWN_TYPES.CATEGORY}
                      value={selectedCategory.id}
                      label={''}
                      useCurrentWebGroup={false}
                    />
                    <div className={cn('o-grid__item u-1/1 c-form__error c-form__validation-message',
                                       { 'u-invisible': !validateCategoryMessage })}>
                      <div aria-live="polite">
                        <Icon icon="alert" type="error" className="c-form__error-icon" />
                        {validateCategoryMessage}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        />
      </div>
    </div>
  )
}

ShareTo.propTypes = {
  addFoundAndUnsharedWebGroup: PropTypes.func.isRequired,
  currentSalesArea: PropTypes.number.isRequired,
  currentWebGroupId: PropTypes.number.isRequired,
  foundAndUnsharedWebGroups: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  handleShare: PropTypes.func.isRequired,
  hasCategories: PropTypes.bool.isRequired,
}
