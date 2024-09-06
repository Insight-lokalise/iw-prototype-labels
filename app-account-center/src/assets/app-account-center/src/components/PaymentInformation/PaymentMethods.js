import React, { useEffect, useState } from 'react'
import {Link} from "react-router-dom";
import { t } from '@insight/toolkit-utils/lib/labels'
import Panel from '@insight/toolkit-react/lib/Panel/Panel'
import Loading from "@insight/toolkit-react/lib/Loading/Loading";
import Lozenge from "@insight/toolkit-react/lib/Lozenge/Lozenge";
import {fetchCheckOutDefaults, getStoredCards, getAccountInformation} from "../../api";
import PaymentCardView from './PaymentCardView'
import ButtonGroup from "@insight/toolkit-react/lib/ButtonGroup/ButtonGroup";

const PaymentMethods = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isLoginAs, setIsLoginAs] = useState(false)
  const [defaultPayment, setDefaultPayment] = useState(0)
  const [paymentMethods, setPaymentMethods] = useState(null)
  const [defaultPaymentCard, setDefaultPaymentCard] = useState(null)

  useEffect(()=>{
    Promise.all([fetchCheckOutDefaults(), getStoredCards(), getAccountInformation()]).then(([checkoutDefaultsData, getStoredCardsData, accountInfo])=> {
      const {allowedPaymentMethods, defaultPaymentMethod } = checkoutDefaultsData
      setPaymentMethods(allowedPaymentMethods)
      setDefaultPayment(defaultPaymentMethod)
      setIsLoginAs(accountInfo.isLoginAs)
      setIsLoading(false)

      const {ccStoredCards, procStoredCardses} = getStoredCardsData
      setDefaultPaymentCard(getDefaultCardByMethod(
        {ccStoredCards, procStoredCardses}, defaultPaymentMethod
      ))
    });
  }, [])

  return (
    <div className='c-payment-methods c-panel-border c-ac-container'>
      <Panel>
        <Panel.Title className='c-ac-panel-title'>
          <h2 className='u-h5 u-text-bold u-margin-bot-none'>{t('Payment method')}</h2>
        </Panel.Title>
        <Panel.Body>
          {isLoading ? <Loading /> : (<div className='c-payment-methods-body' >
            <div className='u-margin-bot-small'>
              <span className='u-text-bold'>{t('Payment method')}</span>
              <Lozenge className='u-margin-left' color='info'>{t('Default')}</Lozenge>
            </div>
              {defaultPayment && defaultPayment !=0 ? <>
                <div className='c-payment-methods-default'>{t(getDefaultPaymentMethodName(paymentMethods, defaultPayment))}</div>
                {defaultPaymentCard && (
                  isLoginAs ? <p>{t('"Login As" users cannot view stored cards')}</p> :
                  <PaymentCardView card={{
                    cardNum: defaultPaymentCard.displayCardNum,
                    cardDesc: defaultPaymentCard.storedCardDesc,
                    cardExpMonth: defaultPaymentCard.storedCardExpMonth,
                    cardExpYear: defaultPaymentCard.storedCardExpYear,
                    cardHolderName: defaultPaymentCard.storedCardHolderName,
                    cardId: defaultPaymentCard.storedCardId ,
                    cardToken :defaultPaymentCard.storedCardToken ,
                    cardType: defaultPaymentCard.storedCardType,
                  }}/>
                  )
                }                
              </>: <p>{t('No default payment method available')}</p>}
              {!isLoginAs &&
                <ButtonGroup align="right" className="c-ac-button__group">
                  <Link className='c-ac-payment-button' to="/userProfile/payments/addNew">{t('Add new')}</Link>
                  <Link className='c-ac-payment-button' to="/userProfile/payments/manage">{t('Manage')}</Link>
                </ButtonGroup>
              }
          </div>
          )}
        </Panel.Body>
      </Panel>
    </div>
  )
}

export default PaymentMethods;

const getDefaultPaymentMethodName = (availableMethods, defaultMethod) => {
  const defaultOption = availableMethods.find(({id}) => id===defaultMethod)
  return defaultOption && defaultOption.name
}

const getDefaultCardByMethod = (storedPaymentCards, defaultPaymentMethod) => {
  const {ccStoredCards, procStoredCardses} = storedPaymentCards
  const storedCardsToUse = defaultPaymentMethod === 2 ? ccStoredCards : defaultPaymentMethod ===3 ? procStoredCardses : []
  const defaultCardTUse = storedCardsToUse.find(i => i.isDefaultCard)
  return defaultCardTUse ? defaultCardTUse : null
}
