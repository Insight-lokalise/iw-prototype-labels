import React from 'react'
import { t } from '@insight/toolkit-utils/lib/labels'
import Icon from "@insight/toolkit-react/lib/Icon/Icon"

const AddAddressHeader = ({isEdit, showMessage}) => (
  <div>
    <h1 className='u-h3 u-text-bold u-margin-bot-none c-account-header__heading'>
      <span className='c-account-header__title'>{t(isEdit ? "Edit address" : "Add address")}</span>
      {
        showMessage?
        <div className="c-message c-icon--error c-account-header__message" >
          <Icon
              aria-hidden="true"
              icon="alert"
              className="c-account-header__icon"
            />
          <div>{t('This address cannot be modified. Please contact your support team for assistance.')}</div>
        </div>
        :null
      }
    </h1>
  </div>
  )

export default AddAddressHeader;
