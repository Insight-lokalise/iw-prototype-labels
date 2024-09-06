import React from 'react'
import { t } from '@insight/toolkit-utils/lib/labels'
import getInObject  from '@insight/toolkit-utils/lib/helpers/getInObject'

import { IWAnchor, IWImage } from './../../../../libs/iw-components'
import ROUTES from './../../../../libs/routes'

export default function CheckoutAppHeaderPrintView(props) {
    const { defaultShippingAddress, isLoggedIn, webLoginProfile, pathname } = props
    const hideHeaderShippingAddressInPrint = pathname !== ROUTES.VIEW_CART
    if (isLoggedIn && !defaultShippingAddress) return null

    return (<section className={"cart-print-header " + props.className} aria-label={t('Cart')}>
        <header className="row">
            <IWAnchor className="column flex-child-shrink" href="/insightweb/welcome">
                <IWImage src={getLogoSRC(webLoginProfile)} alt={t('Welcome to Insight')} className="cart-print-header__logo"/>
            </IWAnchor>
            <div className="column text-right">
                <span className="cart-print-header__icon--close ion-ios-close-empty"
                    onClick={props.togglePrintPreview.bind(null, false)}
                    onKeyPress={event => event.which === 13 && props.togglePrintPreview(false)}></span>
                <div className="cart-print-header__actions">
                    <span className="cart-print-header__icon--print ion-ios-printer-outline"
                        onClick={props.onPrint}
                        onKeyPress={event => event.which === 13 && props.onPrint()}></span>
                    <span className="cart-print-header__sep"></span>
                    <span className="cart-print-header__telephone">{props.phoneNumberToDisplay}</span>
                </div>
            </div>
        </header>
        { isLoggedIn && defaultShippingAddress && !hideHeaderShippingAddressInPrint
            ? <section className="cart-print-header__attention">
                <div className="row">
                    <div className="column">
                        <h3 className="cart-print-header__title">{t('Cart')}</h3>
                    </div>
                </div>
                <div className="row cart-print-header__address">
                    { defaultShippingAddress.shippingName
                        ? <div className="column small-3">
                        <h5 className="cart-print-header__address-header">{t('Attention:')}</h5>
                        <span>{defaultShippingAddress.shippingName}</span>
                    </div>
                    : null }
                    { defaultShippingAddress.shippingAddress1
                        ? <div className="column small-4">
                            <h5 className="cart-print-header__address-header">{t('Shipping address:')}</h5>
                            <span>{defaultShippingAddress.shippingCompany}</span><br />
                            <span>{defaultShippingAddress.shippingAddress1}</span><br />
                            <span>{`${defaultShippingAddress.shippingCity}, `}</span>
                            <span>{defaultShippingAddress.shippingState}</span><br/>
                            <span>{defaultShippingAddress.shippingCountry}</span><br />
                            <span>{defaultShippingAddress.shippingZip}</span>
                        </div>
                        : null }
                    <div className="column flex-child-shrink">
                        { defaultShippingAddress.shippingPhone
                            ? <div><h5 className="cart-print-header__address-header">{t('Phone:')}</h5>
                        <span>{defaultShippingAddress.shippingPhone}</span>
                        <br /><br /></div>
                        : null }

                        { defaultShippingAddress.shippingFax
                            ? <div><h5 className="cart-print-header__address-header">{t('Fax:')}</h5>
                        <span>{defaultShippingAddress.shippingFax}</span>
                        <br /></div>
                        : null }
                    </div>
                </div>
            </section>
            : null }
    </section>)
}

/**
 * Add parentheses around the first segment of a dash-separated phone number.
 * @param {String} dashSeparatedPhoneNumber
 * @return {String} a parenthesized-form of @param dashSeparatedPhoneNumber
 */
// function parenthesize(dashSeparatedPhoneNumber) {
//     if (dashSeparatedPhoneNumber == null || dashSeparatedPhoneNumber === '') return ''
//     const sections = dashSeparatedPhoneNumber.split('-')
//     if (sections[0].startsWith('(')) return ''
//     return `(${sections[0]})-${sections[1]}-${sections[2]}`
// }

function getLogoSRC(webLoginProfile) {
    const isDebrand = getInObject(window, [ 'Insight', 'b2bLoginInfo', 'debrandSite' ], false)
    const customMasthead = getInObject(window, [ 'Insight', 'b2bLoginInfo', 'customMastheadFooter' ], '')
    // Reviewer: In the previous .html template, we create the url from the locale-based source. What should we do here?
    const assetsurl = '/insightweb/assets/en_US/'

    if(isDebrand && customMasthead === 'ITS'){
        return `${assetsurl}/ccms_img/enpointe-logo.svg`
    }else{
        const brandingType = webLoginProfile && webLoginProfile.brandingType
        let logoSRC = `${assetsurl}/ccms_img/insight-home-logo.gif`
        if (brandingType === 'Diversity') {
            logoSRC = 'https://uat1-assets.insight.com/image/diversity_logos/${webLoginProfile.soldToNumber}.gif'
        } else if (brandingType === 'CSSIBranding') {
            logoSRC = `${assetsurl}/ccms_img/westernBlueInsightIpsHp_mainHeader.png`
        } else if (brandingType === 'IPS') {
            logoSRC = `${assetsurl}/ccms_img/insight-home-ips-logo.gif`
        }
        return logoSRC
    }
}
