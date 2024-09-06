import React, { useEffect, useState } from 'react';
import { connectToLocale } from '@insight/toolkit-react'
import PaymentsHeader from './PaymentsHeader';
import PaymentsList from './PaymentsList';
import { getStoredCards } from "../../api";

const Payments = ({ addToast, context }) => {
  const [creditCards, setCreditCards] = useState(null)
  const [procurementCards, setProcurementCards] = useState(null)
  const { isLoginAs } = context

  useEffect(()=>{
    if(!isLoginAs){
      getCards(true)
    }
  }, [])

  const getCards = (cacheClear, type='both') => {
    return getStoredCards(cacheClear).then(({ccStoredCards, procStoredCardses})=>{
      switch (type) {
        case 'credit':
          setCreditCards(sortByDefault(ccStoredCards))
          break;
        case 'proc':
          setProcurementCards(sortByDefault(procStoredCardses))
          break;
        default:
          setCreditCards(sortByDefault(ccStoredCards))
          setProcurementCards(sortByDefault(procStoredCardses))
          break;
      }
    })
  }

  const sharedProps = {
    getCards, addToast,
  }

  return (
    <div className="c-account-center">
      <div className='c-account-header'>
        <div className='o-grid--bottom'>
          <div className="o-grid__item">
            <PaymentsHeader addToast={addToast} />
          </div>
        </div>
      </div>
      <div className='c-account-center-tiles'>
        <PaymentsList 
          cards={creditCards}
          isCreditCard
          isLoginAs={isLoginAs}
          {...sharedProps}
        />
      </div>
      <div className='c-account-center-tiles'>
        <PaymentsList
          cards={procurementCards}
          isLoginAs={isLoginAs}
          {...sharedProps}
        />
      </div>
    </div>
  )
}

export default connectToLocale(Payments)

const sortByDefault = (cards) => {
  const defaultIndex = cards.findIndex(card => card.isDefaultCard)
  if(defaultIndex !== -1) {
    cards.unshift(cards.splice(defaultIndex, 1)[0])
  }
  return cards
}
