import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Field } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'

import WebGroupsTable from '../MulitpleViews/WebGroupsTable'
import FindWebGroup from '../MulitpleViews/FindWebGroup'

export default function FindStep(props) {
  const { 
    webGroupId,
    updateWebGroup,
    emptyCategory,
    foundWebGroups,
    differentWebgroupCategories,
    getDifferentGroupCategories, 
    setFoundWebGroups,
    setCategory,
  } = props
  const [errorMessage, setErrorMessage] = useState('')

  const newCategory = Object.values(differentWebgroupCategories).length === 0?
    emptyCategory
    : Object.values(differentWebgroupCategories)[0]

  function handleFind(foundWebGroup) {
    if (!foundWebGroup.id) {
      setErrorMessage(t('The specified web group could not be located. Please try again.'))
    } else if(foundWebGroup.id === webGroupId){
      setErrorMessage(t('Please use the other option to duplicate to the current web group.'))
    }else {
      setFoundWebGroups([{ id: foundWebGroup.id, name: foundWebGroup.name }])
      getDifferentGroupCategories(foundWebGroup.id)
      setErrorMessage('')
    }
  }
  return (
    <div className="o-grid">
      <div className="o-grid__item u-1/1 u-margin-bot">
        <FindWebGroup message={errorMessage} handleFind={handleFind} />
      </div>
      <div className="o-grid__item u-1/1 u-margin-bot">
        <WebGroupsTable
          webGroupList={foundWebGroups}
          listItemFunc={webGroup => (
            <div key={webGroup.id} className="o-grid__item u-1/1 u-padding-tiny u-border-bot">
              <div className="o-grid">
                <div className="o-grid__item o-grid__item--shrink o-grid__item--center">
                  <Field
                    checked={webGroup.id === webGroupId}
                    fieldComponent={'Radio'}
                    handleChange={() => {
                      updateWebGroup(webGroup.id)
                      setCategory(newCategory)
                    }}
                    id={'duplicateRadio'}
                    name={'labConfig'}
                  />
                </div>
                <div className="o-grid__item o-grid__item--center">{`${webGroup.name}/${webGroup.id}`}</div>
              </div>
            </div>
          )}
        />
      </div>
    </div>
  )
}

FindStep.propTypes = {
  updateWebGroup: PropTypes.func.isRequired,
  webGroupId: PropTypes.number.isRequired,
  emptyCategory: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.objectOf(PropTypes.string).isRequired,
  }).isRequired,
  foundWebGroups: PropTypes.array.isRequired,
  setFoundWebGroups: PropTypes.func.isRequired,
  setCategory: PropTypes.func.isRequired
}
