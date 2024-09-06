import React from 'react'
import { useHistory } from 'react-router-dom'
import { t } from '@insight/toolkit-utils/lib/labels'
import { Button, ButtonGroup, SearchFilter } from '@insight/toolkit-react'

const AddressesHeader = ({setFilterString}) => {
  const history = useHistory()

  const goToCreate = () => {
    history.push('/userProfile/addresses/addNew')
  }

  return (
    <div className='o-grid o-grid--bottom'>
      <div className="o-grid__item u-1/1">
        <h1 className='u-h3 u-text-bold u-margin-bot-none c-account-header__heading'>
          {t("Addresses")}
        </h1>
      </div>
      <div className="o-grid__item u-1/1 u-1/2@tablet u-margin-bot" data-private="true">        
        <SearchFilter name={'addressFilter'} label={t('Search addresses')} setValue={setFilterString} />
      </div>
      <div className="o-grid__item u-1/1 u-1/2@tablet">
        <ButtonGroup align="right">
          <Button className='c-address-tiles__edit' color="link" icon="add" iconPosition="left" onClick={goToCreate}>{t('Add new address')}</Button>
        </ButtonGroup>
      </div>
    </div>
  )
}
export default AddressesHeader;
