import React, {useContext, useEffect} from 'react'
import {OverviewCNETScript} from './OverviewCNETScript'
import {OverviewOverride} from './OverviewOverride'
// eslint-disable-next-line import/first
import { t } from "@insight/toolkit-utils/lib/labels"
import {PDPContext} from "../../../context";


export const ProductDetailTabOverview = () => {
    const { overview, hasCNETData } = useContext(PDPContext)
    const NO_INFO_AVAIL =  "no-info-avail";

    useEffect(() => {
        // delay the display of 'No info available by a second'
        setTimeout(()=>{
            document.getElementById(NO_INFO_AVAIL).className='';
        } , 1000)
    }, [])

    return (
      <div className="c-product-tabs__overview">
        {!overview && !hasCNETData && (
        <div id={NO_INFO_AVAIL} className='u-hide'>{t('No additional information available')}</div>)}
        <OverviewOverride />
        <OverviewCNETScript />
      </div>
    )
}


export default ProductDetailTabOverview
