import React, {useState, useEffect} from 'react'
import { useHistory } from "react-router-dom";
import { t } from '@insight/toolkit-utils/lib/labels'
import Panel from '@insight/toolkit-react/lib/Panel/Panel'
import Loading from "@insight/toolkit-react/lib/Loading/Loading";
import ButtonGroup from '@insight/toolkit-react/lib/ButtonGroup/ButtonGroup';
import Button from '@insight/toolkit-react/lib/Button/Button';
import { filterAddress } from '@insight/toolkit-utils';
import { fetchAddresses, updateDefaultAddress, deleteAddress } from "../../api";
import AddressItem from './AddressItem';
import AddressDeleteModal from '../Modal/Address/AddressDeleteModal'

const AddressesList = ({
  isShipping, 
  filterString, 
  defaultAddress, 
  getDefaultAddresses, 
  addToast,
  soldTo,
}) => {

  const history = useHistory();
  const minDisplaySize = 12
  const [isLoading, setIsLoading] = useState(true)
  const [viewAll, setViewAll] = useState(false)
  const [addresses, setAddresses] = useState([])
  const [filteredAddresses, setFilteredAddresses] = useState([])
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteAddressParams, setDeleteAddressParams] = useState({})
  const [defaultSoldTo, setDefaultSoldTo] = useState(null)

  useEffect(()=>{

    if(defaultAddress) {
      getAddresses()
    }
   
  }, [defaultAddress])

  useEffect(()=>{

    if(defaultAddress) {
      filterAddressHandler()
      setIsLoading(false)
    }
   
  }, [addresses])

  useEffect(()=>{
    filterAddressHandler()
  }, [filterString])

  const filterAddressHandler = () => {        

    // address props to filter against
    const filterProps = [
      'attentionLine',
      'partnerAaddress1',
      'partnerAddress2',
      'partnerAddress3',
      'partnerCity',
      'partnerCompany',
      'partnerState',
      'partnerZip',
      'partnerCountry'
    ]

    const newFilteredAddresses = filterAddress({filterString, addresses, filterProps})
    //  if default address does not exist, set soldTo address as the default by using accountNumber(soldTo)
    const defaultSoldTo = defaultAddress && defaultAddress.partnerFunction || soldTo
    const defaultIndex = newFilteredAddresses.findIndex((address) => defaultSoldTo == address.partnerFunction)
    // move default address to first element if found
    if(defaultIndex > -1) {
      newFilteredAddresses.unshift(newFilteredAddresses.splice(defaultIndex, 1)[0])
      newFilteredAddresses[0].default = true
    }

    setFilteredAddresses(newFilteredAddresses)
    setDefaultSoldTo(defaultSoldTo)
    setViewAll(false)
  }

  const getAddresses = () => fetchAddresses({shipIndicator: isShipping}).then((data)=>{
      if(data.shipResponse && data.shipResponse.shipToBillToaddress) {
        return setAddresses(data.shipResponse.shipToBillToaddress)
      }
    })

  const updateDefaultAddressHandler = ({isShipping, isSoldTo, shipTo}) => {
    setIsLoading(true)
    updateDefaultAddress({isShipping, isSoldTo, shipTo}).then((data) => {
      if(data.exceptionExist) {
        addToast({message: t('Failed to update default address'), type:'warning'})
        setIsLoading(false)
      }
      else {                
        getDefaultAddresses(isShipping).then(() => {
          addToast({message: t('Default address successfully updated'), type:'success'})
        })
      }   
    }).catch(()=>{
      addToast({message: t('Failed to update default address'), type:'warning'})
      setIsLoading(false)
    })
  }

  const editAddressHandler = ({shipTo, isShipping}) => {
    history.push(`/userProfile/addresses/edit/${isShipping ? '1' : '2'}/${shipTo}/${defaultSoldTo}`)
  }

  const deleteAddressHandler = ({shipTo}) => {
    setDeleteAddressParams({shipTo, isShipping})
    setDeleteModalOpen(true)
  }

  const deleteModalSubmit = () => {
    const { shipTo } = deleteAddressParams
    deleteAddress({shipTo, isShipping}).then((data) => {
      if(data.exceptionExist) {
        addToast({message: t('There was a problem deleting the address'), type:'warning'})
        setIsLoading(false)
      }
      else {                
        getDefaultAddresses(isShipping).then(() => {
          addToast({message: t('The address was successfully deleted'), type:'success'})
        })
      }      
    }).catch(()=>{
      addToast({message: t('There was a problem deleting the address'), type:'warning'})
      setIsLoading(false)
    })
    setDeleteModalOpen(false)
    setIsLoading(true)
  }

  const renderAddresses = () => {

    if(filteredAddresses.length == 0) {
      return <p>{t(isShipping ? 'No shipping address available' : 'No billing address available')}</p>
    }

    const addressesToShow = (viewAll) ? filteredAddresses : filteredAddresses.slice(0, minDisplaySize)
    return addressesToShow.map((address, index) => (
      <AddressItem key={index} isShipping={isShipping} address={address} soldTo={soldTo} setDefaultAddress={updateDefaultAddressHandler} deleteAddressHandler={deleteAddressHandler} editAddressHandler={editAddressHandler} />        
      ))
  }

  return (
    <div className='c-address-list c-panel-border'>
      <Panel>
        <Panel.Body>          
          <div className='o-grid'>
            <div className='o-grid__item u-1/1'>
              <h2 className='u-h5 u-text-bold u-margin-bot-none c-account-header__heading'>
                {isShipping ? t("Shipping addresses") : t("Billing addresses")}
              </h2>
            </div>
            <div className='o-grid__item u-1/1'>
              { isLoading ?
                <Loading />
              :
                <div className='o-grid'>                        
                  {renderAddresses()}
                  {!viewAll && filteredAddresses.length > minDisplaySize &&
                  <div className='o-grid__item u-1/1'>
                    <ButtonGroup align="right">
                      <Button color="link" onClick={()=>setViewAll(true)}>{t('View all')}</Button>
                    </ButtonGroup>
                  </div>
                }
                </div>
            }            
            </div>            
          </div>
        </Panel.Body>
      </Panel>
      {deleteModalOpen &&
        <AddressDeleteModal
          onClose={()=>setDeleteModalOpen(false)}
          onSubmit={deleteModalSubmit}
        />
      }
    </div>
  )}

export default AddressesList;
