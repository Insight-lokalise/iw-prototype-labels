import React, { useState, useEffect } from 'react';
import { t } from '@insight/toolkit-utils/lib/labels'
import Loading from "@insight/toolkit-react/lib/Loading/Loading"
import Panel from '@insight/toolkit-react/lib/Panel/Panel'
import { deleteStoredCard, updateDefaultCard } from '../../api'
import PaymentItem from './PaymentItem';
import PaymentDeleteModal from '../Modal/PaymentInformationModal/PaymentDeleteModal';


const PaymentsList = (props) => {
  const { isCreditCard, isLoginAs, addToast, cards, getCards } = props
  const [isLoading, setIsLoading] = useState(true)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteCardId, setDeleteCardId] = useState('')

  useEffect(()=>{
    setIsLoading(cards===null)
  }, [cards])

  const updateDefaultCardHandler = (cardId) => {
    setIsLoading(true)
    updateDefaultCard({cardId, isCreditCard}).then((data) => {
      if(data.exceptionExist){
        addToast({message: t('Failed to update default card'), type:'warning'})
        setIsLoading(false)
      } else {
        getCards(true, isCreditCard ? 'credit': 'proc').then(() => {
          setIsLoading(false)
          addToast({message: t('Default card successfully updated'), type: 'success'})
        })
      }
    }).catch(() => {
      addToast({message: t('Failed to updated default card'), type: 'warning'})
      setIsLoading(false)
    })
  }

  const deleteCardHandler = (cardId) => {
    setDeleteCardId(cardId)
    setDeleteModalOpen(true)
  }

  const deleteModalSubmit = () => {
    setIsLoading(true)
    deleteStoredCard(deleteCardId).then((data) => {
      if(data.exceptionExist) {
        addToast({message: t('Failed to delete card'), type:'warning'})
        setIsLoading(false)
      }
      else {
        getCards(true, isCreditCard ? 'credit': 'proc').then(() => {
          setIsLoading(false)
          addToast({message: t('Card successfully deleted'), type:'success'})
        })
      }
    }).catch(()=>{
      addToast({message: t('Failed to delete card'), type:'warning'})
      setIsLoading(false)
    })
    setDeleteModalOpen(false)
  }

  const renderCards = () => {
    if(cards.length == 0) {
      return <p>{t(isCreditCard ? 'No credit cards available' : 'No procurement cards available')}</p>
    }

    return (
      cards.map((card, i) => (
        <PaymentItem
          key={i}
          card={card}
          method={isCreditCard ? 2 : 3}
          deletePaymentHandler={deleteCardHandler}
          setDefaultCard={updateDefaultCardHandler}
        />
        ))
    )
  }

  return(
    <div className='c-address-list c-panel-border'>
      <Panel>
        <Panel.Body>
          {isLoginAs ? <p>{t('"Login As" users cannot view stored cards')}</p>
            : <div className='o-grid'>
              <div className='o-grid__item u-1/1'>
                <h2 className='u-h5 u-text-bold u-margin-bot-none c-account-header__heading'>
                  {isCreditCard ? t("Credit cards") : t("Procurement cards")}
                </h2>
              </div>
              <div className='o-grid__item u-1/1'>
                {isLoading ?
                  <Loading/>
                  :
                  <div className='o-grid'>
                    {renderCards()}
                  </div>
                }
              </div>
            </div>
          }
        </Panel.Body>
      </Panel>
      {deleteModalOpen && <PaymentDeleteModal onClose={() => setDeleteModalOpen(false)} onSubmit={deleteModalSubmit} />}
    </div>
  )
}

export default PaymentsList;
