import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { t } from '@insight/toolkit-utils/lib/labels'
import Panel from '@insight/toolkit-react/lib/Panel/Panel'
import ButtonGroup from '@insight/toolkit-react/lib/ButtonGroup/ButtonGroup';
import Loading from "@insight/toolkit-react/lib/Loading/Loading";
import Lozenge from "@insight/toolkit-react/lib/Lozenge/Lozenge";
import Address from '@insight/toolkit-react/lib/Address/Address'
import { fetchCheckOutDefaults, fetchAddresses, fetchPersonalInformation } from "../../api";

const AccountCenterAddresses = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [defaultShipTo, setDefaultShipTo] = useState(null)
  const [defaultBillTo, setDefaultBillTo] = useState(null)

  useEffect(()=>{
    fetchCheckOutDefaults().then((data)=>{
      if(data.defaultShippingAddress && data.defaultBillingAddress) {
        setDefaultShipTo(data.defaultShippingAddress)
        setDefaultBillTo(data.defaultBillingAddress)
        setIsLoading(false)
      }
      else {
        // if shipTo or billTo have no default, show soldTo address as default
        // soldTo address be the same for shipTo and billTo, so we only need to fetch it from shipping addresses call
        Promise.all([fetchAddresses({shipIndicator: true}), fetchPersonalInformation()]).then( ([{shipResponse}, {accountNumber}]) => {
          if(shipResponse.shipToBillToaddress) {
            const soldToAddress = (shipResponse.shipToBillToaddress.find((address) => accountNumber == address.partnerFunction))
            // show soldTo address as default if no default address is set
            !data.defaultShippingAddress ? setDefaultShipTo(soldToAddress) : setDefaultShipTo(data.defaultShippingAddress)
            !data.defaultBillingAddress ? setDefaultBillTo(soldToAddress) : setDefaultBillTo(data.defaultBillingAddress)
            setIsLoading(false)
          }
          else {
            setIsLoading(false)
          }
        });
      }
    })
  }, [])

  return (
    <div className='c-addresses c-panel-border c-ac-container'>
      <Panel>
        <Panel.Title className='c-ac-panel-title'>
          <h2 className='u-h5 u-text-bold u-margin-bot-none'>{t('Addresses')}</h2>
        </Panel.Title>
        <Panel.Body>
          {isLoading ? <Loading /> : <div>
            <div className='o-grid'>
              <div className='o-grid__item u-1/1 u-1/2@desktop'>
                <div className='u-margin-bot-small'>
                  <span className='u-text-bold'>{t('Shipping address')}</span>
                  <Lozenge className='u-margin-left' color='info'>{t('Default')}</Lozenge>
                </div>
                {defaultShipTo ?
                  <Address
                    testid='shipping-address'
                    address={{
                      attentionLine: defaultShipTo.attentionLine,
                      company:defaultShipTo.partnerCompany,
                      address1:defaultShipTo.partnerAaddress1,
                      address2:defaultShipTo.partnerAddress2,
                      address3:defaultShipTo.partnerAddress3,
                      city:defaultShipTo.partnerCity,
                      state:defaultShipTo.partnerState,
                      zipcode:defaultShipTo.partnerZip,
                      country: defaultShipTo.partnerCountry,
                      phone:defaultShipTo.partnerPhone
                    }}
                  />
                  : <p>{t('No shipping address available')}</p> }

              </div>
              <div className='o-grid__item u-1/1 u-1/2@desktop'>
                <div className='u-margin-bot-small'>
                  <span className='u-text-bold'>{t('Billing address')}</span>
                  <Lozenge className='u-margin-left' color='info'>{t('Default')}</Lozenge>
                </div>
                {defaultBillTo ?
                  <Address
                    testid='billing-address'
                    address={{
                      attentionLine: defaultBillTo.attentionLine,
                      company:defaultBillTo.partnerCompany,
                      address1:defaultBillTo.partnerAaddress1,
                      address2:defaultBillTo.partnerAddress2,
                      address3:defaultBillTo.partnerAddress3,
                      city:defaultBillTo.partnerCity,
                      state:defaultBillTo.partnerState,
                      zipcode:defaultBillTo.partnerZip,
                      country: defaultShipTo.partnerCountry,
                      phone:defaultBillTo.partnerPhone
                    }}
                  />
                  : <p>{t('No billing address available')}</p> }
              </div>
            </div>
            <ButtonGroup align="right" className="c-ac-button__group">
              <Link className='c-ac-address-button' to="/userProfile/addresses/addNew">{t('Add new')}</Link>
              <Link className='c-ac-address-button' to="/userProfile/addresses/manage">{t('Manage')}</Link>
            </ButtonGroup>
          </div>
          }

        </Panel.Body>
      </Panel>
    </div>
  )
}

export default AccountCenterAddresses;
