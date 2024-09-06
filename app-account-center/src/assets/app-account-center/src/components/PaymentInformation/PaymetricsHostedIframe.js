import React from 'react'
import PropTypes from "prop-types";

const PaymetricsHostedIframe = (props) => {
  const {id, iframeURL} = props

  const frameOnload = (id, URL) =>{
    $XIFrame.onload({
      iFrameId: id,
      targetUrl:URL,
      autosizeheight: true,
      autosizewidth: true,
      autosizedelay: 100,
      onSuccess (e) {
        console.log('frame loaded', e)
      },
      onError (e) {
        console.log('frame failed to load', e)
      }
    });
  }

  return (
    <div id='c-paymetric-custom-html'>
      <div className="row">
        <iframe
          className="c-paymetric-iframe"
          id={id}
          src={iframeURL}
          width='100%'
          onLoad={()=>frameOnload(id, iframeURL)}
        />
      </div>
    </div>
  )
}

export default PaymetricsHostedIframe;

PaymetricsHostedIframe.defaultProps = {
  availableCardTypes: PropTypes.array.isRequired,
  locale: PropTypes.string.isRequired,
  resultCallback: PropTypes.func.isRequired,
}

