import React from 'react'
import PropTypes from 'prop-types'
import { ButtonGroup, Button } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'

import CatalogLink from '../Navigation/CatalogLink'
import EditLink from '../Navigation/EditLink'

export default function ButtonRow(props) {
  const { categoryId, disabled, productGroupId, productSetId, isEdit, shared, isManagerView, onSubmit, isSubmitDisabled } = props
  
  return (
    <div className='u-border-top u-padding-top-small'>
      {productGroupId && shared ? (
        <div className='u-text-right c-cs-admin__unlink-text'>
          {t('This is a shared copy.')}&nbsp;
          {productSetId && !isManagerView && t('In order to update, you must unlink at the parent level.')}
          {!productSetId && !isManagerView && t('Clicking unlink will allow you to update this product group.')}
        </div>
      ) : null}
      <div className={`c-cs-admin__button-group o-grid o-grid--center o-grid--justify-${!!productSetId ? 'between' : 'right'}`}>
        {!!productSetId && (
          <EditLink id={productSetId} categoryId={categoryId} nestLevel={3} disabled={disabled} className={disabled && 'is-disabled'}>
            {"Add/Edit products"}
          </EditLink>
        )}
        <ButtonGroup align="right">
          <CatalogLink categoryId={categoryId} className='u-text-bold' productGroupId={productGroupId} productSetId={productSetId}>
            {t('Return to catalog')}
          </CatalogLink>
          {disabled ? null : (
            shared? ( 
            <Button 
              color="primary" 
              onClick={onSubmit}
              isDisabled={(isManagerView && isEdit && shared) || (!!productSetId && shared && isEdit)}>
              {productSetId? t('Shared copy'): t('Unlink')}
            </Button>)
            :
            (<Button color="primary" onClick={onSubmit} isDisabled={isSubmitDisabled}>
              {isEdit ? t('Update') : t('Create')}
            </Button>)
          )}
        </ButtonGroup>
      </div>
    </div>
  )
}

ButtonRow.propTypes = {
  categoryId: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  productGroupId: PropTypes.string,
  productSetId: PropTypes.string,
  isEdit: PropTypes.bool.isRequired,
  isSubmitDisabled: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

ButtonRow.defaultProps = {
  disabled: false,
  productGroupId: '',
  productSetId: '',
  isSubmitDisabled: false,
}
