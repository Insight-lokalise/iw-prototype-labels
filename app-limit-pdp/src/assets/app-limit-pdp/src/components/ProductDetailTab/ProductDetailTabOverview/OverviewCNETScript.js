import React, {useContext, useEffect, useLayoutEffect} from 'react'
import { getCnetConifg } from '../../../lib/locale'
import { PDPContext } from '../../../context'
import broadcast from '@insight/toolkit-utils/lib/events/broadcast'

const CCS_MKT_DESC = "ccs-mkt-desc";
const CCS_INLINE = "ccs-inline";
export const OverviewCNETScript = () => {
  const { product, setHasCNETData } = useContext(PDPContext)
  const hasCNETCallback = () => {
    setHasCNETData(true);
  };
  useEffect(() => {
    const options = { childList: true }
    const mutationObserver = new MutationObserver(hasCNETCallback)
    mutationObserver.observe(document.getElementById(CCS_MKT_DESC), options)
    mutationObserver.observe(document.getElementById(CCS_INLINE), options)
    return () => {
        if (mutationObserver != null) {
          mutationObserver.disconnect();
        }
    }
  }, []);
  // Check and return if cloud assets is not enabled
  if (!product.cloudAssetsEnabled) return null

  // Generate script tag
  const cnetScript = document.createElement('script')
  cnetScript.type = 'text/javascript'
  cnetScript.async = true
  cnetScript.src = `${
    document.location.protocol === 'https:' ? 'https://' : 'http://'
  }cdn.cs.1worldsync.com/jsc/h1ws.js`

  const fetchCnetConifg = async () => {
    const config = await getCnetConifg()
    window.ccs_cc_args = window.ccs_cc_args || []
    // Add ccs args to global window ccs args
    window.ccs_cc_args.push(['mf', product.manufacturer?.name])
    window.ccs_cc_args.push(['pn', product.manufacturer?.partNumber])
    window.ccs_cc_args.push(['lang', config.language])
    window.ccs_cc_args.push(['market', config.market])
    // Set main zone id and skey
    const o = window.ccs_cc_args
    o.push(['_SKey', config.sKey])
    o.push(['_ZoneId', config.cesZoneId || config.inlineZoneId])
    // Append script tag to dom
    document.body.appendChild(cnetScript)
  }
  const cnetCallback = () => {
    broadcast('cnet:rendered')
  }
  useLayoutEffect(() => {
    fetchCnetConifg()
    window.ccs_cc_ready = cnetCallback
    return () => document.body.removeChild(cnetScript)
  }, [])

  return (
    <React.Fragment>
      <div id={CCS_MKT_DESC} />
      <div id={CCS_INLINE} />
    </React.Fragment>
  )
}
