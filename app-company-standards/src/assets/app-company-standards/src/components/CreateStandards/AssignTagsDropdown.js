import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { Dropdown, Field } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'

import { LanguageContext } from '../../lib'
import { Tag, TagList } from '../Shared'

export default function AssignTagsDropdown({ tagDictionary, taggingEnabled, toggleTagSelection, selectedTags }) {
  const { language } = useContext(LanguageContext)
  const userHasCreatedTags = Object.keys(tagDictionary).length > 0
  // eslint-disable-next-line no-nested-ternary
  const dropdownDisplay = userHasCreatedTags ? (
    selectedTags.length > 0 ? (
      <TagList tagOrder={selectedTags} />
    ) : t(
      'Select a tag'
    )
  ) : t(
    'No tags exist. Add tags via settings.'
  )

  function addTag(tagId) {
    toggleTagSelection([...selectedTags, tagId])
  }

  function removeTag(tagId) {
    const nextSelectedTags = [...selectedTags]
    const removeIndex = nextSelectedTags.indexOf(tagId)
    nextSelectedTags.splice(removeIndex, 1)

    toggleTagSelection(nextSelectedTags)
  }

  return (
    taggingEnabled && (
      <Dropdown dropdownMenuClassName="c-assign-tags__dropdown-menu" id={'assign-tags-dropdown'} position="left" text={dropdownDisplay}>
        <div className="o-grid c-assign-tags__options">
          {Object.keys(tagDictionary).map(tagId => {
            const { color, id, name } = tagDictionary[tagId]
            const isChecked = selectedTags.includes(id)

            return (
              <div key={id} className="c-dropdown__item o-grid__item u-1/1">
                <Field
                  className="u-margin-bot-none"
                  disabled={!isChecked && selectedTags.length > 1}
                  checkboxLabel={<Tag color={color} text={name[language]} />}
                  checked={isChecked}
                  fieldComponent={'Checkbox'}
                  handleChange={() => {
                    isChecked ? removeTag(id) : addTag(id)
                  }}
                  name={name[language]}
                />
              </div>
            )
          })}
        </div>
      </Dropdown>
    )
  )
}

AssignTagsDropdown.propTypes = {
  tagDictionary: PropTypes.shape({}).isRequired,
  taggingEnabled: PropTypes.bool.isRequired,
  toggleTagSelection: PropTypes.func.isRequired,
  selectedTags: PropTypes.arrayOf(PropTypes.string).isRequired,
}
