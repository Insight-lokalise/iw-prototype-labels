import React from "react"
import {t} from '@insight/toolkit-utils'

export const ProrationMessage = () => (
    <div className="c-product-specifications__pricing__proration">
        <b>{t('Software Agreement:')} </b>{t('The price displayed will be prorated in the cart based on the remaining agreement period.')}
    </div>
)