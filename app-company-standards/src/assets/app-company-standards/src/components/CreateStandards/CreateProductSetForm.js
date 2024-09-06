import React, { Fragment, useContext, useEffect, useReducer, useState } from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils'

import ButtonRow from './ButtonRow'
import Checkboxes from './Checkboxes'
import NameAndDescriptionForm, { nameAndDescriptionReducer } from './NameAndDescriptionForm'
import ProductSetForm, { productSetFormReducer } from './ProductSetForm'
import { LanguageContext } from "../../lib";

export default function CreateProductSetForm(props) {
  const { language } = useContext(LanguageContext)
  const {
    isManagerView,
    productSet: { attachment, block, description, disableQty, draft, id, imageUrl, items, name, needsAttention, type, masterWebGroup, shared, master },
  } = props

  const isShared = shared && !master
  const [nameAndDescriptionState, nameAndDescriptionDispatch] = useReducer(nameAndDescriptionReducer, {
    allowEdit: true,
    description,
    imageUrl,
    name,
  })

  const [productSetFormState, productSetFormDispatch] = useReducer(productSetFormReducer, {
    attachment,
    type,
  })

  const [blockClientAdmin, setBlockClientAdmin] = useState(block)
  const [disableQuantityChange, setDisableQuantityChange] = useState(disableQty)
  const [multiple, setMultiple] = useState(type === 'MULTIPLE')

  useEffect(() => {
    nameAndDescriptionDispatch({ type: 'RESET', payload: { allowEdit: true, description, imageUrl, name } })
    productSetFormDispatch({ type: 'RESET', payload: { attachment, type } })
    setBlockClientAdmin(block)
    setDisableQuantityChange(disableQty)
  }, [id])

  const checkboxOptions = [
    {
      label: t('Disable quantity change for individual items'),
      checked: disableQuantityChange,
      onChange: setDisableQuantityChange,
      hideOnMultiple: true,
    },
    {
      label: t('Block client admin from editing'),
      checked: blockClientAdmin,
      onChange: setBlockClientAdmin,
      hideOnMultiple: false,
    },
  ]

  function handleSubmit() {
    props.onSubmit({
      ...nameAndDescriptionState,
      ...productSetFormState,
      block: blockClientAdmin,
      disableQty: disableQuantityChange,
      draft,
      items,
      needsAttention,
    })
  }
  const { allowEdit, name: categoryName } = nameAndDescriptionState
  const isSubmitDisabled = !categoryName[language];
  const disabled = block && isManagerView

  return (
    <Fragment>
      <NameAndDescriptionForm
        state={nameAndDescriptionState}
        disabled={disabled || isShared}
        dispatch={nameAndDescriptionDispatch}
        type="Product set"
        hideImage
      />
      <ProductSetForm
        disabled={disabled || isShared}
        dispatch={productSetFormDispatch}
        psID={id}
        state={productSetFormState}
        webGroupId={props.webGroupId}
        setMultiple={setMultiple}
        setDisableQuantityChange={setDisableQuantityChange}
      />
      <Checkboxes
        disabled={disabled || isShared}
        isManagerView={isManagerView}
        options={checkboxOptions}
        multiple={multiple}
        masterWebGroup={masterWebGroup}
      />
      {isShared && (
        <div className='u-text-right u-padding-bot-tiny'>
          {`${t('Shared copy - Master web group')} ${masterWebGroup}`}
        </div>
      )}
      <ButtonRow
        categoryId={props.categoryId}
        disabled={disabled}
        isEdit={props.isEdit}
        onSubmit={handleSubmit}
        productGroupId={props.productGroupId}
        productSetId={id}
        isSubmitDisabled={isSubmitDisabled || !allowEdit}
        isManagerView={isManagerView}
        masterWebGroup={masterWebGroup}
        shared={isShared}
      />
    </Fragment>
  )
}

CreateProductSetForm.propTypes = {
  categoryId: PropTypes.string.isRequired,
  isEdit: PropTypes.bool,
  isManagerView: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  productGroupId: PropTypes.string.isRequired,
  productSet: PropTypes.shape({
    attachment: PropTypes.string.isRequired,
    block: PropTypes.bool.isRequired,
    description: PropTypes.objectOf(PropTypes.string).isRequired,
    disableQty: PropTypes.bool.isRequired,
    draft: PropTypes.bool.isRequired,
    id: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    name: PropTypes.objectOf(PropTypes.string).isRequired,
    needsAttention: PropTypes.bool.isRequired,
    type: PropTypes.string.isRequired,
  }),
  webGroupId: PropTypes.number.isRequired,
}

CreateProductSetForm.defaultProps = {
  isEdit: false,
  productSet: {
    attachment: '',
    block: false,
    description: { en: '' },
    disableQty: false,
    draft: true,
    id: '',
    imageUrl: '',
    name: { en: '' },
    needsAttention: false,
    type: 'MULTIPLE',
  },
}
