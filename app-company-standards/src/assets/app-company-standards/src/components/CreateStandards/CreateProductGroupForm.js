import React, { Fragment, useContext, useEffect, useReducer, useState } from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils'
import { Button } from '@insight/toolkit-react'
import ButtonRow from './ButtonRow'
import Checkboxes from './Checkboxes'
import NameAndDescriptionForm, { nameAndDescriptionReducer } from './NameAndDescriptionForm'
import ProductGroupForm, { productGroupFormReducer } from './ProductGroupForm'
import { LanguageContext } from "../../lib";
import { ProductGroupLinkModal } from './ProductGroupLinkModal'
import { ProductGroupUnLinkModal } from './ProductGroupUnLinkModal'
import { unlink } from '../../api'

export default function CreateProductGroupForm(props) {
  const { language } = useContext(LanguageContext)
  const {
    isManagerView,
    productGroup: {
      block,
      description,
      draft,
      id,
      imageUrl,
      ipsContractId,
      labConfigType,
      name,
      needsAttention,
      routine,
      tags,
      shared,
      master,
      masterWebGroup,
      hideInfo = false
    },
  } = props

  const [nameAndDescriptionState, nameAndDescriptionDispatch] = useReducer(nameAndDescriptionReducer, {
    allowEdit: true,
    description,
    imageUrl,
    name,
    tags,
  })

  const [productGroupFormState, productGroupFormDispatch] = useReducer(productGroupFormReducer, {
    ipsContractId,
    labConfigType,
  })

  const [blockClientAdmin, setBlockClientAdmin] = useState(block)
  const [hideInfoDisplay, setHideInfoDisplay] = useState(hideInfo)
  const [enableRoutineOrder, setEnableRoutineOrder] = useState(routine)
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false)
  const [isUnlinkModalOpen, setIsUnlinkModalOpen] = useState(false)
  const isSharedTargetWebGroup = !master && shared

  useEffect(() => {
    nameAndDescriptionDispatch({ type: 'RESET', payload: { allowEdit: true, description, imageUrl, name, tags } })
    productGroupFormDispatch({
      type: 'RESET', payload: {
        ipsContractId: ipsContractId || "Open Market", labConfigType
      }
    })
    setBlockClientAdmin(block)
    setEnableRoutineOrder(routine)
    setHideInfoDisplay(hideInfo)
  }, [id])

  const checkboxOptions = [
    { label: t('Block client admin from editing'), checked: blockClientAdmin, onChange: setBlockClientAdmin },
    { label: t('Hide product group name & description when selecting products'), checked: hideInfoDisplay, onChange: setHideInfoDisplay },
  ]

  function handleSubmit() {
    if(isSharedTargetWebGroup && props.isEdit) {
      setIsUnlinkModalOpen(true)
      return
    }
    props.onSubmit({
      block: blockClientAdmin,
      draft,
      needsAttention,
      routine: enableRoutineOrder,
      ...nameAndDescriptionState,
      ...productGroupFormState,
      hideInfo: hideInfoDisplay,
    })
  }

  const handleUnlinkSubmit = async () => {
    const updatedProductGroup = await unlink({ destinationId: props.categoryId, sourceId: id, isProductGroup: true})
    setIsUnlinkModalOpen(false)
    props.onSubmit({...updatedProductGroup}, updatedProductGroup?.id)
  }

  const { allowEdit, name: categoryName } = nameAndDescriptionState
  const isSubmitDisabled = !categoryName[language];
  const disabled = block && isManagerView

  return (
    <Fragment>
      <NameAndDescriptionForm
        state={nameAndDescriptionState}
        disabled={disabled || isSharedTargetWebGroup}
        dispatch={nameAndDescriptionDispatch}
        enableRoutineOrder={enableRoutineOrder}
        setEnableRoutineOrder={setEnableRoutineOrder}
        type="Product group"
      />
      <ProductGroupForm
        state={productGroupFormState}
        disabled={disabled || isSharedTargetWebGroup}
        dispatch={productGroupFormDispatch}
      />
      {!isManagerView &&
        <Button 
          className='product-group-link' 
          color='link' 
          isDisabled={isSharedTargetWebGroup}
          onClick={() => setIsLinkModalOpen(true)}
        >
          {t('Direct link for this product group')}
        </Button>
      }
      <Checkboxes
        disabled={disabled || isSharedTargetWebGroup}
        isManagerView={isManagerView}
        options={checkboxOptions}
      />
      {isSharedTargetWebGroup && (
        <div className='u-text-right u-padding-bot-tiny'>
          {`${t('Shared copy - Master web group')} ${masterWebGroup}`}
        </div>
      )}
      <ButtonRow
        categoryId={props.categoryId}
        disabled={disabled}
        productGroupId={id}
        isEdit={props.isEdit}
        shared={isSharedTargetWebGroup}
        isManagerView={isManagerView}
        onSubmit={handleSubmit}
        isSubmitDisabled={isSubmitDisabled || !allowEdit}
      />
      {isLinkModalOpen && !isManagerView && (
        <ProductGroupLinkModal
          categoryId={props.categoryId}
          productGroupId={id}
          onClose={() =>
            setIsLinkModalOpen(false)
          }
        />
      )}
      {isUnlinkModalOpen && (
        <ProductGroupUnLinkModal
          onClose={() =>
            setIsUnlinkModalOpen(false)
          }
          onSubmit={handleUnlinkSubmit}
        />
      )}
    </Fragment>
  )
}

CreateProductGroupForm.propTypes = {
  categoryId: PropTypes.string.isRequired,
  isEdit: PropTypes.bool,
  isManagerView: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  productGroup: PropTypes.shape({
    block: PropTypes.bool.isRequired,
    description: PropTypes.objectOf(PropTypes.string).isRequired,
    draft: PropTypes.bool.isRequired,
    id: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    ipsContractId: PropTypes.string,
    labConfigType: PropTypes.string.isRequired,
    name: PropTypes.objectOf(PropTypes.string).isRequired,
    needsAttention: PropTypes.bool.isRequired,
    routine: PropTypes.bool.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    hideInfo: PropTypes.bool,
  }),
}

CreateProductGroupForm.defaultProps = {
  isEdit: false,
  productGroup: {
    block: false,
    description: { en: '' },
    draft: true,
    id: '',
    imageUrl: '',
    ipsContractId: null,
    labConfigType: 'NONE',
    name: { en: '' },
    needsAttention: false,
    routine: false,
    tags: [],
    hideInfo: false,
  },
}
