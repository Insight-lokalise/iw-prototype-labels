import React, { Fragment, useContext, useEffect, useReducer, useState } from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils'

import ButtonRow from './ButtonRow'
import Checkboxes from './Checkboxes'
import NameAndDescriptionForm, { nameAndDescriptionReducer } from './NameAndDescriptionForm'
import { LanguageContext } from "../../lib";

export default function CreateCategoryForm(props) {
  const {
    category: { block, description, draft, id, imageUrl, name, needsAttention, tags },
    isManagerView
  } = props

  const { language } = useContext(LanguageContext)

  const [nameAndDescriptionState, nameAndDescriptionDispatch] = useReducer(nameAndDescriptionReducer, {
    allowEdit: true,
    description,
    imageUrl,
    name,
    tags,
  })
  const [blockClientAdmin, setBlockClientAdmin] = useState(block)

  useEffect(() => {
    nameAndDescriptionDispatch({ type: 'RESET', payload: { allowEdit: true, description, imageUrl, name, tags } })
    setBlockClientAdmin(block)
  }, [id])

  const checkboxOptions = [
    { label: t('Block client admin from editing'), checked: blockClientAdmin, onChange: setBlockClientAdmin },
  ]

  function handleSubmit() {
    props.onSubmit({
      block: blockClientAdmin,
      draft,
      needsAttention,
      ...nameAndDescriptionState,
    })
  }
  const { allowEdit, name: categoryName } = nameAndDescriptionState
  const isSubmitDisabled = !categoryName[language];
  const disabled = block && isManagerView

  return (
    <Fragment>
      <NameAndDescriptionForm
        state={nameAndDescriptionState}
        dispatch={nameAndDescriptionDispatch}
        disabled={disabled}
        type="Category"
      />
      <Checkboxes
        disabled={disabled}
        isManagerView={isManagerView}
        options={checkboxOptions}
      />
      <ButtonRow
        categoryId={id}
        disabled={disabled}
        isEdit={props.isEdit}
        isManagerView={isManagerView}
        onSubmit={handleSubmit}
        isSubmitDisabled={isSubmitDisabled || !allowEdit}
      />
    </Fragment>
  )
}

CreateCategoryForm.propTypes = {
  category: PropTypes.shape({
    block: PropTypes.bool.isRequired,
    description: PropTypes.objectOf(PropTypes.string).isRequired,
    draft: PropTypes.bool.isRequired,
    id: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    name: PropTypes.objectOf(PropTypes.string).isRequired,
    needsAttention: PropTypes.bool.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  }),
  isEdit: PropTypes.bool,
  isManagerView: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

CreateCategoryForm.defaultProps = {
  category: {
    block: false,
    description: { en: '' },
    draft: true,
    id: '',
    imageUrl: '',
    name: { en: '' },
    needsAttention: false,
    tags: [],
  },
  isEdit: false,
}
