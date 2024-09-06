import React, { Fragment } from 'react'
import { convertToTable, sendEmail, htmlEmail, getAlignMarkup } from '../../models/Email';
import outlookCartCSS from 'raw-loader!./OutlookCart.css.txt';
import outlookReviewCSS from 'raw-loader!./OutlookReview.css.txt';
import ReactDOMServer from 'react-dom/server';
import { t } from '@insight/toolkit-utils/lib/labels'
import get from 'lodash-es/get';
import reduce from 'lodash-es/reduce'
import map from 'lodash-es/map'

import { getCurrentLocale } from '@insight/toolkit-utils/lib/helpers/localeHelpers'
import { Locale } from '@insight/toolkit-react/lib/Locale/Locale'
import Currency from '@insight/toolkit-react/lib/Currency/Currency'
import ToolkitDate from "@insight/toolkit-react/lib/Date/Date";

import { makeProductDetailURL } from './../../models/Products/productDetails'
import { IWAnchor, IWImage } from '../../iw-components'
import { ApprovedItem, StandardsProduct } from '../../../libs/businessContainerApps/cart/components/cartSFCs'
import { showCarrierChargeMessage } from '../../../app/libs/utils'
import {filterBundleDEPItems, filterNonDEPCartItems} from "../cart/helpers";
import getInObject from "@insight/toolkit-utils/lib/helpers/getInObject";
import {productImageToRender} from "./../../models/Products";

