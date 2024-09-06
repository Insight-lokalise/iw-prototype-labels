import React from 'react'
import { t } from '@insight/toolkit-utils/lib/labels'
import Button from '@insight/toolkit-react/lib/Button/Button'
import AddressContactForm from './AddressContactForm'

const AddressEditView = ({setIsAddressCreation, ...rest}) => {
  const toggleIsCreatingAddress = () => {
    setIsAddressCreation(true)
  }
  return (
    <section id="read-only-view-shipping">
      <div className="o-grid o-grid--gutters-large u-text-right hide-for-print">
        <div className="o-grid__item">
          <Button
            onClick={() => toggleIsCreatingAddress()}
            color={'inline-link'}
          >
            {t('Add new')}
          </Button>
        </div>
      </div>
      <AddressContactForm {...rest}/>
    </section>
  )
}

export default AddressEditView
