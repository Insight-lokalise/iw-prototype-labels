import React, {useEffect, useState} from 'react'
import { IWLoading, IWMessage } from './../../../../libs/iw-components'
import {fetchWPFrame} from './../../../../libs/models/Payments/payment'
import useScript from './hooks/useScript';
import useLink from './hooks/useLink';
import { connectToLocale } from '@insight/toolkit-react/lib/Locale/Locale'

export function WorldPayHostedIframe(props) {
  const [error, setError] = useState(false)

  let WPLibraryObject = undefined;

  useLink('//payments.worldpay.com/resources/hpp/integrations/embedded/css/hpp-embedded-integration-library.css');
  useScript('//payments.worldpay.com/resources/hpp/integrations/embedded/js/hpp-embedded-integration-library.js');
  useEffect(() => {
    fetchWPFrame({id: props.storedCardId, ref: props.ref}).then((data)=>{
      const locale = props.context.locale
      const country = locale.split('_')[1].toLowerCase()
      const language = locale.split('_')[0].toLowerCase()
      const {origin} = document.location;
      const { paymentUrl:url, webRefNumber, errorResponse } = data
      if(errorResponse != null){
        setError(errorResponse)
      }
      props.setPaymentState({webRefNumber})
      let customOptions = {
        iframeHelperURL: `${origin}/content/insight-web/helper.html`,
        url,
        type: 'iframe',
        inject: 'immediate',
        target: 'worldpay-custom-html',
        accessibility: true,
        debug: false,
        language,
        country,
        resultCallback: props.resultCallback,
      };
      //initialise the library and pass options
      WPLibraryObject =  new WPCL.Library();
      WPLibraryObject.setup(customOptions);
    }).catch((error, status)=>{
      if(status === 401) {
        window.location.href = '/login'
      }
    })
    return () => {
      !!WPLibraryObject && WPLibraryObject.destroy();
    }
  }, []);

  return (
    <div className="c-worldpay-iframe">
      <div id='worldpay-custom-html'>
        <div className="row align-center">
          {!!error ? <IWMessage text={error.message} severity="error"/>
            :
            <IWLoading className="iw-loading__size-giant payment-modal-loading"/>}
        </div>
      </div>
    </div>
  )
}

export default connectToLocale(WorldPayHostedIframe)


WorldPayHostedIframe.defaultProps = {
  storedCardId: 0,
  ref: 0,
}