export const SendToColleague = (emailData) => {
    const {
      cart,
      configLabels,
      consortiaID,
      creditCardMessage,
      currencyFormat,
      hasAdditionalOrderInformation,
      hasLabConfigurationNotes,
      hasInvoiceNotes,
      hasAdditionalOrderNotes,
      hasFileUpload,
      hasUserPreferences,
      headerLevelSmartTrackers,
      isEMEA,
      ipsUser,
      isNavy,
      sendToOptions,
      shoppingRequest = null,
      showOrderReviewDetails = false,
      showOrderReceiptDetails = false,
      showProductImages,
      transportsToDetermine,
      navySTName,
      user,
    } = emailData
    const showReviewSection = (showOrderReviewDetails || showOrderReceiptDetails)
    const showReceiptSection = showOrderReceiptDetails
    const isDebrand = getInObject(window, [ 'Insight', 'b2bLoginInfo', 'debrandSite' ], false)
    const customMasthead = getInObject(window, [ 'Insight', 'b2bLoginInfo', 'customMastheadFooter' ], '')
    let linkBase = sendToOptions.linkBase || '';
    let sp = (<span className="cart-footer__space">-</span>);
    let linkSep = (<span><span className="cart-footer__space">----</span>|<span className="cart-footer__space">----</span></span>);
    const localeValue = getCurrentLocale("insight_current_locale", "insight_locale")
    /*
     * Send to Colleague - Header
     */
    let getHeaderMarkup = () => {
        return ReactDOMServer.renderToStaticMarkup((
            <table className="send-to-colleague">
                <tbody>
                <tr>
                    <td className="send-to-colleague__logo-cell">
                        <IWAnchor href={get(sendToOptions, 'emailLinkBase')}>
                            {isDebrand && customMasthead === 'ITS' ?  <IWImage className='send-to-colleague__logo' src={`${sendToOptions.emailLinkBase}/content/dam/insight-web/logos/enpointe.svg`} alt='ITS' width="190" height="85" />
                                :  <IWImage className='send-to-colleague__logo' src={get(sendToOptions, 'emailLogoURL')} alt='Insight' width="190" height="85" />
                            }

                        </IWAnchor>
                    </td>
                    <td className="send-to-colleague__phone-cell">
                        {isEMEA ?
                            <span>
                              <IWAnchor className="send-to-colleague__phone"
                                href={get(sendToOptions, 'emailEMEAContactUsURL')}>{t('Contact us')}</IWAnchor>
                              <span style={{color: '#CBC4C3'}} className="vertical-separator">{' '}| {' '}</span>
                              <span style={{color: '#222'}}>{configLabels.phoneNumber}</span>
                            </span>
                        :
                          <IWAnchor className="send-to-colleague__phone"
                          href={get(sendToOptions, 'contactUsURL')}>{ get(sendToOptions, 'phoneNumberToDisplay') }</IWAnchor>

                        }
                    </td>
                </tr>
                </tbody>
            </table>
        ));
    };


    /*
     * Send to Colleague - Salutation Section
     */
    let getSalutationMarkup = () => {
      var message = `${t("Message from Insight at the request of")} `
      var at = ` ${t("at")} `
      var subject =  message + get(sendToOptions, "yourName", t("Unknown Person"))
        return ReactDOMServer.renderToStaticMarkup((
            <table>
                <tbody>
                <tr className="send-to-colleague__salutation">
                    <td className="send-to-colleague__message">
                        {subject}
                    </td>
                </tr>
                <tr className="send-to-colleague__comment">
                    <td>
                        <div className="send-to-colleague__comment-text">{ get(sendToOptions, 'yourComments', '') }</div>
                    </td>
                </tr>
                </tbody>
            </table>
        ));
    };

    /*
     * Send to Colleague - Ship To Destination Details (Attention, Address, Phone, Fax)
     */
    let getAddressMarkup = () => {
        let spanIfExists = (content) => {
            if (content) {
                return (
                    <span>{content}<br/></span>
                );
            }
            return '';
        }
        var shipaddr = get(user, 'defaultShippingAddress');
        var shippingName = '';
        var shippingCompany = '';
        var shippingAddress1 = '';
        var shippingAddress2 = '';
        var shippingAddress3 = '';
        var shippingCityStateZip = '';
        var shippingCountry = '';
        var shippingPhone = '';
        var shippingFax = '';
        if (shipaddr) {
            // If both shippingName and shippingCompany exist, prepend Attn: to Shipping name.
            if (get(shipaddr, "shippingName") && get(shipaddr, "shippingCompany")) {
                shippingName = spanIfExists(t("Attn:") + get(shipaddr, "shippingName"));
            } else {
                shippingName = spanIfExists(get(shipaddr, "shippingName"));
            }

            shippingCompany = spanIfExists(get(shipaddr, "shippingCompany"));
            shippingAddress1 = spanIfExists(get(shipaddr, "shippingAddress1"));
            shippingAddress2 = spanIfExists(get(shipaddr, "shippingAddress2"));
            shippingAddress3 = spanIfExists(get(shipaddr, "shippingAddress3"));

            let _shippingCity = get(shipaddr, "shippingCity");
            let _shippingState = get(shipaddr, "shippingState");
            let _shippingZip = get(shipaddr, "shippingZip");
            if (_shippingCity) {
                shippingCityStateZip = (
                    <span>{_shippingCity}, {_shippingState}{_shippingZip}<br/></span>
                )
            }
            shippingCountry = spanIfExists(get(shipaddr, "shippingCountry"));

            var _shippingPhone = get(shipaddr, "shippingPhone");
            if (_shippingPhone) {
                shippingPhone = (
                    <span>
                    <span className="cart-address__label">{t("Phone:")}</span> <span>{_shippingPhone}<br/></span>
                </span>
                )
            }
            var _shippingFax = get(shipaddr, "shippingFax");
            if (_shippingFax) {
                shippingFax = (
                    <span>
                    <span className="cart-address__label">{t("Fax:")}</span> <span>{_shippingFax}<br/></span>
                </span>
                )
            }
        }

        return ReactDOMServer.renderToStaticMarkup((
            <table id="cart-address">
                <tbody>
                <tr>
                    <td>
                    <span>
                        { transportsToDetermine &&
                            showCarrierChargeMessage()
                        }
                        <span className="cart-address__label">{t('Shipping Address:')}</span><br/>
                        {shippingName}
                        {shippingCompany}
                        {shippingAddress1}
                        {shippingAddress2}
                        {shippingAddress3}
                        {shippingCityStateZip}
                        {shippingCountry}
                        <br/>
                        {shippingPhone}
                        {shippingFax}
                        <br/>
                    </span>
                    </td>
                </tr>
                </tbody>
            </table>
        ));
    };

    //  convert the cart to a table
    let getMessagesMarkup = () => {
        return convertToTable('.shopping-cart__messages', {
            id: "shopping-cart-messages",
            tableClassName: "",
            linkBase: linkBase,
            rowVariance: 8,
            colVariance: 10,
            minVisibleHeight: 2,
            minVisibleWidth: 2,
            hideClassList: ["hide-for-print", "hide-for-email"],
            rowClassList: ["iw-message__text"],
            cellClassList: ["iw-message__text","shopping-cart__carrier-charge-message"],
        });
    };

    //  convert the cart to a table
    let getUsageReportingMarkup = () => {
        return convertToTable('.usage-reporting', {
            id: "shopping-cart-usage-reporting",
            tableClassName: "",
            linkBase: linkBase,
            rowVariance: 8,
            colVariance: 10,
            minVisibleHeight: 2,
            minVisibleWidth: 2,
            hideClassList: ["hide-for-print"],
            rowClassList: ["iw-message__text"],
            cellClassList: ["iw-message__text"],
        });
    };

    //  convert the cart to a table
    let getCartMarkup = () => {
        let origin = document.location.origin;
        return convertToTable('section.cart', {
            id: "shopping-cart",
            tableClassName: "",
            linkBase: linkBase,
            rowVariance: 10,
            colVariance: 10,
            minVisibleHeight: 2,
            minVisibleWidth: 2,
            beforeClassList: [
                {name: "cart__stock-icon--in-stock", translation: '<img src="'+origin+'/content/dam/insight-web/en_US/campaigns/generic/emailIcons/ico-check.png"> '},
                {name: "c-ion-ios-pricetag--purple", translation: '<img src="'+origin+'/content/dam/insight-web/en_US/campaigns/generic/emailIcons/ico-pricetag.png"> '},
                {name: "cart__approved-item-icon", translation: '<img src="'+origin+'/content/dam/insight-web/en_US/campaigns/generic/emailIcons/ico-check-blue.png"> '}
            ],
            hideClassList: ["hide-for-email", "cart__header"],
            rowClassList: ["cart__item-heading", "cart__table-header", "line-level__table", "proration__deploy-details"],
            cellClassList: ["cart__item-part", "cart__header-title", "cart__header-empty",
                "cart__table-col--trash", "cart__table-col--image", "iw-currency", "cart__table-col--qty"],
        });
    };

    let getSummaryMarkup = () => {
        //  Convert cartSummary to table - remember there is a cartSummary with display none on the page so get the visible one.
        let cartSummaries = document.querySelectorAll('div.cart-summary__totals');
        let summary = '';
        for (var i = 0; i < cartSummaries.length; i++) {
            var cartSummary = cartSummaries[i];
            var cartSummaryHidden = !cartSummary.offsetParent;
            if (!cartSummaryHidden) {
                summary = convertToTable(cartSummary, {
                    id: 'cart-summary',
                    linkBase: linkBase,
                    rowVariance: 8,
                    colVariance: 10,
                    minVisibleHeight: 2,
                    minVisibleWidth: 2,
                    hideClassList: ['hide-for-print'],
                    rowClasses: ['cart__table-header'],
                    cellClasses: ['cart__table-item', 'iw-currency']
                });
                return summary;
            }
        }
        return '';
    };

    let getFooterMarkup = () => {
        return ReactDOMServer.renderToStaticMarkup((
          (isEMEA ?
            <table>
              <tr>
                <td align="center" valign="middle" style={{fontSize: '12px', lineHeight: '18px', padding: '20px 0px', color: '#222222', background: '#E6E6E5',fontFamily: 'Arial, Arial sans-serif'}}>
                  <div style={{fontSize: '12px', fontWeight: 'bold'}}>{t('Revolutionize the way you manage technology')}</div>
                  <table width="100%" style={{background: '#E6E6E5'}}>
                    {configLabels.newsLetterLink ?
                      <tr>
                        <td style={{width:'50%',textAlign:'right',paddingRight: '20px'}}>
                          <table style={{background: '#E6E6E5'}}>
                            <tr>
                              <td style={{textAlign:'right',fontSize: '12px'}}>
                                <span>{t('Learn more about')}{' '}</span>
                                <IWAnchor href={get(sendToOptions, 'loginURL')}>
                                  <span>{t('Insight')}</span>
                                </IWAnchor>
                              </td>
                            </tr>
                          </table>
                        </td>
                        <td style={{width:'50%',textAlign:'left',paddingLeft: '20px',fontSize: '12px',verticalAlign: 'center'}}>
                          <table style={{background: '#E6E6E5'}}>
                            <tr>
                              <td style={{ width:'3%',marginTop: '30px'}}>
                                <span style={{ verticalAlign: 'bottom'}}>
                                  <img src="https://www.insight.com/content/dam/insight/bgimages/social/25x23/ico-newsLetter2.png" alt="Get the Newsletter" />
                                </span>
                              </td>
                              <td style={{fontSize: '12px',marginTop: '30px',verticalAlign: 'bottom',paddingLeft:'5px'}} >
                                <IWAnchor style={{ verticalAlign: 'bottom'}}  href={get(sendToOptions,'emailLinkBase')+configLabels.newsLetterLink} title="Get the Newsletter">
                                  <span>{t('Get the Newsletter')}</span>
                                </IWAnchor>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr> :
                      <tr>
                        <td style={{textAlign:'center',fontSize: '12px'}}>
                          <span>{t('Learn more about')}{' '}</span>
                          <a href={get(sendToOptions, 'loginURL')}><span>{isEMEA ? 'Insight' :t('insight.com account')}</span></a>
                        </td>
                      </tr>
                    }
                      <br />
                  </table>
                </td>
              </tr>
              <tr>
                <td align="center"
                    style={{lineHeight:'20px', paddingTop: '20px', paddingBottom: '20px', fontSize: '12px',background: '#5F5753',color: '#fff',borderBottom: '1px solid #6F6764',fontFamily: 'Arial, Arial sans-serif'}}>
                  <div>{configLabels.footerCompanyInfo1}</div>
                  <div>{configLabels.footerCompanyInfo2}</div>
                  <div>{configLabels.footerCompanyInfo3}</div>
                </td>
              </tr>
              <tr>
                <td align="center" style={{padding: '20px 20px',background: '#5F5753'}}>
                  <a href={configLabels.linkedInLink} title="Follow Insight on LinkedIn" style={{color: '#FFFFFF', textDecoration : 'none',paddingRight:'25px'}}>
                    <img src="https://www.insight.com/content/dam/insight/bgimages/social/25x23/ico-linkedIn.png" alt="Follow Insight on LinkedIn" border="0" />
                  </a>
                  {configLabels.fbLink && <a href={configLabels.fbLink} title="Follow Insight on Facebook" style={{color: '#FFFFFF', textDecoration : 'none',paddingRight:'25px'}}>
                    <img src="https://www.insight.com/content/dam/insight/bgimages/social/25x23/ico-fb.png" alt="Follow Insight on Facebook" border="0" />
                  </a>}
                  {configLabels.twitterLink && <a href={configLabels.twitterLink} title="Follow Insight on Twitter" style={{color: '#FFFFFF', textDecoration : 'none',paddingRight:'25px'}}>
                    <img src="https://www.insight.com/content/dam/insight/bgimages/social/25x23/ico-twitter.png" alt="Follow Insight on Twitter" border="0" />
                  </a>}
                  {configLabels.youtubeLink && <a href={configLabels.youtubeLink} title="Follow Insight on YouTube" style={{color: '#FFFFFF', textDecoration : 'none',paddingRight:'25px'}}>
                    <img src="https://www.insight.com/content/dam/insight/bgimages/social/25x23/ico-youTube.png" alt="Follow Insight on YouTube" border="0" />
                  </a>}
                  {configLabels.xingLink && <a href={configLabels.xingLink} title="Follow Insight on Xing" style={{color: '#FFFFFF', textDecoration : 'none',paddingRight:'25px'}}>
                    <img src="https://www.insight.com/content/dam/insight/bgimages/social/25x23/ico-xing.png" alt="Follow Insight on Xing" border="0" />
                  </a>}
                  {configLabels.instagramLink && <a href={configLabels.instagramLink} title="Follow Insight on Instagram">
                    <img src="https://www.insight.com/content/dam/insight/bgimages/social/25x23/ico-ig.png" alt="Follow Insight on Instagram" border="0" />
                  </a>}
                </td>
              </tr>
              <tr>
                <td align="center" style={{color: '#fff',fontSize: '12px',paddingTop: '20px', paddingBottom: '20px', paddingRight: '0px',borderTop: '1px solid #6F6764', background: '#5F5753',fontFamily: 'Arial, Arial sans-serif'}}>
                  <span>
                    <a style={{fontWeight: 'normal', textDecoration: 'none',color: '#fff', paddingRight: '10px'}} href={get(sendToOptions,'emailLinkBase')+configLabels.privacyPolicyLink}><span>{t('Privacy Policy')}</span></a>
                    <span className="vertical-separator">{' '}|{' '}</span>
                    {consortiaID !== 0 ?
                      <a style={{fontWeight: 'normal', textDecoration: 'none',color: '#fff', paddingLeft: '10px'}} href={get(sendToOptions,'emailLinkBase')+configLabels.termsAndConditionsLink+'?c='+consortiaID}><span>{t('Terms and Conditions')}</span></a>
                      :
                      <a style={{fontWeight: 'normal', textDecoration: 'none',color: '#fff', paddingLeft: '10px'}} href={get(sendToOptions,'emailLinkBase')+configLabels.termsAndConditionsLink}><span>{t('Terms and Conditions')}</span></a>
                    }
                  </span>
                </td>
              </tr>
            </table>
            :
              <table className="cart-footer">
                <tbody>
                  <tr>
                    <td className="cart-footer__legal">
                      <p>
                        <IWAnchor href={get(sendToOptions, 'emailLinkBase')}>
                        {isDebrand && customMasthead === 'ITS' ?  <IWImage className='send-to-colleague__logo' src={`${sendToOptions.emailLinkBase}/content/dam/insight-web/logos/enpointe.svg`}
                          alt='ITS' width="190" height="85" />
                        :  <IWImage className='send-to-colleague__logo' src={get(sendToOptions, 'emailLogoURL')} alt='Insight' width="190" height="85" />
                        }
                        </IWAnchor>
                        <br/><strong>{t('Insight respects your privacy.')}</strong><br/>
                        {t('We will never rent, lend or sell your email address or other contact information to another organization.')}<br/>
                        <IWAnchor title={t('Privacy Policy')} className="cart-footer__link"
                          href={get(sendToOptions, 'emailPrivacyPolicyURL')}>{t('Privacy Policy')}</IWAnchor>
                          {linkSep}<IWAnchor
                          title={t('Business and return policies')} className="cart-footer__link"
                          href={get(sendToOptions, 'emailReturnPolicyURL')}>{t('Business and return policies')}</IWAnchor>
                          {linkSep}<IWAnchor
                          title={t('Customer support')} className="cart-footer__link"
                          href={get(sendToOptions, 'emailContactUsURL') + "refcode='footer'"}>
                            {t('Customer support')}
                        </IWAnchor><br/>
                        <br/>{t('Copyright')} 1988-{ new Date().getFullYear() }{sp}
                        {t('2701 E. Insight Way Chandler, AZ 85286')}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td className="cart-footer__legal">{t('Copyright')} { new Date().getFullYear() }{sp}
                      {t('Insight Direct USA, Inc.')}{sp}
                      {t('All rights reserved. Insight is a registered trademark of')}{sp}{t('Insight Direct USA, Inc.')}{sp}
                      {t('All other company and product names are trademarks or service marks of their respective owners.For all prices and products, we reserve the right to make adjustments due to errors, changing market conditions, product discontinuations or typographical errors. Please contact your Insight representative if you have any questions.')}<br/><br/><br/>
                    </td>
                  </tr>
                </tbody>
              </table>)
        ));
    };
    function prepareCartPageMarkup() {
        const headerMarkup = getHeaderMarkup();
        const salutationMarkup = getSalutationMarkup();
        const addressMarkup = getAddressMarkup();
        const messagesMarkup = getMessagesMarkup();
        const usageReportingMarkup = getUsageReportingMarkup();
        const cartMarkup = getCartMarkup();
        const summaryMarkup = getSummaryMarkup();
        const alignSummaryMarkup = getAlignMarkup({ align: 'right', width: 300, content: summaryMarkup });
        const footerMarkup = getFooterMarkup();
        //  Build final email from all of the markup created.

        const content =
            headerMarkup +
            salutationMarkup +
            (isEMEA ? '': addressMarkup) +
            messagesMarkup +
            usageReportingMarkup +
            cartMarkup + "<br/>" +
            alignSummaryMarkup +
            footerMarkup;


        return htmlEmail({
            css: outlookCartCSS,
            maxWidth: 1000,
            body: content,
        });
    }
    let _htmlEmail = ''
    if (!showReviewSection) {
        _htmlEmail = prepareCartPageMarkup()
    } else {
        const updatedSmartTrackers = shoppingRequest.orderMetaData ?
                                     nameValuePairSmartTrackers(headerLevelSmartTrackers, shoppingRequest.orderMetaData.smartTracker) : []
        _htmlEmail = prepareReviewPageMarkup({
            sendToOptions,
            user,
            currencyFormat,
            shoppingRequest,
            showReceiptSection,
            showProductImages,
            updatedSmartTrackers,
            cart,
            ipsUser,
            isNavy,
            navySTName,
            hasAdditionalOrderInformation,
            hasLabConfigurationNotes,
            hasInvoiceNotes,
            hasAdditionalOrderNotes,
            hasFileUpload,
            hasUserPreferences,
            transportsToDetermine,
            outlookReviewCSS,
            creditCardMessage,
        })
    }

    var message = `${t("Message from Insight at the request of")} `
    var subject =  message + get(sendToOptions, "yourName", t("Unknown Person"));
    return sendEmail({
        sendEmailURL: sendToOptions.sendEmailURL,
        to: get(sendToOptions, "recipientEmail"),
        from: get(sendToOptions, "yourEmail"),
        subject: subject,
        content: _htmlEmail
    });
};

