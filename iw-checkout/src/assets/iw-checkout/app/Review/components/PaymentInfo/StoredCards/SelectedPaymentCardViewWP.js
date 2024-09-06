import React, {useState} from 'react'
import {t} from "@insight/toolkit-utils/lib/labels";
import {checkExpired} from "../paymentInfoHelpers";
import WorldPayHostedIframe from './../WorldPayHostedIframe'
import PropTypes from "prop-types";
import {IWLoading} from "../../../../../libs/iw-components";

function SelectedPaymentCardViewWP(props) {
  const {
    displayCardNum,
    storedCardExpMonth,
    storedCardExpYear,
    storedCardHolderName,
    storedCardId,
    storedCardType,
  } = props.selectedCard
  const isExpired = checkExpired(storedCardExpMonth, storedCardExpYear)
  const cardEndingIn = displayCardNum && displayCardNum.slice(-4)
  const expiryDate = t('Expiration date')
  const nameOnCard = t('Name on card')
  const setAsMyDefault = t('Set as default')
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false)
  function resultCallback(response) {
    const {order} = response;
    const {status} = order
    if(status === "success"){
      setIsPaymentSuccess(true)
    }
    props.resultCallback(response)
  }

  return (
    <div>

      { isExpired ?
        <div>
          <div className="row additional-payment-fields">
            <p className="form__field-msg form__field-msg--error">
              {t('* The card has expired. Please edit or delete the information.')}
            </p>
          </div>
          <div className="row additional-payment-fields">
            <div className="columns small-12 medium-6">
              <label htmlFor="iw-checkout__paymentsfc-stored-card-type" className="form__label--readonly">{t('Card:')}</label>
            </div>
            <div className="columns small-12 medium-6">
              <p id="iw-checkout__paymentsfc-stored-card-type">
                <span className={`hide-for-print icon-cards icon-cards--${storedCardType}`}>
                  <span className="show-for-sr">{storedCardType}</span>
                </span>
                <span className="show-for-print print-inline">
                  <strong>{storedCardType}</strong>
                </span>
                {` ${t('ending in')} ${cardEndingIn}`}
              </p>
            </div>
          </div>
          <div className="row additional-payment-fields">
            <div className="columns small-12 medium-6">
              <label htmlFor="iw-checkout__paymentsfc-card-holder-name" className="form__label--readonly">{`${nameOnCard}:`}</label>
            </div>
            <div className="columns small-12 medium-6">
              <p id="iw-checkout__paymentsfc-card-holder-name">{storedCardHolderName}</p>
            </div>
          </div>
          <div className="row additional-payment-fields">
            <div className="columns small-12 medium-6">
              <label htmlFor="iw-checkout__paymentsfc-expired" className="form__label--readonly">{`${expiryDate}:`}</label>
            </div>
            <div className="columns small-12 medium-6">
              <p id="iw-checkout__paymentsfc-expired" className="color--red">{t('Expired')}</p>
              <a className="button hollow small" onClick={props.onUpdateExpiredCard}>{t('Update card')}</a>
            </div>
          </div>
        </div>
        :
        <div className="row expanded is-collapse-child">
          <WorldPayHostedIframe
            storedCardId={storedCardId}
            wpLibRef={props.wpLibRef}
            resultCallback={resultCallback}
            setPaymentState={props.setPaymentState}
          />
        </div>
      }



      {  isPaymentSuccess &&
      <IWLoading modal className="iw-loading__size-giant "/>
      }
      { !isPaymentSuccess && !props.isItaly &&
        <div className="row additional-payment-fields">
          <div className="columns small-12 medium-6 large-6">
            {props.defaultCardId === storedCardId ?
              t('Current default')
              :
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
            }
          </div>
        </div>
      }
    </div>
  )
}

export default SelectedPaymentCardViewWP

SelectedPaymentCardViewWP.propTypes = {
  defaultCardId: PropTypes.number.isRequired,
  isDefaultCard: PropTypes.bool,
  isItaly: PropTypes.bool.isRequired,
  setPaymentState: PropTypes.func.isRequired,
  selectedCard: PropTypes.object.isRequired,
  resultCallback: PropTypes.func.isRequired,
}



