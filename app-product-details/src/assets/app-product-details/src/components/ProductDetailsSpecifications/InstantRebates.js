import React, { useContext } from 'react'
import { Icon, connectToLocale, currencyFormat } from '@insight/toolkit-react'
import {PDPContext} from "../../context"
import { t } from '@insight/toolkit-utils'
import cn from 'classnames'

function InstantRebates ({context}) {

    const {locale} = context
    const { product } = useContext(PDPContext)
    const tz = "MST"; //use MST timezone
    const tzOffset = ` 23:59:59 ${tz}`; //Consider the end of day offset with timezone
    const endDate = product?.instantRebateEndDate !== null ? new Date(product.instantRebateEndDate
                        .replaceAll("-","/") + tzOffset) : null;

    if (product?.instantRebateAmount !== null && endDate !== null && (endDate >= new Date())) {

        const dateFormatShort = { month:'short', day:'numeric', timeZone: tz}
        const dateFormatLong = { year: 'numeric', month:'short', day:'numeric', timeZone: tz}
        const dateLocale = locale.replace('_', '-')
        const formattedDateShort = endDate.toLocaleDateString(dateLocale, dateFormatShort)
        const formattedDateLong = endDate.toLocaleDateString(dateLocale, dateFormatLong)
        const rebateAmt = Number(product.instantRebateAmount).toFixed(2)
        const {value} = currencyFormat(rebateAmt, locale, product?.price?.currency, false)
        const toolTipMsg = `${t('Advertised price includes')} ${value} ${t('instant savings')}, ${t('valid until')} ${formattedDateLong}`
        const rebateText = `${t('Save')} ${value} ${t('instantly')}, ${t('ends')} ${formattedDateShort}`
        return (
            <div className={cn('c-product-specifications__instant-rebates',
                {'c-product-specifications__instant-rebates__large': locale == 'fr_CA'})} title={toolTipMsg}>
                <div className="promo_ribbon">
                    <Icon icon="promo-ribbon" />
                </div>
                <div className="rebate-text">
                    {rebateText}
                </div>
            </div>
        )
    } else {
        return null;
    }
}

export default connectToLocale(InstantRebates)
