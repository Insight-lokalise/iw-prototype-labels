import React, {useState} from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils/lib/labels'
import WorldPayHostedIframe from './WorldPayHostedIframe'
import { IWLoading } from './../../../../libs/iw-components'

export function AddNewCardWP(props) {
  const storedCardDesc = t('Add a card description')
  const addToMyStoredCards = t('Add to my stored cards')
  const setAsMyDefault = t('Set as default')

  const [addToStoredCards, setAddToStoredCards] = useState(false)
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false)
  function resultCallback(response) {
    const {order} = response;
    const {status} = order
    if(status==="success"){
      setIsPaymentSuccess(true)
    }
    props.resultCallback(response)
  }
  return (
    <div className="c-worldpay-addCard">
      <WorldPayHostedIframe
        wpLibRef={props.wpLibRef}
        resultCallback={resultCallback}
        setPaymentState={props.setPaymentState}
      />
    {  isPaymentSuccess &&
      <IWLoading modal className="iw-loading__size-giant "/>
    }
    { props.canSaveCard && !isPaymentSuccess &&
      <div className="row additional-payment-fields">
        <div className="columns small-12 medium-6 large-6">
          <div>
            <label className="form__label form__label--inline">
              <input
                className="form__field form__input--checkbox"
                type="checkbox"
                name="addToStoredCards"
                onChange={(e)=>setAddToStoredCards(e.target.checked)}
                value={addToStoredCards}
              />
                <span className="form__label--checkbox form__label__text">
                  {addToMyStoredCards}
                </span>
            </label>
            {addToStoredCards &&
              <input
                className="form__field form__field"
                type="text"
                maxlength="40"
                name="storedCardDesc"
                onChange={(e)=>props.setPaymentState({storedCardDesc: e.target.value})}
                placeholder={storedCardDesc}
                value={props.storedCardDesc} />
            }
          </div>
        </div>
        {addToStoredCards && !props.isItaly &&
        <div className="columns small-12 medium-6 large-6">
          <div>
            <label className="form__label form__label--inline">
              <input
                className="form__field form__input--checkbox"
                type="checkbox"
                name="isDefaultCard"
                onChange={(e)=>props.setPaymentState({isDefaultCard: e.target.checked})}
                value={props.isDefaultCard}
              />
              <span className="form__label--checkbox form__label__text">
                {setAsMyDefault}
              </span>
            </label>
          </div>
        </div>
        }
      </div>
    }
    </div>
  )
}

export default AddNewCardWP

AddNewCardWP.propTypes = {
  canSaveCard: PropTypes.bool.isRequired,
  isDefaultCard: PropTypes.bool,
  isItaly: PropTypes.bool.isRequired,
  setPaymentState: PropTypes.func.isRequired,
  storedCardDesc: PropTypes.string,
  resultCallback: PropTypes.func.isRequired,
}


