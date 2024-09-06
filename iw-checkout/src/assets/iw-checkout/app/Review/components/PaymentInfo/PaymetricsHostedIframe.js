import React, {useEffect, useState} from 'react'
import { t } from '@insight/toolkit-utils/lib/labels'
import PropTypes from "prop-types";
import {IWMessage} from './../../../../libs/iw-components/iw-message/iw-message'
import {IWLoading} from './../../../../libs/iw-components/iw-loading/iw-loading'
import msgBox from './../../../../libs/iw-components/iw-messageBox'
import {fetchPMFrame} from './../../../../libs/models/Payments/payment'
import useScript from './hooks/useScript';

export default function PaymetricsHostedIframe(props) {
  const [error, setError] = useState(false)
  const [iframeSuccess, setIframeSuccess] = useState(false)
  const [iframeURL, setIframeURL] = useState('')
  const {origin} = document.location;

  useScript('https://xiecomm.paymetric.com/DIeComm/Scripts/XIFrame/XIFrame-1.2.0.js');

  useEffect(() => {
    const pmRequest = {
      cardTypes: props.availableCardTypes,
      hostUri: origin,
      cssUri: `${origin}/insightweb/assets/en_US/www/css/paymetric-checkout.css`,
      locale: props.locale
    }

    props.setPaymentState({isPaymetricReady: false})

    fetchPMFrame(pmRequest).then((data)=>{
      if(data.iFrameUrl) {
        setIframeSuccess(true);
        setIframeURL(data.iFrameUrl);
        props.resultCallback(data);
      }else{
        setError(data.errorResponse) //Set error if the call returns error response
      }
    }).catch((error, status)=>{
      setError('An unexpected error occurred. Please contact your Account Executive for more information..')
      msgBox.addMsg('shopping-cart', {
        text: t('An unexpected error occurred. Please contact your Account Executive for more information.'),
        severity: 'error',
        scrollTo: '.SBP__messages',
      })
      if(status === 401) {
        window.location.href = '/login'
      }
    })
  }, [props.isProcurementCard]);

  const frameOnload = () =>{
    $XIFrame.onload({
      iFrameId:"paymetric-iframe",
      targetUrl:iframeURL,
      autosizeheight: true,
      autosizewidth: true,
      autosizedelay: 100,
      onSuccess: function (e) {
        console.log('frame loaded', e)
      },
      onError: function (e) {
        console.log('frame failed to load', e)
      }
    });
  }

  return (
    <div data-testid='c-paymetric-custom-html' className='c-paymetric-custom-html'>
      <div className="row">
        {!!error ? <IWMessage text={error.message} severity="error"/>
          :
          iframeSuccess ?
            <iframe
              className="c-paymetric-iframe"
              id="paymetric-iframe"
              src={iframeURL} onLoad={frameOnload}></iframe>
            :!error && <IWLoading className="iw-loading__size-giant payment-modal-loading"/>
        }
      </div>
    </div>
  )
}

PaymetricsHostedIframe.propTypes = {
  availableCardTypes: PropTypes.array.isRequired,
  locale: PropTypes.string.isRequired,
  resultCallback: PropTypes.func.isRequired,
}