function nameValuePairSmartTrackers(headerLevelSmartTrackers, shoppingReqSmartTrackers) {
    const userSelectedSmartTrackersMap = reduce(shoppingReqSmartTrackers, (acc, smartTracker) => {
        acc[smartTracker.id] = smartTracker.value || ''
        return acc
    }, {})
    return map(headerLevelSmartTrackers, (smartTracker) =>
        ({
            name: smartTracker.name,
            value: userSelectedSmartTrackersMap[smartTracker.lineLevelId] || smartTracker.value,
        })
    )
}

function prepareReviewPageMarkup(data) {
    const {
            sendToOptions,
            shoppingRequest,
            currencyFormat,
            showReceiptSection,
            showProductImages,
            updatedSmartTrackers,
            cart,
            numberOfItemsInCart,
            ipsUser,
            isNavy,
            navySTName,
            hasAdditionalOrderInformation,
            hasLabConfigurationNotes,
            hasInvoiceNotes,
            hasAdditionalOrderNotes,
            hasFileUpload,
            hasUserPreferences,
            transportsToDetermine,
            outlookReviewCSS,
            creditCardMessage,
        } = data
    const { shipping, billing, orderDate, orderMetaData } = shoppingRequest
    const { additionalShippingNotificationEmail, carrier } = shipping
    const { payment } = billing
    const { additionalOrderInformation = {}, file = {} } = orderMetaData
    const { invoiceNotes = '' , orderNotes = '', labConfigNotes = ''} = additionalOrderInformation
    const emails = additionalShippingNotificationEmail ? additionalShippingNotificationEmail.split(';') : []
    const isDebrand = getInObject(window, [ 'Insight', 'b2bLoginInfo', 'debrandSite' ], false)
    const customMasthead = getInObject(window, [ 'Insight', 'b2bLoginInfo', 'customMastheadFooter' ], '')
    const message = `${t('Message from Insight at the request of')} `
    const subject =  message + get(sendToOptions, "yourName", t("Unknown Person"));
    const localeValue = getCurrentLocale("insight_current_locale", "insight_locale")


    //get email summary section from page, this is needed to reuse redux data
    const getReviewSummaryMarkup = () => {
        return document.querySelectorAll('.cart-summary-email-container')[0].innerHTML
    };

    return ReactDOMServer.renderToStaticMarkup((
        <Locale value={{ locale: localeValue }}>
        <div>
          <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
          <meta name="viewport" content="width=device-width" />
          <title>Receipt</title>
          <style>
              {outlookReviewCSS}
          </style>
          <span className="preheader" style={{color: '#e6e6e5', display: 'none !important', fontSize: 1, lineHeight: 1, maxHeight: 0, maxWidth: 0, msoHide: 'all !important', opacity: 0, overflow: 'hidden', visibility: 'hidden'}} />
          <table className="body" style={{margin: 0, background: '#f3f3f3 !important', borderCollapse: 'collapse', borderSpacing: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', height: '100%', lineHeight: '1.3', padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}>
            <tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}>
                <td className="center" align="center" valign="top" style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', hyphens: 'auto', lineHeight: '1.3', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}>
                  <center data-parsed style={{minWidth: 580, width: '100%'}}>
                    { /* Header section */ }
                    <table align="center" className="wrapper section float-center" style={{margin: '0 auto', borderCollapse: 'collapse', borderSpacing: 0, float: 'none', padding: 0, textAlign: 'center', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td className="wrapper-inner" style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', hyphens: 'auto', lineHeight: '1.3', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}>
                            <table align="center" className="container section__body" style={{margin: '0 auto', background: 'white', borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'inherit', verticalAlign: 'top', width: 580}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', hyphens: 'auto', lineHeight: '1.3', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}>
                                    <table className="spacer" style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td height="16px" style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', hyphens: 'auto', lineHeight: '16px', msoLineHeightRule: 'exactly', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}> </td></tr></tbody></table>
                                    <table className="row" style={{borderCollapse: 'collapse', borderSpacing: 0, display: 'table', padding: 0, position: 'relative', textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody>
                                        <tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}>
                                          <th className="small-12 large-6 columns first" valign="middle" style={{margin: '0 auto', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, paddingBottom: 16, paddingLeft: 16, paddingRight: 8, textAlign: 'left', width: 274}}><table style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><th style={{margin: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                    <a href={get(sendToOptions, 'emailLinkBase')} style={{margin: 0, color: '#ae0a46', fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left', textDecoration: 'none'}}>
                                                        {isDebrand && customMasthead === 'ITS' ?  <IWImage style={{msInterpolationMode: 'bicubic', border: 'none', clear: 'both', display: 'block', maxWidth: '100%', outline: 'none', textDecoration: 'none', width: 'auto'}} src='/content/dam/insight-web/logos/enpointe.svg' alt='ITS' width="190" height="85" />
                                                            :  <IWImage style={{msInterpolationMode: 'bicubic', border: 'none', clear: 'both', display: 'block', maxWidth: '100%', outline: 'none', textDecoration: 'none', width: 'auto'}}
                                                                        src={get(sendToOptions, 'emailLogoURL')} alt='Insight' width="190" height="85" />
                                                        }
                                                    </a>
                                                  </th></tr></tbody></table></th>
                                          <th className="small-12 large-6 columns last" valign="middle" style={{margin: '0 auto', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, paddingBottom: 16, paddingLeft: 8, paddingRight: 16, textAlign: 'left', width: 274}}><table style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><th style={{margin: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                    <p className="small-text-center text-right no-margin-bot tel-no" style={{margin: 0, marginBottom: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 20, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'right'}}>
                                                        <a href={get(sendToOptions, 'contactUsURL')} style={{margin: 0, color: '#ae0a46', fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left', textDecoration: 'none'}}>
                                                            { get(sendToOptions, 'phoneNumberToDisplay') }
                                                        </a>
                                                    </p>
                                                  </th></tr></tbody></table></th>
                                        </tr>
                                        <tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}>
                                            <th colSpan="2" className="small-12 large-6 columns first" valign="middle" style={{margin: '0 auto', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, paddingBottom: 16, paddingLeft: 16, paddingRight: 8, textAlign: 'left', width: 274}}>
                                                <div style={{width:'100%'}}>{subject}</div>
                                                <div style={{width:'100%'}}>{ get(sendToOptions, 'yourComments', '') }
                                                </div>
                                            </th>
                                        </tr>
                                        </tbody></table>
                                  </td></tr></tbody></table>
                          </td></tr></tbody></table>
                    { /* End Header section */ }

                    { showReceiptSection &&
                        <table className="spacer float-center" style={{margin: '0 auto', borderCollapse: 'collapse', borderSpacing: 0, float: 'none', padding: 0, textAlign: 'center', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td height="10px" style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 10, fontWeight: 'normal', hyphens: 'auto', lineHeight: '10px', msoLineHeightRule: 'exactly', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}> </td></tr></tbody></table>
                    }
                    { /* Receipt section */ }
                    { showReceiptSection &&
                        <table align="center" className="wrapper section float-center" style={{margin: '0 auto', borderCollapse: 'collapse', borderSpacing: 0, float: 'none', padding: 0, textAlign: 'center', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td className="wrapper-inner" style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', hyphens: 'auto', lineHeight: '1.3', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}>
                                <table align="center" className="container section__body" style={{margin: '0 auto', background: 'white', borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'inherit', verticalAlign: 'top', width: 580}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', hyphens: 'auto', lineHeight: '1.3', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}>
                                        <table className="spacer" style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td height="16px" style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', hyphens: 'auto', lineHeight: '16px', msoLineHeightRule: 'exactly', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}> </td></tr></tbody></table>
                                        { /* Thank you section */ }
                                        <table className="row" style={{borderCollapse: 'collapse', borderSpacing: 0, display: 'table', padding: 0, position: 'relative', textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}>
                                              <th className="small-12 large-12 columns first last" style={{margin: '0 auto', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, paddingBottom: 16, paddingLeft: 16, paddingRight: 16, textAlign: 'left', width: 564}}><table style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><th style={{margin: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>

                                                        <h2 style={{margin: 0, marginBottom: 10, color: 'inherit', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 22, fontWeight: 'bold', lineHeight: '1.3', padding: 0, textAlign: 'left', wordWrap: 'normal'}}>
                                                            {t('Thank you for your order')}</h2>
                                                        <p style={{margin: 0, marginBottom: 10, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                            {t('As soon as your order is processed you will receive an e-mail confirmation containing your order details.')}</p>

                                                        <table className="spacer" style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td height="5px" style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 5, fontWeight: 'normal', hyphens: 'auto', lineHeight: '5px', msoLineHeightRule: 'exactly', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}> </td></tr></tbody></table>
                                                        <hr style={{margin: '5px 0', background: '#e6e6e5', border: 0, fontSize: 0, height: 1}} />
                                                      </th>
                                                      <th className="expander" style={{margin: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: '0 !important', textAlign: 'left', visibility: 'hidden', width: 0}} /></tr></tbody></table></th>
                                            </tr></tbody></table>
                                        { /* End Thank you section */ }
                                        { /* Reference numbers for receipt */ }
                                        <table className="row" style={{borderCollapse: 'collapse', borderSpacing: 0, display: 'table', padding: 0, position: 'relative', textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}>
                                              <th className="small-12 large-5 columns first" style={{margin: '0 auto', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, paddingBottom: 16, paddingLeft: 16, paddingRight: 8, textAlign: 'left', width: '225.66667px'}}><table style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><th style={{margin: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                        <strong>{t('Reference number')}:</strong>
                                                        <p style={{margin: 0, marginBottom: 10, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                            {shoppingRequest.webReferenceNumber} ({t('In process')})</p>
                                                      </th></tr></tbody></table></th>
                                              <th className="small-12 large-4 columns" style={{margin: '0 auto', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, paddingBottom: 16, paddingLeft: 8, paddingRight: 8, textAlign: 'left', width: '177.33333px'}}><table style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><th style={{margin: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                        <strong>{t('Total')}:</strong>
                                                        <p style={{margin: 0, marginBottom: 10, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                        <Currency currencyCode={shoppingRequest.soldTo.currency} value={shoppingRequest.cart.summary.totalCost} />                                                            
                                                            </p>
                                                      </th></tr></tbody></table></th>
                                              <th className="small-12 large-3 columns last" style={{margin: '0 auto', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, paddingBottom: 16, paddingLeft: 8, paddingRight: 16, textAlign: 'left', width: 129}}><table style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><th style={{margin: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                        <strong>{t('Date ordered')}:</strong>
                                                        <p style={{margin: 0, marginBottom: 10, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                            <ToolkitDate date={orderDate} />
                                                        </p>
                                                      </th></tr></tbody></table></th>
                                            </tr></tbody></table>
                                        { /* End Reference numbers for receipt */ }
                                      </td></tr></tbody></table>
                              </td></tr></tbody></table>
                    }
                    { /* End Receipt section */ }
                    {updatedSmartTrackers.length > 0 &&
                        <table className="spacer float-center" style={{margin: '0 auto', borderCollapse: 'collapse', borderSpacing: 0, float: 'none', padding: 0, textAlign: 'center', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td height="10px" style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 10, fontWeight: 'normal', hyphens: 'auto', lineHeight: '10px', msoLineHeightRule: 'exactly', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}> </td></tr></tbody></table>
                    }
                    { /* Order information */ }
                      { hasAdditionalOrderInformation &&
                        <table align="center" className="wrapper section float-center" style={{margin: '0 auto', borderCollapse: 'collapse', borderSpacing: 0, float: 'none', padding: 0, textAlign: 'center', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td className="wrapper-inner" style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', hyphens: 'auto', lineHeight: '1.3', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}>
                                <table align="center" className="container section__header" style={{margin: '0 auto', background: '#5f5753', borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'inherit', verticalAlign: 'top', width: 580}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', hyphens: 'auto', lineHeight: '1.3', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}>
                                        <table className="row" style={{borderCollapse: 'collapse', borderSpacing: 0, display: 'table', padding: 0, position: 'relative', textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}>
                                              <th className="small-12 large-12 columns first last" style={{margin: '0 auto', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, paddingBottom: 16, paddingLeft: 16, paddingRight: 16, textAlign: 'left', width: 564}}><table style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><th style={{margin: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                        <h3 className="section__header-title no-margin-bot" style={{margin: 0, marginBottom: 0, marginTop: 16, color: 'white', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 18, fontWeight: 'bold', lineHeight: '1.3', padding: 0, textAlign: 'left', wordWrap: 'normal'}}>
                                                            {t('Order information')}</h3>
                                                      </th>
                                                      <th className="expander" style={{margin: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: '0 !important', textAlign: 'left', visibility: 'hidden', width: 0}} /></tr></tbody></table></th>
                                            </tr></tbody></table>
                                      </td></tr></tbody></table>
                            {updatedSmartTrackers.length > 0 &&
                                <table align="center" className="container section__body" style={{margin: '0 auto', background: 'white', borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'inherit', verticalAlign: 'top', width: 580}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', hyphens: 'auto', lineHeight: '1.3', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}>
                                        <table className="spacer" style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td height="16px" style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', hyphens: 'auto', lineHeight: '16px', msoLineHeightRule: 'exactly', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}> </td></tr></tbody></table>
                                        <table className="row" style={{borderCollapse: 'collapse', borderSpacing: 0, display: 'table', padding: 0, position: 'relative', textAlign: 'left', verticalAlign: 'top', width: '100%'}}>
                                            <tbody>
                                                {updatedSmartTrackers.map((smartTracker, index) => (
                                                    !(isNavy && (navySTName === smartTracker.name)) &&
                                                    <tr key={index} style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}>
                                                      <th className="small-12 large-6 columns" style={{margin: '0 auto', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, paddingBottom: 16, paddingLeft: 16, paddingRight: 8, textAlign: 'left', width: 274}}>
                                                          <table style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}>
                                                            <tbody>
                                                                <tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}>
                                                                    <th style={{margin: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                                        <strong>{smartTracker.name}:</strong>
                                                                        <p style={{margin: 0, marginBottom: 10, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                                        {smartTracker.value}</p>
                                                                    </th>
                                                                </tr>
                                                            </tbody>
                                                          </table>
                                                      </th>
                                                  </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                      </td></tr></tbody></table>
                            }
                            {hasAdditionalOrderNotes &&
                                <table align="center" className="container section__body" style={{margin: '0 auto', background: 'white', borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'inherit', verticalAlign: 'top', width: 580}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', hyphens: 'auto', lineHeight: '1.3', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}>
                                    <table className="spacer" style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td height="16px" style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', hyphens: 'auto', lineHeight: '16px', msoLineHeightRule: 'exactly', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}> </td></tr></tbody></table>
                                    <table className="row" style={{borderCollapse: 'collapse', borderSpacing: 0, display: 'table', padding: 0, position: 'relative', textAlign: 'left', verticalAlign: 'top', width: '100%'}}>
                                        <tbody>
                                            <tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}>
                                                <th className="small-12 large-6 columns" style={{margin: '0 auto', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, paddingBottom: 16, paddingLeft: 16, paddingRight: 8, textAlign: 'left', width: 274}}>
                                                    <table style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}>
                                                        <tbody>
                                                        <tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}>
                                                            <th style={{margin: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                                <strong>{t('Additional order notes')}:</strong>
                                                                <p style={{margin: 0, marginBottom: 10, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                                    {orderNotes}</p>
                                                            </th>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                </th>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td></tr></tbody></table>
                            }
                            {hasLabConfigurationNotes &&
                            <table align="center" className="container section__body" style={{margin: '0 auto', background: 'white', borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'inherit', verticalAlign: 'top', width: 580}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', hyphens: 'auto', lineHeight: '1.3', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}>
                                <table className="spacer" style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td height="16px" style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', hyphens: 'auto', lineHeight: '16px', msoLineHeightRule: 'exactly', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}> </td></tr></tbody></table>
                                <table className="row" style={{borderCollapse: 'collapse', borderSpacing: 0, display: 'table', padding: 0, position: 'relative', textAlign: 'left', verticalAlign: 'top', width: '100%'}}>
                                    <tbody>
                                    <tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}>
                                        <th className="small-12 large-6 columns" style={{margin: '0 auto', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, paddingBottom: 16, paddingLeft: 16, paddingRight: 8, textAlign: 'left', width: 274}}>
                                            <table style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}>
                                                <tbody>
                                                <tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}>
                                                    <th style={{margin: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                        <strong>{t('Lab config notes')}:</strong>
                                                        <p style={{margin: 0, marginBottom: 10, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                            {labConfigNotes}</p>
                                                    </th>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </th>
                                    </tr>
                                    </tbody>
                                </table>
                            </td></tr></tbody></table>
                            }
                            {hasInvoiceNotes &&
                            <table align="center" className="container section__body" style={{margin: '0 auto', background: 'white', borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'inherit', verticalAlign: 'top', width: 580}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', hyphens: 'auto', lineHeight: '1.3', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}>
                                <table className="spacer" style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td height="16px" style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', hyphens: 'auto', lineHeight: '16px', msoLineHeightRule: 'exactly', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}> </td></tr></tbody></table>
                                <table className="row" style={{borderCollapse: 'collapse', borderSpacing: 0, display: 'table', padding: 0, position: 'relative', textAlign: 'left', verticalAlign: 'top', width: '100%'}}>
                                    <tbody>
                                    <tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}>
                                        <th className="small-12 large-6 columns" style={{margin: '0 auto', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, paddingBottom: 16, paddingLeft: 16, paddingRight: 8, textAlign: 'left', width: 274}}>
                                            <table style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}>
                                                <tbody>
                                                <tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}>
                                                    <th style={{margin: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                        <strong>{t('Invoice notes')}:</strong>
                                                        <p style={{margin: 0, marginBottom: 10, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                            {invoiceNotes}</p>
                                                    </th>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </th>
                                    </tr>
                                    </tbody>
                                </table>
                            </td></tr></tbody></table>
                            }
                            {hasFileUpload &&
                            <table align="center" className="container section__body" style={{margin: '0 auto', background: 'white', borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'inherit', verticalAlign: 'top', width: 580}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', hyphens: 'auto', lineHeight: '1.3', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}>
                                <table className="spacer" style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td height="16px" style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', hyphens: 'auto', lineHeight: '16px', msoLineHeightRule: 'exactly', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}> </td></tr></tbody></table>
                                <table className="row" style={{borderCollapse: 'collapse', borderSpacing: 0, display: 'table', padding: 0, position: 'relative', textAlign: 'left', verticalAlign: 'top', width: '100%'}}>
                                    <tbody>
                                    <tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}>
                                        <th className="small-12 large-6 columns" style={{margin: '0 auto', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, paddingBottom: 16, paddingLeft: 16, paddingRight: 8, textAlign: 'left', width: 274}}>
                                            <table style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}>
                                                <tbody>
                                                <tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}>
                                                    <th style={{margin: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                        <strong>{t('File')}:</strong>
                                                        <p style={{margin: 0, marginBottom: 10, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                            {file.displayName || ''}</p>
                                                    </th>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </th>
                                    </tr>
                                    </tbody>
                                </table>
                            </td></tr></tbody></table>
                            }
                              </td></tr></tbody></table>
                      }
                    { /* End Additional information */ }
                    <table className="spacer float-center" style={{margin: '0 auto', borderCollapse: 'collapse', borderSpacing: 0, float: 'none', padding: 0, textAlign: 'center', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td height="10px" style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 10, fontWeight: 'normal', hyphens: 'auto', lineHeight: '10px', msoLineHeightRule: 'exactly', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}> </td></tr></tbody></table>
                    { /* Shipping Address */ }
                    <table align="center" className="wrapper section float-center" style={{margin: '0 auto', borderCollapse: 'collapse', borderSpacing: 0, float: 'none', padding: 0, textAlign: 'center', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td className="wrapper-inner" style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', hyphens: 'auto', lineHeight: '1.3', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}>
                            <table align="center" className="container section__header" style={{margin: '0 auto', background: '#5f5753', borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'inherit', verticalAlign: 'top', width: 580}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', hyphens: 'auto', lineHeight: '1.3', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}>
                                    <table className="row" style={{borderCollapse: 'collapse', borderSpacing: 0, display: 'table', padding: 0, position: 'relative', textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}>
                                          <th className="small-12 large-12 columns first last" style={{margin: '0 auto', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, paddingBottom: 16, paddingLeft: 16, paddingRight: 16, textAlign: 'left', width: 564}}><table style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><th style={{margin: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                    <h3 className="section__header-title no-margin-bot" style={{margin: 0, marginBottom: 0, marginTop: 16, color: 'white', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 18, fontWeight: 'bold', lineHeight: '1.3', padding: 0, textAlign: 'left', wordWrap: 'normal'}}>
                                                        {t('Shipping address')}</h3>
                                                  </th>
                                                  <th className="expander" style={{margin: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: '0 !important', textAlign: 'left', visibility: 'hidden', width: 0}} /></tr></tbody></table></th>
                                        </tr></tbody></table>
                                  </td></tr></tbody></table>
                            <table align="center" className="container section__body" style={{margin: '0 auto', background: 'white', borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'inherit', verticalAlign: 'top', width: 580}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', hyphens: 'auto', lineHeight: '1.3', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}>
                                    <table className="spacer" style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td height="16px" style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', hyphens: 'auto', lineHeight: '16px', msoLineHeightRule: 'exactly', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}> </td></tr></tbody></table>
                                    <table className="row" style={{borderCollapse: 'collapse', borderSpacing: 0, display: 'table', padding: 0, position: 'relative', textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}>
                                          <th className="small-12 large-6 columns first" style={{margin: '0 auto', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, paddingBottom: 16, paddingLeft: 16, paddingRight: 8, textAlign: 'left', width: 274}}><table style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><th style={{margin: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                    <strong>{t('Company')}:</strong>
                                                    <p style={{margin: 0, marginBottom: 10, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                        {shipping.companyName}</p>
                                                    <strong>{t('Address')}:</strong>
                                                    <p style={{margin: 0, marginBottom: 10, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                        {!!shipping.address.address1 && shipping.address.address1}<br />
                                                        {!!shipping.address.address2 && shipping.address.address2}<br />
                                                        {!!shipping.address.city && shipping.address.city},
                                                        {!!shipping.address.state && shipping.address.state} {!!shipping.address.zipCode && shipping.address.zipCode}<br />
                                                        {!!shipping.address.countryId && shipping.address.countryId}
                                                     </p>
                                                  </th></tr></tbody></table></th>
                                          <th className="small-12 large-6 columns last" style={{margin: '0 auto', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, paddingBottom: 16, paddingLeft: 8, paddingRight: 16, textAlign: 'left', width: 274}}><table style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><th style={{margin: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                              {shipping.attentionLine &&
                                                <div>
                                                    <strong>{t('Attention')}:</strong>
                                                    <p style={{margin: 0, marginBottom: 10, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                        {shipping.attentionLine}</p>
                                                </div>
                                              }
                                              {shipping.phone &&
                                                  <div>
                                                      <strong>{t('Phone')}:</strong>
                                                      <p style={{margin: 0, marginBottom: 10, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                          {shipping.phone}</p>
                                                  </div>
                                              }
                                              {shipping.address && shipping.address.address3 &&
                                                  <div>
                                                      <strong>{t('Location ID/Store number')}:</strong>
                                                      <p style={{margin: 0, marginBottom: 10, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                          {shipping.address.address3}</p>
                                                  </div>
                                              }
                                                  </th></tr></tbody></table></th>
                                        </tr></tbody></table>
                                  </td></tr></tbody></table>
                          </td></tr></tbody></table>
                    { /* End Shipping Address */ }
                    <table className="spacer float-center" style={{margin: '0 auto', borderCollapse: 'collapse', borderSpacing: 0, float: 'none', padding: 0, textAlign: 'center', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td height="10px" style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 10, fontWeight: 'normal', hyphens: 'auto', lineHeight: '10px', msoLineHeightRule: 'exactly', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}> </td></tr></tbody></table>
                    { /* Shipping Carrier */ }
                    {carrier &&
                    <table align="center" className="wrapper section float-center" style={{margin: '0 auto', borderCollapse: 'collapse', borderSpacing: 0, float: 'none', padding: 0, textAlign: 'center', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td className="wrapper-inner" style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', hyphens: 'auto', lineHeight: '1.3', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}>
                            <table align="center" className="container section__header" style={{margin: '0 auto', background: '#5f5753', borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'inherit', verticalAlign: 'top', width: 580}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', hyphens: 'auto', lineHeight: '1.3', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}>
                                    <table className="row" style={{borderCollapse: 'collapse', borderSpacing: 0, display: 'table', padding: 0, position: 'relative', textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}>
                                          <th className="small-12 large-12 columns first last" style={{margin: '0 auto', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, paddingBottom: 16, paddingLeft: 16, paddingRight: 16, textAlign: 'left', width: 564}}><table style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><th style={{margin: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                    <h3 className="section__header-title no-margin-bot" style={{margin: 0, marginBottom: 0, marginTop: 16, color: 'white', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 18, fontWeight: 'bold', lineHeight: '1.3', padding: 0, textAlign: 'left', wordWrap: 'normal'}}>
                                                        {t('Shipping options')}</h3>
                                                  </th>
                                                  <th className="expander" style={{margin: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: '0 !important', textAlign: 'left', visibility: 'hidden', width: 0}} /></tr></tbody></table></th>
                                        </tr></tbody></table>
                                  </td></tr>
                                  </tbody></table>
                            {transportsToDetermine &&
                                <table align="center" className="container section__body" style={{margin: '0 auto', background: 'white', borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'inherit', verticalAlign: 'top', width: 580}}>
                                    <tbody>
                                        <tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}>
                                            <td style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', hyphens: 'auto', lineHeight: '1.3', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}>
                                            {showCarrierChargeMessage()}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            }
                            <table align="center" className="container section__body" style={{margin: '0 auto', background: 'white', borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'inherit', verticalAlign: 'top', width: 580}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', hyphens: 'auto', lineHeight: '1.3', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}>
                                    <table className="spacer" style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td height="16px" style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', hyphens: 'auto', lineHeight: '16px', msoLineHeightRule: 'exactly', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}> </td></tr></tbody></table>
                                    <table className="row" style={{borderCollapse: 'collapse', borderSpacing: 0, display: 'table', padding: 0, position: 'relative', textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}>
                                        {carrier &&
                                          <th className="small-12 large-6 columns first" style={{margin: '0 auto', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, paddingBottom: 16, paddingLeft: 16, paddingRight: 8, textAlign: 'left', width: 274}}><table style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><th style={{margin: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                    <strong>{t('Shipping carrier')}:</strong>
                                                    <p style={{margin: 0, marginBottom: 10, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                        {carrier.name} ({carrier.description})</p>
                                                  </th></tr></tbody></table></th>
                                        }
                                        {emails.length > 0 &&
                                            <th className="small-12 large-6 columns last" style={{margin: '0 auto', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, paddingBottom: 16, paddingLeft: 8, paddingRight: 16, textAlign: 'left', width: 274}}><table style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><th style={{margin: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                <strong>{t('Notification email(s)')}:</strong>
                                                <p style={{margin: 0, marginBottom: 10, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                    {emails.map((email, index) => (
                                                        <p key={index}>{email}</p>
                                                    ))}
                                                </p>
                                            </th></tr></tbody></table></th>
                                        }

                                        </tr></tbody></table>
                                    {shipping.notes &&
                                    <table className="row" style={{borderCollapse: 'collapse', borderSpacing: 0, display: 'table', padding: 0, position: 'relative', textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}>
                                          <th className="small-12 large-12 columns first last" style={{margin: '0 auto', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, paddingBottom: 16, paddingLeft: 16, paddingRight: 16, textAlign: 'left', width: 564}}><table style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><th style={{margin: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                    <strong>{t('Shipping related notes')}:</strong>
                                                    <p style={{margin: 0, marginBottom: 10, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                        {shipping.notes}</p>
                                                  </th>
                                                  <th className="expander" style={{margin: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: '0 !important', textAlign: 'left', visibility: 'hidden', width: 0}} /></tr></tbody></table></th>
                                        </tr></tbody></table>
                                    }
                                  </td></tr></tbody></table>
                          </td></tr></tbody></table>
                      }
                    { /* End Shipping Carrier */ }
                    <table className="spacer float-center" style={{margin: '0 auto', borderCollapse: 'collapse', borderSpacing: 0, float: 'none', padding: 0, textAlign: 'center', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td height="10px" style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 10, fontWeight: 'normal', hyphens: 'auto', lineHeight: '10px', msoLineHeightRule: 'exactly', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}> </td></tr></tbody></table>
                    { /* Billing Address */ }
                    <table align="center" className="wrapper section float-center" style={{margin: '0 auto', borderCollapse: 'collapse', borderSpacing: 0, float: 'none', padding: 0, textAlign: 'center', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td className="wrapper-inner" style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', hyphens: 'auto', lineHeight: '1.3', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}>
                            <table align="center" className="container section__header" style={{margin: '0 auto', background: '#5f5753', borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'inherit', verticalAlign: 'top', width: 580}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', hyphens: 'auto', lineHeight: '1.3', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}>
                                    <table className="row" style={{borderCollapse: 'collapse', borderSpacing: 0, display: 'table', padding: 0, position: 'relative', textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}>
                                          <th className="small-12 large-12 columns first last" style={{margin: '0 auto', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, paddingBottom: 16, paddingLeft: 16, paddingRight: 16, textAlign: 'left', width: 564}}><table style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><th style={{margin: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                    <h3 className="section__header-title no-margin-bot" style={{margin: 0, marginBottom: 0, marginTop: 16, color: 'white', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 18, fontWeight: 'bold', lineHeight: '1.3', padding: 0, textAlign: 'left', wordWrap: 'normal'}}>
                                                        {t('Billing address')}</h3>
                                                  </th>
                                                  <th className="expander" style={{margin: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: '0 !important', textAlign: 'left', visibility: 'hidden', width: 0}} /></tr></tbody></table></th>
                                        </tr></tbody></table>
                                  </td></tr></tbody></table>
                            <table align="center" className="container section__body" style={{margin: '0 auto', background: 'white', borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'inherit', verticalAlign: 'top', width: 580}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', hyphens: 'auto', lineHeight: '1.3', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}>
                                    <table className="spacer" style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td height="16px" style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', hyphens: 'auto', lineHeight: '16px', msoLineHeightRule: 'exactly', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}> </td></tr></tbody></table>
                                    <table className="row" style={{borderCollapse: 'collapse', borderSpacing: 0, display: 'table', padding: 0, position: 'relative', textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}>
                                          <th className="small-12 large-6 columns first" style={{margin: '0 auto', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, paddingBottom: 16, paddingLeft: 16, paddingRight: 8, textAlign: 'left', width: 274}}><table style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><th style={{margin: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                    <strong>{t('Company')}:</strong>
                                                    <p style={{margin: 0, marginBottom: 10, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                        {billing.companyName}</p>
                                                    <strong>{t('Address')}:</strong>
                                                    <p style={{margin: 0, marginBottom: 10, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>101 S. Alameda Street<br />
                                                        {!!billing.address.address1 && billing.address.address1}<br />
                                                        {!!billing.address.address2 && billing.address.address2}<br />
                                                        {!!billing.address.city && billing.address.city},
                                                        {!!billing.address.state && billing.address.state} {!!billing.address.zipCode && billing.address.zipCode}<br />
                                                        {!!billing.address.countryId && billing.address.countryId}
                                                     </p>
                                                  </th></tr></tbody></table></th>
                                          <th className="small-12 large-6 columns last" style={{margin: '0 auto', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, paddingBottom: 16, paddingLeft: 8, paddingRight: 16, textAlign: 'left', width: 274}}><table style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><th style={{margin: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                  {billing.attentionLine &&
                                                      <div>
                                                          <strong>{t('Attention')}:</strong>
                                                          <p style={{margin: 0, marginBottom: 10, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                              {billing.attentionLine}</p>
                                                      </div>
                                                  }
                                                  {billing.phone &&
                                                      <div>
                                                          <strong>{t('Phone')}:</strong>
                                                          <p style={{margin: 0, marginBottom: 10, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                              {billing.phone}</p>
                                                      </div>
                                                  }
                                                  {billing.address && billing.address.address3 &&
                                                      <div>
                                                          <strong>{t('Location ID/Store number')}:</strong>
                                                          <p style={{margin: 0, marginBottom: 10, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                              {billing.address.address3}</p>
                                                      </div>
                                                  }
                                                  </th></tr></tbody></table></th>
                                        </tr></tbody></table>
                                  </td></tr></tbody></table>
                          </td></tr></tbody></table>
                    { /* End Billing Address */ }
                    <table className="spacer float-center" style={{margin: '0 auto', borderCollapse: 'collapse', borderSpacing: 0, float: 'none', padding: 0, textAlign: 'center', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td height="10px" style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 10, fontWeight: 'normal', hyphens: 'auto', lineHeight: '10px', msoLineHeightRule: 'exactly', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}> </td></tr></tbody></table>
                    { /* Payment section */ }
                    <table align="center" className="wrapper section float-center" style={{margin: '0 auto', borderCollapse: 'collapse', borderSpacing: 0, float: 'none', padding: 0, textAlign: 'center', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td className="wrapper-inner" style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', hyphens: 'auto', lineHeight: '1.3', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}>
                            <table align="center" className="container section__header" style={{margin: '0 auto', background: '#5f5753', borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'inherit', verticalAlign: 'top', width: 580}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', hyphens: 'auto', lineHeight: '1.3', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}>
                                    <table className="row" style={{borderCollapse: 'collapse', borderSpacing: 0, display: 'table', padding: 0, position: 'relative', textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}>
                                          <th className="small-12 large-12 columns first last" style={{margin: '0 auto', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, paddingBottom: 16, paddingLeft: 16, paddingRight: 16, textAlign: 'left', width: 564}}><table style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><th style={{margin: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                    <h3 className="section__header-title no-margin-bot" style={{margin: 0, marginBottom: 0, marginTop: 16, color: 'white', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 18, fontWeight: 'bold', lineHeight: '1.3', padding: 0, textAlign: 'left', wordWrap: 'normal'}}>
                                                        {t('Payment information')}</h3>
                                                  </th>
                                                  <th className="expander" style={{margin: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: '0 !important', textAlign: 'left', visibility: 'hidden', width: 0}} /></tr></tbody></table></th>
                                        </tr></tbody></table>
                                  </td></tr></tbody></table>
                            <table align="center" className="container section__body" style={{margin: '0 auto', background: 'white', borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'inherit', verticalAlign: 'top', width: 580}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', hyphens: 'auto', lineHeight: '1.3', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}>
                                    <table className="spacer" style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td height="16px" style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', hyphens: 'auto', lineHeight: '16px', msoLineHeightRule: 'exactly', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}> </td></tr></tbody></table>
                                    {payment.cardInfo &&
                                        <span>
                                            <table className="row" style={{borderCollapse: 'collapse', borderSpacing: 0, display: 'table', padding: 0, position: 'relative', textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}>
                                                  <th className="small-12 large-3 columns first" style={{margin: '0 auto', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, paddingBottom: 16, paddingLeft: 16, paddingRight: 8, textAlign: 'left', width: 129}}><table style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><th style={{margin: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                            <strong>{t('Card')}:</strong>
                                                            <p style={{margin: 0, marginBottom: 10, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                                <img className="float-left icon-cards" src="assets/img/icons-cards-visa.png" alt={payment.cardInfo.type}
                                                                    style={{msInterpolationMode: 'bicubic', border: '1px solid #ece9e7', borderRadius: 3, clear: 'both', display: 'block', float: 'left', maxWidth: '100%', outline: 'none', textAlign: 'left', textDecoration: 'none', width: 'auto'}} />
                                                                &nbsp;{t('ending in')} {payment.cardInfo.maskedCardNumber && payment.cardInfo.maskedCardNumber.slice(-4)}
                                                            </p>
                                                          </th></tr></tbody></table></th>
                                                  <th className="small-12 large-3 columns last" style={{margin: '0 auto', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, paddingBottom: 16, paddingLeft: 8, paddingRight: 16, textAlign: 'left', width: 129}}><table style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><th style={{margin: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                            <strong>{t('Expiration date')}:</strong>
                                                            <p style={{margin: 0, marginBottom: 10, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                                {payment.cardInfo.expiryMonth}/{payment.cardInfo.expiryYear}</p>
                                                          </th></tr></tbody></table></th>
                                                </tr></tbody></table>
                                            <table className="row" style={{borderCollapse: 'collapse', borderSpacing: 0, display: 'table', padding: 0, position: 'relative', textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}>
                                                  <th className="small-12 large-3 columns first" style={{margin: '0 auto', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, paddingBottom: 16, paddingLeft: 16, paddingRight: 8, textAlign: 'left', width: 129}}><table style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><th style={{margin: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                            <strong>{t('Name on card')}:</strong>
                                                            <p style={{margin: 0, marginBottom: 10, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                                {payment.cardInfo.nameOnCard}</p>
                                                          </th></tr></tbody></table></th>
                                                  <th className="small-12 large-3 columns last" style={{margin: '0 auto', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, paddingBottom: 16, paddingLeft: 8, paddingRight: 16, textAlign: 'left', width: 129}}><table style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><th style={{margin: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                            <strong>{t('Card description')}:</strong>
                                                            <p style={{margin: 0, marginBottom: 10, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                                {payment.cardInfo.description}</p>
                                                          </th></tr></tbody></table></th>
                                                </tr></tbody></table>
                                            { creditCardMessage &&
                                            <table style={{borderCollapse: 'collapse', borderSpacing: 0, display: 'table', padding: 0, position: 'relative', textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}>
                                              <td style={{fontFamily: 'Verdana, Arial, sans-serif', fontWeight: 400, fontStyle: 'normal', fontSize: '12px', color: '#7D726D', lineHeight: 'normal', padding: '0 16px 16px 16px', textAlign: 'left'}}>
                                                {creditCardMessage}
                                              </td>
                                            </tr></tbody></table>
                                            }
                                        </span>
                                    }
                                    <table className="row" style={{borderCollapse: 'collapse', borderSpacing: 0, display: 'table', padding: 0, position: 'relative', textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}>
                                        {payment.type === '1' &&
                                            <th className="small-12 large-3 columns first" style={{margin: '0 auto', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, paddingBottom: 16, paddingLeft: 16, paddingRight: 8, textAlign: 'left', width: 129}}><table style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><th style={{margin: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                      <strong>{t('Payment type')}:</strong>
                                                          <p style={{margin: 0, marginBottom: 10, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                              {t('Terms')}</p>
                                                    </th></tr></tbody></table></th>
                                        }
                                        {payment.poNumber &&
                                            <th className="small-12 large-3 columns first" style={{margin: '0 auto', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, paddingBottom: 16, paddingLeft: 16, paddingRight: 8, textAlign: 'left', width: 129}}><table style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><th style={{margin: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                    <strong>{t('P.O. number')}:</strong>
                                                    {payment.poNumber &&
                                                        <p style={{margin: 0, marginBottom: 10, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                            {payment.poNumber}</p>
                                                    }
                                                  </th></tr></tbody></table></th>
                                        }
                                        {payment.poReleaseNumber &&
                                             <th className="small-12 large-3 columns last" style={{margin: '0 auto', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, paddingBottom: 16, paddingLeft: 8, paddingRight: 16, textAlign: 'left', width: 129}}><table style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><th style={{margin: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                    <strong>{t('P.O. release number')}:</strong>
                                                    {payment.poReleaseNumber &&
                                                        <p style={{margin: 0, marginBottom: 10, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                            {payment.poReleaseNumber}</p>
                                                    }
                                                      </th></tr></tbody></table></th>
                                        }
                                        </tr></tbody></table>
                                  </td></tr></tbody></table>
                          </td></tr></tbody></table>
                    { /* End Payment section */ }
                    <table className="spacer float-center" style={{margin: '0 auto', borderCollapse: 'collapse', borderSpacing: 0, float: 'none', padding: 0, textAlign: 'center', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td height="10px" style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 10, fontWeight: 'normal', hyphens: 'auto', lineHeight: '10px', msoLineHeightRule: 'exactly', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}> </td></tr></tbody></table>
                    { /* Cart section */ }
                    <table align="center" className="wrapper section float-center" style={{margin: '0 auto', borderCollapse: 'collapse', borderSpacing: 0, float: 'none', padding: 0, textAlign: 'center', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td className="wrapper-inner" style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', hyphens: 'auto', lineHeight: '1.3', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}>
                            <table align="center" className="container section__header" style={{margin: '0 auto', background: '#5f5753', borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'inherit', verticalAlign: 'top', width: 580}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', hyphens: 'auto', lineHeight: '1.3', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}>
                                    <table className="row" style={{borderCollapse: 'collapse', borderSpacing: 0, display: 'table', padding: 0, position: 'relative', textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}>
                                          <th className="small-12 large-12 columns first last" style={{margin: '0 auto', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, paddingBottom: 16, paddingLeft: 16, paddingRight: 16, textAlign: 'left', width: 564}}><table style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><th style={{margin: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                    <h3 className="section__header-title no-margin-bot" style={{margin: 0, marginBottom: 0, marginTop: 16, color: 'white', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 18, fontWeight: 'bold', lineHeight: '1.3', padding: 0, textAlign: 'left', wordWrap: 'normal'}}>
                                                        {t('Your cart')}
                                                    </h3>
                                                  </th>
                                                  <th className="expander" style={{margin: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: '0 !important', textAlign: 'left', visibility: 'hidden', width: 0}} /></tr></tbody></table></th>
                                        </tr></tbody></table>
                                  </td></tr></tbody></table>
                            <table align="center" className="container section__cart" style={{margin: '0 auto', background: 'white', borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'inherit', verticalAlign: 'top', width: 580}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', hyphens: 'auto', lineHeight: '1.3', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}>

                                  </td></tr></tbody></table>
                            <table className="spacer" style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td height="10px" style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 10, fontWeight: 'normal', hyphens: 'auto', lineHeight: '10px', msoLineHeightRule: 'exactly', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}> </td></tr></tbody></table>
                            { /* contract header */ }
                            { Object.keys(cart.contracts).map((contractName, i) => {
                                const showContractNames = () => {
                                    const emptyString = ''
                                    const openMarket = 'OPEN MARKET'
                                    return Object.keys(cart.contracts).filter((contract) => {
                                        const contractName = cart.contracts[contract].abbreviation
                                        return contractName !== emptyString && contractName.toUpperCase() !== openMarket
                                    }).length > 0
                                }
                                const contractDetails = cart.contracts[contractName]
                                const showContractName = ipsUser || showContractNames()
                                const filteredCartItems = filterNonDEPCartItems(contractDetails.cartItems)
                                return (
                                    <table key={i} align="center" className="container section__cart" style={{margin: '0 auto', background: 'white', borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'inherit', verticalAlign: 'top', width: 580}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', hyphens: 'auto', lineHeight: '1.3', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}>
                                        {showContractName &&
                                            <p className="cart__contract-header no-margin-bot" style={{margin: 0, marginBottom: 0, backgroundColor: '#dcf0fa', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 14, fontWeight: 'normal', lineHeight: '1.3', padding: '8px 16px 8px 16px', textAlign: 'left'}}>
                                                {t('Contract')}: <strong>{contractDetails.abbreviation}</strong></p>
                                        }
                                        <table className="spacer" style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td height="16px" style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', hyphens: 'auto', lineHeight: '16px', msoLineHeightRule: 'exactly', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}> </td></tr></tbody></table>

                                        { Object.keys(filteredCartItems).map((itemIndexFromServer, index) => {
                                            const item = filteredCartItems[itemIndexFromServer]
                                            const bundleItems = item.bundle && filterBundleDEPItems(item.lineItems, contractDetails.cartItems)
                                            return (
                                                item.bundle ?
                                                <div key={index}>
                                                    <table className="spacer" style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td height="10px" style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 10, fontWeight: 'normal', hyphens: 'auto', lineHeight: '10px', msoLineHeightRule: 'exactly', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}> </td></tr></tbody></table>
                                                    <table align="center" className="container section__cart" style={{margin: '0 auto', background: 'white', borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'inherit', verticalAlign: 'top', width: 580}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', hyphens: 'auto', lineHeight: '1.3', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}>
                                                            <table className="spacer" style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td height="16px" style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', hyphens: 'auto', lineHeight: '16px', msoLineHeightRule: 'exactly', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}> </td></tr></tbody></table>
                                                            <table className="row" style={{borderCollapse: 'collapse', borderSpacing: 0, display: 'table', padding: 0, position: 'relative', textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}>
                                                                  <th className="small-12 large-12 columns first last" style={{margin: '0 auto', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, paddingBottom: 16, paddingLeft: 16, paddingRight: 16, textAlign: 'left', width: 564}}><table style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><th style={{margin: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                                            <h4 style={{margin: 0, marginBottom: 10, color: 'inherit', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'bold', lineHeight: '1.3', padding: 0, textAlign: 'left', wordWrap: 'normal'}}>
                                                                            {item.description}</h4>
                                                                            <p className="cart__item-bundle no-margin-bot" style={{margin: 0, marginBottom: 0, backgroundColor: '#e6e6e5', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 14, fontWeight: 'normal', lineHeight: '1.3', padding: 5, textAlign: 'left'}}>
                                                                                {t('Insight #')}: {item.materialID}</p>
                                                                          </th>
                                                                          <th className="expander" style={{margin: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: '0 !important', textAlign: 'left', visibility: 'hidden', width: 0}} /></tr></tbody></table></th>
                                                                </tr></tbody></table>


                                                          </td></tr></tbody></table>
                                                    <table className="spacer" style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td height="1px" style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 1, fontWeight: 'normal', hyphens: 'auto', lineHeight: 1, msoLineHeightRule: 'exactly', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}> </td></tr></tbody></table>
                                                    <table align="center" className="container section__cart" style={{margin: '0 auto', background: 'white', borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'inherit', verticalAlign: 'top', width: 580}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', hyphens: 'auto', lineHeight: '1.3', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}>
                                                            <table className="spacer" style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td height="16px" style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', hyphens: 'auto', lineHeight: '16px', msoLineHeightRule: 'exactly', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}> </td></tr></tbody></table>
                                                            {
                                                                Object.keys(bundleItems).map((lineItemIndex) => {
                                                                const lineItem = bundleItems[lineItemIndex]
                                                                return (
                                                                    <RenderCartItem
                                                                        item = {lineItem}
                                                                        currencyFormat = {currencyFormat}
                                                                        hasUserPreferences={hasUserPreferences}
                                                                        showProductImages={showProductImages}
                                                                        localeValue= {localeValue}
                                                                    />
                                                                )
                                                            })}
                                                          </td></tr></tbody></table>

                                                </div>
                                                :
                                                <RenderCartItem
                                                    key={index}
                                                    item = {item}
                                                    currencyFormat = {currencyFormat}
                                                    hasUserPreferences={hasUserPreferences}
                                                    showProductImages={showProductImages}
                                                    localeValue={localeValue}
                                                />
                                            )
                                        })}
                                      </td></tr></tbody></table>
                                )
                            })}
                    </td></tr></tbody></table>
                    { /* End Cart section */ }
                    <table className="spacer float-center" style={{margin: '0 auto', borderCollapse: 'collapse', borderSpacing: 0, float: 'none', padding: 0, textAlign: 'center', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td height="10px" style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 10, fontWeight: 'normal', hyphens: 'auto', lineHeight: '10px', msoLineHeightRule: 'exactly', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}> </td></tr></tbody></table>
                    { /* Start Summary section */ }
                    {
                        <div dangerouslySetInnerHTML={{__html: getReviewSummaryMarkup()}} />
                    }
                    { /* End Summary section */ }
                    <table className="spacer float-center" style={{margin: '0 auto', borderCollapse: 'collapse', borderSpacing: 0, float: 'none', padding: 0, textAlign: 'center', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td height="10px" style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 10, fontWeight: 'normal', hyphens: 'auto', lineHeight: '10px', msoLineHeightRule: 'exactly', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}> </td></tr></tbody></table>
                    { /* footer section */ }
                    <table align="center" className="wrapper section float-center" style={{margin: '0 auto', borderCollapse: 'collapse', borderSpacing: 0, float: 'none', padding: 0, textAlign: 'center', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td className="wrapper-inner" style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', hyphens: 'auto', lineHeight: '1.3', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}>
                            <table align="center" className="container section__body" style={{margin: '0 auto', background: 'white', borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'inherit', verticalAlign: 'top', width: 580}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', hyphens: 'auto', lineHeight: '1.3', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}>
                                    <table className="spacer" style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td height="16px" style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', hyphens: 'auto', lineHeight: '16px', msoLineHeightRule: 'exactly', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}> </td></tr></tbody></table>
                                    <table className="row" style={{borderCollapse: 'collapse', borderSpacing: 0, display: 'table', padding: 0, position: 'relative', textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}>
                                          <th className="small-12 large-12 columns first last" style={{margin: '0 auto', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, paddingBottom: 16, paddingLeft: 16, paddingRight: 16, textAlign: 'left', width: 564}}><table style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><th style={{margin: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                    <p className="text-center" style={{margin: 0, marginBottom: 10, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'center'}}><small style={{color: '#3e332d', fontSize: '80%'}}>
                                                        <strong>{t('Insight respects your privacy')}</strong></small></p>
                                                    <p className="text-center no-margin-bot" style={{margin: 0, marginBottom: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'center'}}>
                                                        <small style={{color: '#3e332d', fontSize: '80%'}}>
                                                            {t('We will never rent, lend or sell your email address or other contact information to another organization.')}
                                                        </small>
                                                    </p>
                                                  </th>
                                                  <th className="expander" style={{margin: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: '0 !important', textAlign: 'left', visibility: 'hidden', width: 0}} /></tr></tbody></table></th>
                                        </tr></tbody></table>
                                    <center data-parsed style={{minWidth: 580, width: '100%'}}>
                                      <table align="center" className="menu small-vertical float-center" style={{margin: '0 auto', borderCollapse: 'collapse', borderSpacing: 0, float: 'none', padding: 0, textAlign: 'center', verticalAlign: 'top', width: 'auto !important'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', hyphens: 'auto', lineHeight: '1.3', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}><table style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}>
                                                    <th className="menu-item float-center" style={{margin: '0 auto', color: '#3e332d', float: 'none', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '80%', fontWeight: 'normal', lineHeight: '1.3', padding: 5, paddingRight: 16, textAlign: 'center'}}>
                                                        <a href={get(sendToOptions, 'emailPrivacyPolicyURL')} style={{margin: 0, color: '#ae0a46', fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left', textDecoration: 'none'}}>
                                                            {t('Privacy Policy')}</a></th>
                                                    <th className="menu-item float-center" style={{margin: '0 auto', color: '#3e332d', float: 'none', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '80%', fontWeight: 'normal', lineHeight: '1.3', padding: 5, paddingRight: 16, textAlign: 'center'}}>
                                                        <a href={get(sendToOptions, 'emailReturnPolicyURL')} style={{margin: 0, color: '#ae0a46', fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left', textDecoration: 'none'}}>
                                                            {t('Business and return policies')}</a></th>
                                                    <th className="menu-item float-center" style={{margin: '0 auto', color: '#3e332d', float: 'none', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '80%', fontWeight: 'normal', lineHeight: '1.3', padding: 5, paddingRight: 16, textAlign: 'center'}}>
                                                        <a href={get(sendToOptions, 'emailContactUsURL') + "refcode='footer'"} style={{margin: 0, color: '#ae0a46', fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left', textDecoration: 'none'}}>
                                                            {t('Customer support')}</a></th>
                                                  </tr></tbody></table></td></tr></tbody></table>
                                    </center>
                                    <table className="spacer" style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td height="16px" style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', hyphens: 'auto', lineHeight: '16px', msoLineHeightRule: 'exactly', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}> </td></tr></tbody></table>
                                    <table className="row" style={{borderCollapse: 'collapse', borderSpacing: 0, display: 'table', padding: 0, position: 'relative', textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}>
                                          <th className="small-12 large-12 columns first last" style={{margin: '0 auto', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, paddingBottom: 16, paddingLeft: 16, paddingRight: 16, textAlign: 'left', width: 564}}><table style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><th style={{margin: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                    <p className="text-center" style={{margin: 0, marginBottom: 10, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'center'}}><small style={{color: '#3e332d', fontSize: '80%'}}>
                                                        {t('Copyright')} 1988-{ new Date().getFullYear() }-Insight, 2701 E. Insight Way Chandler, AZ 85286<br />
                                                        {t('Copyright')} { new Date().getFullYear() } {t('Insight Direct USA, Inc.')},
                                                        {t('All other company and product names are trademarks or service marks of their respective owners.For all prices and products, we reserve the right to make adjustments due to errors, changing market conditions, product discontinuations or typographical errors. Please contact your Insight representative if you have any questions.')}</small></p>
                                                  </th>
                                                  <th className="expander" style={{margin: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: '0 !important', textAlign: 'left', visibility: 'hidden', width: 0}} /></tr></tbody></table></th>
                                        </tr></tbody></table>
                                  </td></tr></tbody></table>
                          </td></tr></tbody></table>
                          { /* End footer section */ }
                  </center>
                </td>
              </tr>
            </tbody></table>
          {/* prevent Gmail on iOS font size manipulation */}
          <div style={{display: 'none', whiteSpace: 'nowrap', font: '15px courier', lineHeight: 0}}> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </div>
        </div>
        </Locale>
    ));
}

function renderImage(imageURLs) {
    if(!imageURLs || imageURLs.largeImage === 'image.not.available'){
        return document.location.origin+'/content/dam/insight-web/source/img/noImageAvailable_150x112.png'
    }else{
        return productImageToRender(imageURLs);
    }
}

function RenderCartItem(props) {
    const { hasUserPreferences, item, currencyFormat, showProductImages, localeValue } = props
    const cartImage = renderImage(item.imageURLs);
    return (
        <div>
            <table className="spacer" style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}>
              <tbody>
                <tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}>
                  <td height="16px" style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', hyphens: 'auto', lineHeight: '16px', msoLineHeightRule: 'exactly', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}>
                  </td>
                </tr>
              </tbody>
            </table>
            <table className="row" style={{borderCollapse: 'collapse', borderSpacing: 0, display: 'table', padding: 0, position: 'relative', textAlign: 'left', verticalAlign: 'top', width: '100%'}}>
                <tbody>
                    <tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}>
                        {hasUserPreferences ?
                            (showProductImages &&
                            <th className="small-12 large-4 columns first" style={{
                                margin: '0 auto',
                                color: '#3e332d',
                                fontFamily: 'Arial, Helvetica, sans-serif',
                                fontSize: 16,
                                fontWeight: 'normal',
                                lineHeight: '1.3',
                                padding: 0,
                                paddingBottom: 16,
                                paddingLeft: 16,
                                paddingRight: 8,
                                textAlign: 'left',
                                width: '177.33333px'
                            }}>
                                <table style={{
                                    borderCollapse: 'collapse',
                                    borderSpacing: 0,
                                    padding: 0,
                                    textAlign: 'left',
                                    verticalAlign: 'top',
                                    width: '100%'
                                }}>
                                    <tbody>
                                    <tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}>
                                        <th style={{
                                            margin: 0,
                                            color: '#3e332d',
                                            fontFamily: 'Arial, Helvetica, sans-serif',
                                            fontSize: 16,
                                            fontWeight: 'normal',
                                            lineHeight: '1.3',
                                            padding: 0,
                                            textAlign: 'left'
                                        }}>
                                            <img className="small-float-center"
                                                 src={cartImage}
                                                 alt={item.description}
                                                 style={{
                                                     msInterpolationMode: 'bicubic',
                                                     clear: 'both',
                                                     display: 'block',
                                                     maxWidth: '100%',
                                                     outline: 'none',
                                                     textDecoration: 'none',
                                                     width: 'auto'
                                                 }}/>
                                        </th>
                                    </tr>
                                    </tbody>
                                </table>
                            </th>)
                            :
                            <th className="small-12 large-4 columns first" style={{
                                margin: '0 auto',
                                color: '#3e332d',
                                fontFamily: 'Arial, Helvetica, sans-serif',
                                fontSize: 16,
                                fontWeight: 'normal',
                                lineHeight: '1.3',
                                padding: 0,
                                paddingBottom: 16,
                                paddingLeft: 16,
                                paddingRight: 8,
                                textAlign: 'left',
                                width: '177.33333px'
                            }}>
                                <table style={{
                                    borderCollapse: 'collapse',
                                    borderSpacing: 0,
                                    padding: 0,
                                    textAlign: 'left',
                                    verticalAlign: 'top',
                                    width: '100%'
                                }}>
                                    <tbody>
                                    <tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}>
                                        <th style={{
                                            margin: 0,
                                            color: '#3e332d',
                                            fontFamily: 'Arial, Helvetica, sans-serif',
                                            fontSize: 16,
                                            fontWeight: 'normal',
                                            lineHeight: '1.3',
                                            padding: 0,
                                            textAlign: 'left'
                                        }}>
                                            <img className="small-float-center"
                                                 src={cartImage}
                                                 alt={item.description}
                                                 style={{
                                                     msInterpolationMode: 'bicubic',
                                                     clear: 'both',
                                                     display: 'block',
                                                     maxWidth: '100%',
                                                     outline: 'none',
                                                     textDecoration: 'none',
                                                     width: 'auto'
                                                 }}/>
                                        </th>
                                    </tr>
                                    </tbody>
                                </table>
                            </th>
                        }
                        <th className="small-12 large-8 columns last" style={{margin: '0 auto', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, paddingBottom: 16, paddingLeft: 8, paddingRight: 16, textAlign: 'left', width: '370.66667px'}}>
                            <table style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}>
                                <th style={{margin: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                            <a href={makeProductDetailURL(
                                {
                                    description: item.description,
                                    materialId: item.materialID,
                                    mfrId: item.mfrPartNumber,
                                    mfrName: item.manufacturerName,
                                }
                                )} style={{margin: 0, color: '#ae0a46', fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left', textDecoration: 'none'}}>
                                <strong>{item.description}</strong></a>
                            <table className="spacer" style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td height="10px" style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 10, fontWeight: 'normal', hyphens: 'auto', lineHeight: '10px', msoLineHeightRule: 'exactly', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}> </td></tr></tbody></table>
                            <small className="cart__item-part" style={{color: '#5f5753', fontSize: '80%', lineHeight: '1.4'}}>
                                {t('Insight #')}: {item.materialID}<br />
                                {t('Mfr #')}: {item.mfrPartNumber}</small>
                            {item.flaggedProduct && <ApprovedItem isEmail={true} />}
                            {item.standardsProduct && <StandardsProduct isEmail={true} />}
                            <table className="spacer" style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td height="10px" style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 10, fontWeight: 'normal', hyphens: 'auto', lineHeight: '10px', msoLineHeightRule: 'exactly', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}> </td></tr></tbody></table>
                            <table className="table" style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: 'auto !important'}}>
                              <tbody>
                                <tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}>
                                  <td className="table__label" style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 14, fontWeight: 'normal', hyphens: 'auto', lineHeight: '1.3', padding: '3px 16px 3px 0', textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}>
                                    <p className="text-center no-margin-bot" style={{margin: 0, marginBottom: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'center'}}>
                                        <span className="cart__label" style={{color: '#5f5753', fontSize: 12}}>
                                            {t('Unit price')}</span><br />
                                            <Currency currencyCode={item.currency} value={item.price} />                                            
                                    </p>
                                  </td>
                                  <td className="table__label" style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 14, fontWeight: 'normal', hyphens: 'auto', lineHeight: '1.3', padding: '3px 16px 3px 0', textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}>
                                    <p className="text-center no-margin-bot" style={{margin: 0, marginBottom: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'center'}}>
                                        <span className="cart__label" style={{color: '#5f5753', fontSize: 12}}>
                                            {t('Qty')}</span><br />
                                        {item.quantity}
                                    </p>
                                  </td>
                                  <td className="table__label" style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 14, fontWeight: 'normal', hyphens: 'auto', lineHeight: '1.3', padding: '3px 16px 3px 0', textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}>
                                    <p className="text-center no-margin-bot" style={{margin: 0, marginBottom: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'center'}}>
                                        <span className="cart__label" style={{color: '#5f5753', fontSize: 12}}>
                                            {t('Total')}</span><br />
                                        <Currency currencyCode={item.currency} value={item.totalPrice} />                                        
                                    </p>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </th></tr></tbody></table></th>
                    </tr>
                </tbody>
            </table>
            <table className="spacer" style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td height="10px" style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 10, fontWeight: 'normal', hyphens: 'auto', lineHeight: '10px', msoLineHeightRule: 'exactly', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}> </td></tr></tbody></table>
            <table align="center" className="container section__cart" style={{margin: '0 auto', background: 'white', borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'inherit', verticalAlign: 'top', width: 580}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', hyphens: 'auto', lineHeight: '1.3', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}>
                    <table className="spacer" style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td height="16px" style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', hyphens: 'auto', lineHeight: '16px', msoLineHeightRule: 'exactly', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}> </td></tr></tbody></table>
                    <table className="row" style={{borderCollapse: 'collapse', borderSpacing: 0, display: 'table', padding: 0, position: 'relative', textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}>
                          <th className="small-12 large-12 columns first last" style={{margin: '0 auto', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, paddingBottom: 16, paddingLeft: 16, paddingRight: 16, textAlign: 'left', width: 564}}><table style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><th style={{margin: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                    { /* contract specific information */ }
                                    {Object.keys(item.contractReportingFields).length > 0 &&
                                        <table className="table" style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: 'auto !important'}}>
                                          <thead>
                                            <tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}>
                                              <th colSpan={2} className="table__title" style={{margin: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'bold', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                <h5 style={{margin: 0, marginBottom: 10, color: 'inherit', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'bold', lineHeight: '1.3', padding: 0, textAlign: 'left', wordWrap: 'normal'}}>
                                                    {t('Contract specific information')}</h5>
                                              </th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                          { Object.keys(item.contractReportingFields).map((reportingField, index) => {
                                              const crp = item.contractReportingFields[reportingField]
                                              return (
                                                  <tr key={index} style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}>
                                                    <td className="table__label" style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 14, fontWeight: 'normal', hyphens: 'auto', lineHeight: '1.3', padding: '3px 16px 3px 0', textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}>
                                                      {crp.name}:</td>
                                                    <td className="table__text" style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 14, fontWeight: 'bold', hyphens: 'auto', lineHeight: '1.3', padding: '3px 0 3px 0', textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}>
                                                      {crp.value}</td>
                                                  </tr>
                                              )
                                          })}
                                          </tbody>
                                        </table>
                                    }

                                    { /* End contract specific information */ }
                                    <table className="spacer" style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: '100%'}}><tbody><tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}><td height="16px" style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', hyphens: 'auto', lineHeight: '16px', msoLineHeightRule: 'exactly', padding: 0, textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}> </td></tr></tbody></table>
                                    { /*not clear on licence info @TODO ask Paul */ }

                                      { /* SmartTracker information */ }
                                    {item.customerId &&
                                      <table className="table" style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: 'auto !important'}}>
                                          <thead>
                                          <tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}>
                                              <th colSpan={2} className="table__title" style={{margin: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'bold', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                  <h5 style={{margin: 0, marginBottom: 10, color: 'inherit', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'bold', lineHeight: '1.3', padding: 0, textAlign: 'left', wordWrap: 'normal'}}>
                                                      {t('Organization ID #')}</h5>
                                              </th>
                                          </tr>
                                          </thead>
                                          <tbody>
                                              <tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}>
                                                  <td className="table__label" style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 14, fontWeight: 'normal', hyphens: 'auto', lineHeight: '1.3', padding: '3px 16px 3px 0', textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}>
                                                      {t('Insight ')}:</td>
                                                  <td className="table__text" style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 14, fontWeight: 'bold', hyphens: 'auto', lineHeight: '1.3', padding: '3px 0 3px 0', textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}>
                                                      {item.DEPInsightPart}</td>
                                              </tr>
                                              <tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}>
                                                  <td className="table__label" style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 14, fontWeight: 'normal', hyphens: 'auto', lineHeight: '1.3', padding: '3px 16px 3px 0', textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}>
                                                      {t('Organization ID #')}:</td>
                                                  <td className="table__text" style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 14, fontWeight: 'bold', hyphens: 'auto', lineHeight: '1.3', padding: '3px 0 3px 0', textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}>
                                                      {item.customerId}</td>
                                              </tr><br />
                                          </tbody>
                                      </table>
                                    }
                                    { /* End SmartTracker information */ }
                                    { /* SmartTracker information */ }
                                    {Object.keys(item.lineLevels).length > 0 &&
                                        <table className="table" style={{borderCollapse: 'collapse', borderSpacing: 0, padding: 0, textAlign: 'left', verticalAlign: 'top', width: 'auto !important'}}>
                                          <thead>
                                            <tr style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}>
                                              <th colSpan={2} className="table__title" style={{margin: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'bold', lineHeight: '1.3', padding: 0, textAlign: 'left'}}>
                                                <h5 style={{margin: 0, marginBottom: 10, color: 'inherit', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'bold', lineHeight: '1.3', padding: 0, textAlign: 'left', wordWrap: 'normal'}}>
                                                    {t('SmartTracker')}</h5>
                                              </th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                          { Object.keys(item.lineLevels).map((lineLevel, index) => {
                                              const ll = item.lineLevels[lineLevel]
                                              return ( ll.value &&
                                                  <tr key={index} style={{padding: 0, textAlign: 'left', verticalAlign: 'top'}}>
                                                    <td className="table__label" style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 14, fontWeight: 'normal', hyphens: 'auto', lineHeight: '1.3', padding: '3px 16px 3px 0', textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}>
                                                      {ll.name}:</td>
                                                    <td className="table__text" style={{MozHyphens: 'auto', WebkitHyphens: 'auto', margin: 0, borderCollapse: 'collapse !important', color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 14, fontWeight: 'bold', hyphens: 'auto', lineHeight: '1.3', padding: '3px 0 3px 0', textAlign: 'left', verticalAlign: 'top', wordWrap: 'break-word'}}>
                                                      {ll.value}</td>
                                                  </tr>
                                              )
                                          })}
                                          </tbody>
                                        </table>
                                    }
                                    { /* End SmartTracker information */ }
                                  </th>
                                  <th className="expander" style={{margin: 0, color: '#3e332d', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 16, fontWeight: 'normal', lineHeight: '1.3', padding: '0 !important', textAlign: 'left', visibility: 'hidden', width: 0}} /></tr></tbody></table></th>
                        </tr></tbody></table>
                  </td></tr></tbody></table>
        </div>
    )
}
