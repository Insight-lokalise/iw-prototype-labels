import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { Locale } from '@insight/toolkit-react'
import { getCurrentLocale } from '@insight/toolkit-utils/lib/helpers/localeHelpers'
import { t } from '@insight/toolkit-utils/lib/labels'

import { IWImage } from '../../../../libs/iw-components'
import { sendEmail } from '../../../../models/Email/email'
import EmailBundleItem from './EmailBundleItem'
import EmailContractHeader from './EmailContractHeader'
import EmailCustomerInfo from './EmailCustomerInfo'
import EmailLineItem from './EmailLineItem'
import EmailOrderDetailHeader from './EmailOrderDetailHeader'
import EmailSpacer from './EmailSpacer'
import EmailSummary from './EmailSummary'
import EMEAEmailFooter from './EMEAEmailFooter'
import { convertMillsecToDate } from '../../../Search/constants/Date'
import { getBundleTrackingInfo } from '../ItemCard/ItemTracking/helpers/itemTracking'


export const SendEmail = emailData => {
  const {
    accountName,
    billingAddress,
    billingAttn,
    billingCompany,
    consortiaID,
    configLabels,
    costProps,
    createdOn,
    creditStatus,
    currency,
    currencyFormat,
    email,
    fullYear,
    hasInvoicingEnabled,
    isLab,
    isSEWP,
    isShipComplete,
    isLoggedIn,
    name,
    orderDetails,
    orderStatus,
    paymentType,
    phone,
    poNumber,
    poReleaseNumber,
    reportUsage,
    salesDocumentNumber,
    sendToOptions,
    shippingAddress,
    shippingAttn,
    shippingCompany,
    showEWR,
    soldTo,
    webReferenceNumber,
    isEMEA,
    isXD,
    getDEPInfo,
  } = emailData

  const sp = <span className="order-footer__space">-</span>
  let spacer = (<span style={{color: '#ffffff'}}>-</span>)
  const linkSep = (
    <span>
      <span className="order-footer__space">----</span>|<span className="order-footer__space">----</span>
    </span>
  )
  const isSplaOrCitrix = !!reportUsage
  const date = isSplaOrCitrix && convertMillsecToDate(reportUsage, 'MMMM-YYYY')

  //  convert the cart in the order to a table
  const getOrderItemsMarkup = () => {
    const blocks = convertToBlocks(emailData.orderSmartTracker, 4)
    const displayDate = convertMillsecToDate(createdOn, 'DD-MMM-YYYY')
    const getPOorPOReleasenumber = (poNum, poRelNum) =>
      poNum && poRelNum ? `${poNum}/${poRelNum}` : poNum || poRelNum || 'n/a'
    const poValue = getPOorPOReleasenumber(poNumber, poReleaseNumber)

    const CONTRACT = 'contract'
    const SINGLE_ITEM = 'item'
    const BUNDLE = 'bundle'

    // render only parent items without enrollment prop (only child items have enrollment prop)
    const parentItems = orderDetails.reduce((acc, item) => {
      if (item.data && item.type === SINGLE_ITEM && item.data.enrollment) return acc
      return acc.concat(item)
    }, [])

    const localeValue = getCurrentLocale("insight_current_locale", "insight_locale")

    return ReactDOMServer.renderToStaticMarkup(
      <Locale value={{ locale: localeValue }}>
      <div style={{ width: '1200px', margin: '0 auto', padding: '0 15px' }}>
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width" />
        <title>Order detail</title>
        {/* dangerouslySetInnerHTML is React’s replacement for using innerHTML in the browser DOM. */}
        <style
          dangerouslySetInnerHTML={{
            __html:
              '@media only screen {html {min-height: 100%; background: #e6e6e5; }}@media only screen and (max-width: 596px) { .small-float-center { margin: 0 auto !important; float: none !important; text-align: center !important;} .small-text-center { text-align: center !important; }}@media only screen and (max-width: 596px) {table.body img {width: auto; height: auto;} table.body center { min-width: 0 !important;  } table.body .container { width: 95% !important;  } table.body .columns {height: auto !important; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box; padding-left: 16px !important; padding-right: 16px !important;}table.body .columns .columns {padding-left: 0 !important; padding-right: 0 !important;} table.body .collapse .columns {padding-left: 0 !important; padding-right: 0 !important;} th.small-6 {display: inline-block !important; width: 50% !important;}  th.small-12 {display: inline-block !important; width: 100% !important;  }.columns th.small-12 {display: block !important; width: 100% !important;}table.menu { width: 100% !important;} table.menu td,  table.menu th { width: auto !important;display: inline-block !important;  }  table.menu.vertical td,  table.menu.vertical th,  table.menu.small-vertical td,  table.menu.small-vertical th { display: block !important;}  table.menu[align="center"] { width: auto !important;}}',
          }}
        />
        <span
          style={{
            color: '#e6e6e5',
            display: 'none !important',
            fontSize: 1,
            lineHeight: 1,
            maxHeight: 0,
            maxWidth: 0,
            msoHide: 'all !important',
            opacity: 0,
            overflow: 'hidden',
            visibility: 'hidden',
          }}
        />
        <table
          style={{
            margin: 0,
            background: '#f3f3f3 !important',
            borderCollapse: 'collapse',
            borderSpacing: 0,
            color: '#3e332d',
            fontFamily: 'allumi-2-std,Helvetica Neue,Helvetica,Helvetica,Arial,sans-serif',
            fontSize: 16,
            fontWeight: 'normal',
            height: '100%',
            lineHeight: '1.3',
            padding: 0,
            textAlign: 'left',
            verticalAlign: 'top',
            width: '100%',
          }}
        >
          <tbody>
            <tr style={{ padding: 0, textAlign: 'left', verticalAlign: 'top' }}>
              <td
                style={{
                  MozHyphens: 'auto',
                  WebkitHyphens: 'auto',
                  margin: 0,
                  borderCollapse: 'collapse !important',
                  color: '#3e332d',
                  fontFamily: 'allumi-2-std,Helvetica Neue,Helvetica,Helvetica,Arial,sans-serif',
                  fontSize: 16,
                  fontWeight: 'normal',
                  hyphens: 'auto',
                  lineHeight: '1.3',
                  padding: 0,
                  textAlign: 'left',
                  verticalAlign: 'top',
                  wordWrap: 'break-word',
                }}
              >
                  {/* start email header section */}
                  <table
                    style={{
                      borderCollapse: 'collapse',
                      borderSpacing: 0,
                      float: 'none',
                      padding: 0,
                      verticalAlign: 'top',
                      width: '100%',
                      background: '#fff',
                    }}>
                    <tbody>
                      <tr>
                        <td style={{ padding: '10px 16px 10px 16px' }}>
                          <a
                            href={sendToOptions.emailLinkBase}>
                            <IWImage
                              style={{
                                msInterpolationMode: 'bicubic',
                                border: 'none',
                                clear: 'both',
                                display: 'block',
                                maxWidth: '100%',
                                outline: 'none',
                                textDecoration: 'none',
                                width: 'auto',
                              }}
                              src={sendToOptions.emailLogoURL}
                              alt="Insight"
                              width="190"
                              height="85"
                            />
                          </a>
                        </td>
                        <td style={{textAlign: 'right', padding: '10px 16px 10px 16px'}}>
                          {isEMEA &&
                            <span>
                              <a
                                href={sendToOptions.emailEMEAContactUsURL}
                                style={{
                                  margin: 0,
                                    color: '#ae0a46',
                                    fontFamily: 'allumi-2-std,Helvetica Neue,Helvetica,Helvetica,Arial,sans-serif',
                                    fontWeight: 'normal',
                                    lineHeight: '1.3',
                                    padding: 0,
                                    textAlign: 'left',
                                    textDecoration: 'none',
                                }}
                               >
                                {t('Contact us')}
                              </a>
                              <span style={{ margin: '0 5px', color:'#5f5753'}}>{' '}| {' '}</span>
                            </span>
                          }
                          <span
                            style={{
                              margin: 0,
                              color: '#222',
                              fontFamily: 'allumi-2-std,Helvetica Neue,Helvetica,Helvetica,Arial,sans-serif',
                              fontWeight: 'normal',
                              lineHeight: '1.3',
                              padding: 0,
                            }}
                           >
                            {isEMEA ? configLabels.phoneNumber :sendToOptions.phoneNumberToDisplay}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td
                          colSpan="2"
                          style={{
                            margin: '0 auto',
                            color: '#3e332d',
                            fontFamily: 'allumi-2-std,Helvetica Neue,Helvetica,Helvetica,Arial,sans-serif',
                            fontSize: 16,
                            fontWeight: 'normal',
                            lineHeight: '1.3',
                            padding: 0,
                            paddingBottom: 16,
                            paddingLeft: 16,
                            paddingRight: 8,
                            textAlign: 'left',
                          }}
                        >
                          <p>{subject}</p>
                          <p>{sendToOptions.yourComments}</p>
                          {isSplaOrCitrix && (
                            <p>
                              {t('This order placed for reporting date')}: <strong>{date}</strong>
                            </p>
                          )}
                          {isShipComplete && (
                            <p>{t('This order is flagged to ship once all items become available.')}</p>
                          )}
                          {isXD && (
                            <p className="hosted-licensing__message">
                              <span className="orders__ion-icon orders__ion-icon--left ion-android-warning" />
                            {t(`There has been an issue calculating shipping costs for this order. Either the freight cost is too large to calculate automatically or the address provided has returned an error. All totals are therefore showing as 'Estimated', as this price does not include shipping costs.`)}
                            </p>
                          )}
                        </td>
                      </tr>
                      {/* start deatils header section */}
                      <tr>
                        <EmailOrderDetailHeader
                          displayDate={displayDate}
                          isLoggedIn={isLoggedIn}
                          isSEWP={isSEWP}
                          orderStatus={orderStatus}
                          poValue={poValue}
                          salesDocumentNumber={salesDocumentNumber}
                          webReferenceNumber={webReferenceNumber}
                        />
                        <EmailSummary costProps={costProps} currency={currency} showEWR={showEWR} isEMEA={isEMEA} isXD={isXD} />
                      </tr>
                      {/* End details header section */}
                    </tbody>
                  </table>
                  {/* End email header section */}

                  {/* Start customer info section */}
                  {isLoggedIn && (
                    <table
                      style={{
                        borderCollapse: 'collapse',
                        borderSpacing: 0,
                        padding: 0,
                        textAlign: 'left',
                        verticalAlign: 'top',
                        width: '100%',
                      }}
                    >
                      <tbody>
                        <tr>
                          <EmailCustomerInfo
                            accountName={accountName}
                            billingAddress={billingAddress}
                            billingAttn={billingAttn}
                            billingCompany={billingCompany}
                            blocks={blocks}
                            creditStatus={creditStatus}
                            email={email}
                            isLoggedIn={isLoggedIn}
                            isSEWP={isSEWP}
                            name={name}
                            paymentType={paymentType}
                            phone={phone}
                            poNumber={poNumber}
                            poReleaseNumber={poReleaseNumber}
                            shippingAddress={shippingAddress}
                            shippingAttn={shippingAttn}
                            shippingCompany={shippingCompany}
                            soldTo={soldTo}
                          />
                        </tr>
                      </tbody>
                    </table>
                  )}
                  {/* End customer info section */}

                  {/* start items section */}
                  {parentItems.map((item, index) => {
                    const { data, type } = item
                    const itemDataProps =
                      (type === BUNDLE && getBundleTrackingInfo(item)) || (type === SINGLE_ITEM && data) || {}
                    const lineItemTrackingInfoList = itemDataProps.lineItemTrackingInfo || []
                    const hasTrackingInfo = !!lineItemTrackingInfoList.length

                    const isContract = item.type === CONTRACT
                    const contractName = (item.type === CONTRACT && item.name) || t('Open Market')

                    return (
                      <div key={index}>
                        {/* start Contract header */}
                        {item.name && <EmailSpacer />}
                        {item.name && <EmailContractHeader contractName={item.name} />}
                        {/* End Contract header */}

                        {/* Start render line item */}
                        {item.type === SINGLE_ITEM && (
                          <table
                            style={{
                              borderCollapse: 'collapse',
                              borderSpacing: 0,
                              float: 'none',
                              padding: 0,
                              verticalAlign: 'top',
                              width: '100%',
                              background: '#fff',
                              border: '1px solid #e6e6e5',
                            }}
                          >
                            <EmailLineItem
                              currencyFormat={currencyFormat}
                              currency={currency}
                              hasInvoicingEnabled={hasInvoicingEnabled}
                              hasTrackingInfo={hasTrackingInfo}
                              isContract={isContract}
                              isLoggedIn={isLoggedIn}
                              item={item}
                              lineItemTrackingInfoList={lineItemTrackingInfoList}
                              getDEPInfo={getDEPInfo}
                            />
                          </table>
                        )}
                        {/* End render line item */}

                        {/* start spacer */}
                        {item.type === SINGLE_ITEM && <EmailSpacer />}
                        {/* end spacer */}

                        {/* Start render Contract line / bundle items */}
                        {item.type === CONTRACT &&
                          item.data.map((contractItem, index) => (
                            <div key={index}>
                              {contractItem.type === BUNDLE ? (
                                <EmailBundleItem
                                  currencyFormat={currencyFormat}
                                  currency={currency}
                                  hasInvoicingEnabled={hasInvoicingEnabled}
                                  hasTrackingInfo={hasTrackingInfo}
                                  isContract={isContract}
                                  isLoggedIn={isLoggedIn}
                                  item={contractItem}
                                  lineItemTrackingInfoList={lineItemTrackingInfoList}
                                  getDEPInfo={getDEPInfo}
                                />
                              ) : (
                                <table
                                  style={{
                                    borderCollapse: 'collapse',
                                    borderSpacing: 0,
                                    float: 'none',
                                    padding: 0,
                                    textAlign: 'center',
                                    verticalAlign: 'top',
                                    width: '100%',
                                    background: '#fff',
                                    border: '1px solid #e6e6e5',
                                  }}
                                >
                                  <EmailLineItem
                                    currencyFormat={currencyFormat}
                                    currency={currency}
                                    hasInvoicingEnabled={hasInvoicingEnabled}
                                    hasTrackingInfo={hasTrackingInfo}
                                    isContract={isContract}
                                    isLoggedIn={isLoggedIn}
                                    item={contractItem}
                                    lineItemTrackingInfoList={lineItemTrackingInfoList}
                                    getDEPInfo={getDEPInfo}
                                  />
                                </table>
                              )}
                            </div>
                          ))}
                        {/* End render Contract line / bundle items */}

                        {/* Start render bundle items */}
                        {item.type === BUNDLE && (
                          <div>
                            <EmailBundleItem
                              currencyFormat={currencyFormat}
                              currency={currency}
                              hasInvoicingEnabled={hasInvoicingEnabled}
                              hasTrackingInfo={hasTrackingInfo}
                              isContract={isContract}
                              isLoggedIn={isLoggedIn}
                              item={item}
                              lineItemTrackingInfoList={lineItemTrackingInfoList}
                              getDEPInfo={getDEPInfo}
                            />
                          </div>
                        )}
                        {/* End render bundle items */}
                      </div>
                    )
                  })}

                  {/* End items section */}

                  {/* footer section */}
                  {!isEMEA ?
                    <table
                      style={{
                        margin: '0 auto',
                        borderCollapse: 'collapse',
                        borderSpacing: 0,
                        float: 'none',
                        padding: 0,
                        textAlign: 'center',
                        verticalAlign: 'top',
                        width: '100%',
                      }}>
                      <tbody>
                        <tr style={{ padding: 0, textAlign: 'left', verticalAlign: 'top' }}>
                          <td
                            style={{
                              MozHyphens: 'auto',
                              WebkitHyphens: 'auto',
                              margin: 0,
                              borderCollapse: 'collapse !important',
                              color: '#3e332d',
                              fontFamily: 'allumi-2-std,Helvetica Neue,Helvetica,Helvetica,Arial,sans-serif',
                              fontSize: 16,
                              fontWeight: 'normal',
                              hyphens: 'auto',
                              lineHeight: '1.3',
                              padding: 0,
                              textAlign: 'left',
                              verticalAlign: 'top',
                              wordWrap: 'break-word',
                            }}
                          >
                            <table
                              style={{
                                margin: '0 auto',
                                background: 'white',
                                borderCollapse: 'collapse',
                                borderSpacing: 0,
                                padding: 0,
                                textAlign: 'inherit',
                                verticalAlign: 'top',
                                width: '100%',
                              }}
                            >
                              <tbody>
                                <tr style={{ padding: 0, textAlign: 'left', verticalAlign: 'top' }}>
                                  <td
                                    style={{
                                      MozHyphens: 'auto',
                                      WebkitHyphens: 'auto',
                                      margin: 0,
                                      borderCollapse: 'collapse !important',
                                      color: '#3e332d',
                                      fontFamily: 'allumi-2-std,Helvetica Neue,Helvetica,Helvetica,Arial,sans-serif',
                                      fontSize: 16,
                                      fontWeight: 'normal',
                                      hyphens: 'auto',
                                      lineHeight: '1.3',
                                      padding: 0,
                                      textAlign: 'left',
                                      verticalAlign: 'top',
                                      wordWrap: 'break-word',
                                    }}
                                  >
                                    <table
                                      style={{
                                        borderCollapse: 'collapse',
                                        borderSpacing: 0,
                                        padding: 0,
                                        textAlign: 'left',
                                        verticalAlign: 'top',
                                        width: '100%',
                                      }}
                                    >
                                      <tbody>
                                        <tr style={{ padding: 0, textAlign: 'left', verticalAlign: 'top' }}>
                                          <td
                                            height="16px"
                                            style={{
                                              MozHyphens: 'auto',
                                              WebkitHyphens: 'auto',
                                              margin: 0,
                                              borderCollapse: 'collapse !important',
                                              color: '#3e332d',
                                              fontFamily:
                                                'allumi-2-std,Helvetica Neue,Helvetica,Helvetica,Arial,sans-serif',
                                              fontSize: 16,
                                              fontWeight: 'normal',
                                              hyphens: 'auto',
                                              lineHeight: '16px',
                                              msoLineHeightRule: 'exactly',
                                              padding: 0,
                                              textAlign: 'left',
                                              verticalAlign: 'top',
                                              wordWrap: 'break-word',
                                            }}
                                          />
                                        </tr>
                                      </tbody>
                                    </table>
                                    <table style={{
                                        borderCollapse: 'collapse',
                                        borderSpacing: 0,
                                        display: 'table',
                                        padding: 0,
                                        position: 'relative',
                                        textAlign: 'left',
                                        verticalAlign: 'top',
                                        width: '100%',
                                      }}>
                                      <tbody>
                                        <tr style={{ padding: 0, textAlign: 'left', verticalAlign: 'top' }}>
                                          <th
                                            style={{
                                              margin: '0 auto',
                                              color: '#3e332d',
                                              fontFamily:
                                                'allumi-2-std,Helvetica Neue,Helvetica,Helvetica,Arial,sans-serif',
                                              fontSize: 16,
                                              fontWeight: 'normal',
                                              lineHeight: '1.3',
                                              padding: 0,
                                              paddingBottom: 16,
                                              paddingLeft: 16,
                                              paddingRight: 16,
                                              textAlign: 'left',
                                            }}
                                          >
                                            <table
                                              style={{
                                                borderCollapse: 'collapse',
                                                borderSpacing: 0,
                                                padding: 0,
                                                textAlign: 'left',
                                                verticalAlign: 'top',
                                                width: '100%',
                                              }}
                                            >
                                              <tbody>
                                                <tr style={{ padding: 0, textAlign: 'left', verticalAlign: 'top' }}>
                                                  <th
                                                    style={{
                                                      margin: 0,
                                                      color: '#3e332d',
                                                      fontFamily:
                                                        'allumi-2-std,Helvetica Neue,Helvetica,Helvetica,Arial,sans-serif',
                                                      fontSize: 16,
                                                      fontWeight: 'normal',
                                                      lineHeight: '1.3',
                                                      padding: 0,
                                                      textAlign: 'left',
                                                    }}
                                                  >
                                                    <p
                                                      style={{
                                                        margin: 0,
                                                        marginBottom: 10,
                                                        color: '#3e332d',
                                                        fontFamily:
                                                          'allumi-2-std,Helvetica Neue,Helvetica,Helvetica,Arial,sans-serif',
                                                        fontSize: 16,
                                                        fontWeight: 'normal',
                                                        lineHeight: '1.3',
                                                        padding: 0,
                                                        textAlign: 'center',
                                                      }}
                                                    >
                                                      <small style={{ color: '#3e332d', fontSize: '80%' }}>
                                                        <strong>{t('Insight respects your privacy')}</strong>
                                                      </small>
                                                    </p>
                                                    <p
                                                      style={{
                                                        margin: 0,
                                                        marginBottom: 0,
                                                        color: '#3e332d',
                                                        fontFamily:
                                                          'allumi-2-std,Helvetica Neue,Helvetica,Helvetica,Arial,sans-serif',
                                                        fontSize: 16,
                                                        fontWeight: 'normal',
                                                        lineHeight: '1.3',
                                                        padding: 0,
                                                        textAlign: 'center',
                                                      }}
                                                    >
                                                      <small style={{ color: '#3e332d', fontSize: '80%' }}>
                                                        {t(
                                                          'We will never rent, lend or sell your email address or other contact information to another organization.'
                                                        )}
                                                      </small>
                                                    </p>
                                                  </th>
                                                  <th
                                                    style={{
                                                      margin: 0,
                                                      color: '#3e332d',
                                                      fontFamily:
                                                        'allumi-2-std,Helvetica Neue,Helvetica,Helvetica,Arial,sans-serif',
                                                      fontSize: 16,
                                                      fontWeight: 'normal',
                                                      lineHeight: '1.3',
                                                      padding: '0 !important',
                                                      textAlign: 'left',
                                                      visibility: 'hidden',
                                                      width: 0,
                                                    }}
                                                  />
                                                </tr>
                                              </tbody>
                                            </table>
                                          </th>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <center data-parsed style={{ minWidth: 580, width: '100%' }}>
                                      <table
                                        style={{
                                          margin: '0 auto',
                                          borderCollapse: 'collapse',
                                          borderSpacing: 0,
                                          float: 'none',
                                          padding: 0,
                                          textAlign: 'center',
                                          verticalAlign: 'top',
                                          width: 'auto !important',
                                        }}
                                      >
                                        <tbody>
                                          <tr style={{ padding: 0, textAlign: 'left', verticalAlign: 'top' }}>
                                            <td
                                              style={{
                                                MozHyphens: 'auto',
                                                WebkitHyphens: 'auto',
                                                margin: 0,
                                                borderCollapse: 'collapse !important',
                                                color: '#3e332d',
                                                fontFamily:
                                                  'allumi-2-std,Helvetica Neue,Helvetica,Helvetica,Arial,sans-serif',
                                                fontSize: 16,
                                                fontWeight: 'normal',
                                                hyphens: 'auto',
                                                lineHeight: '1.3',
                                                padding: 0,
                                                textAlign: 'left',
                                                verticalAlign: 'top',
                                                wordWrap: 'break-word',
                                              }}
                                            >
                                              <table
                                                style={{
                                                  borderCollapse: 'collapse',
                                                  borderSpacing: 0,
                                                  padding: 0,
                                                  textAlign: 'left',
                                                  verticalAlign: 'top',
                                                }}
                                              >
                                                <tbody>
                                                  <tr style={{ padding: 0, textAlign: 'left', verticalAlign: 'top' }}>
                                                    <th
                                                      style={{
                                                        margin: '0 auto',
                                                        color: '#3e332d',
                                                        float: 'none',
                                                        fontFamily:
                                                          'allumi-2-std,Helvetica Neue,Helvetica,Helvetica,Arial,sans-serif',
                                                        fontSize: '80%',
                                                        fontWeight: 'normal',
                                                        lineHeight: '1.3',
                                                        padding: 5,
                                                        paddingRight: 16,
                                                        textAlign: 'center',
                                                      }}
                                                    >
                                                      <a
                                                        href={sendToOptions.emailPrivacyPolicyURL}
                                                        style={{
                                                          margin: 0,
                                                          color: '#ae0a46',
                                                          fontFamily:
                                                            'allumi-2-std,Helvetica Neue,Helvetica,Helvetica,Arial,sans-serif',
                                                          fontWeight: 'normal',
                                                          lineHeight: '1.3',
                                                          padding: 0,
                                                          textAlign: 'left',
                                                          textDecoration: 'none',
                                                        }}
                                                      >
                                                        {t('Privacy Policy')}
                                                      </a>
                                                    </th>
                                                    <th
                                                      style={{
                                                        margin: '0 auto',
                                                        color: '#3e332d',
                                                        float: 'none',
                                                        fontFamily:
                                                          'allumi-2-std,Helvetica Neue,Helvetica,Helvetica,Arial,sans-serif',
                                                        fontSize: '80%',
                                                        fontWeight: 'normal',
                                                        lineHeight: '1.3',
                                                        padding: 5,
                                                        paddingRight: 16,
                                                        textAlign: 'center',
                                                      }}
                                                    >
                                                      <a
                                                        href={sendToOptions.emailReturnPolicyURL}
                                                        style={{
                                                          margin: 0,
                                                          color: '#ae0a46',
                                                          fontFamily:
                                                            'allumi-2-std,Helvetica Neue,Helvetica,Helvetica,Arial,sans-serif',
                                                          fontWeight: 'normal',
                                                          lineHeight: '1.3',
                                                          padding: 0,
                                                          textAlign: 'left',
                                                          textDecoration: 'none',
                                                        }}
                                                      >
                                                        {t('Business and return policies')}
                                                      </a>
                                                    </th>
                                                    <th
                                                      style={{
                                                        margin: '0 auto',
                                                        color: '#3e332d',
                                                        float: 'none',
                                                        fontFamily:
                                                          'allumi-2-std,Helvetica Neue,Helvetica,Helvetica,Arial,sans-serif',
                                                        fontSize: '80%',
                                                        fontWeight: 'normal',
                                                        lineHeight: '1.3',
                                                        padding: 5,
                                                        paddingRight: 16,
                                                        textAlign: 'center',
                                                      }}
                                                    >
                                                      <a
                                                        href={sendToOptions.emailContactUsURL}
                                                        style={{
                                                          margin: 0,
                                                          color: '#ae0a46',
                                                          fontFamily:
                                                            'allumi-2-std,Helvetica Neue,Helvetica,Helvetica,Arial,sans-serif',
                                                          fontWeight: 'normal',
                                                          lineHeight: '1.3',
                                                          padding: 0,
                                                          textAlign: 'left',
                                                          textDecoration: 'none',
                                                        }}
                                                      >
                                                        {t('Customer support')}
                                                      </a>
                                                    </th>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </center>
                                    <table
                                      style={{
                                        borderCollapse: 'collapse',
                                        borderSpacing: 0,
                                        padding: 0,
                                        textAlign: 'left',
                                        verticalAlign: 'top',
                                        width: '100%',
                                      }}
                                    >
                                      <tbody>
                                        <tr style={{ padding: 0, textAlign: 'left', verticalAlign: 'top' }}>
                                          <td
                                            height="16px"
                                            style={{
                                              MozHyphens: 'auto',
                                              WebkitHyphens: 'auto',
                                              margin: 0,
                                              borderCollapse: 'collapse !important',
                                              color: '#3e332d',
                                              fontFamily:
                                                'allumi-2-std,Helvetica Neue,Helvetica,Helvetica,Arial,sans-serif',
                                              fontSize: 16,
                                              fontWeight: 'normal',
                                              hyphens: 'auto',
                                              lineHeight: '16px',
                                              msoLineHeightRule: 'exactly',
                                              padding: 0,
                                              textAlign: 'left',
                                              verticalAlign: 'top',
                                              wordWrap: 'break-word',
                                            }}
                                          />
                                        </tr>
                                      </tbody>
                                    </table>
                                    <table
                                      style={{
                                        borderCollapse: 'collapse',
                                        borderSpacing: 0,
                                        display: 'table',
                                        padding: 0,
                                        position: 'relative',
                                        verticalAlign: 'top',
                                        width: '100%',
                                      }}
                                    >
                                      <tbody>
                                        <tr style={{ padding: 0, textAlign: 'left', verticalAlign: 'top' }}>
                                          <th
                                            style={{
                                              margin: '0 auto',
                                              color: '#3e332d',
                                              fontFamily:
                                                'allumi-2-std,Helvetica Neue,Helvetica,Helvetica,Arial,sans-serif',
                                              fontSize: 16,
                                              fontWeight: 'normal',
                                              lineHeight: '1.3',
                                              padding: 0,
                                              paddingBottom: 16,
                                              paddingLeft: 16,
                                              paddingRight: 16,
                                            }}
                                          >
                                            <table
                                              style={{
                                                borderCollapse: 'collapse',
                                                borderSpacing: 0,
                                                padding: 0,
                                                textAlign: 'left',
                                                verticalAlign: 'top',
                                                width: '100%',
                                              }}
                                            >
                                              <tbody>
                                                <tr style={{ padding: 0, textAlign: 'left', verticalAlign: 'top' }}>
                                                  <th
                                                    style={{
                                                      margin: 0,
                                                      color: '#3e332d',
                                                      fontFamily:
                                                        'allumi-2-std,Helvetica Neue,Helvetica,Helvetica,Arial,sans-serif',
                                                      fontSize: 16,
                                                      fontWeight: 'normal',
                                                      lineHeight: '1.3',
                                                      padding: 0,
                                                      textAlign: 'left',
                                                    }}
                                                  >
                                                    <p
                                                      style={{
                                                        margin: 0,
                                                        marginBottom: 10,
                                                        color: '#3e332d',
                                                        fontFamily:
                                                          'allumi-2-std,Helvetica Neue,Helvetica,Helvetica,Arial,sans-serif',
                                                        fontSize: 16,
                                                        fontWeight: 'normal',
                                                        lineHeight: '1.3',
                                                        padding: 0,
                                                        textAlign: 'center',
                                                      }}
                                                    >
                                                      <small style={{ color: '#3e332d', fontSize: '80%' }}>
                                                        {t('Copyright')} 1988{sp} { fullYear }{''}{spacer}
                                                        {t('2701 E. Insight Way Chandler, AZ 85286')}<br />
                                                        {t('Copyright')} { fullYear }{''}
                                                        {t('Insight Direct USA, Inc.')},
                                                        {t(
                                                          'All other company and product names are trademarks or service marks of their respective owners.For all prices and products, we reserve the right to make adjustments due to errors, changing market conditions, product discontinuations or typographical errors. Please contact your Insight representative if you have any questions.'
                                                        )}
                                                      </small>
                                                    </p>
                                                  </th>
                                                  <th
                                                    style={{
                                                      margin: 0,
                                                      color: '#3e332d',
                                                      fontFamily:
                                                        'allumi-2-std,Helvetica Neue,Helvetica,Helvetica,Arial,sans-serif',
                                                      fontSize: 16,
                                                      fontWeight: 'normal',
                                                      lineHeight: '1.3',
                                                      padding: '0 !important',
                                                      textAlign: 'left',
                                                      visibility: 'hidden',
                                                      width: 0,
                                                    }}
                                                  />
                                                </tr>
                                              </tbody>
                                            </table>
                                          </th>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    :
                    <EMEAEmailFooter
                      configLabels={configLabels}
                      consortiaID={consortiaID}
                      sendToOptions={sendToOptions}
                    />}
                  {/* End footer section */}
              </td>
            </tr>
          </tbody>
        </table>
        {/* prevent Gmail on iOS font size manipulation */}
        <div style={{ display: 'none', whiteSpace: 'nowrap', font: '15px courier', lineHeight: 0 }}>
          {' '}
          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;{' '}
        </div>
      </div>
      </Locale>
    )
  }

  function getQuantityAndPrice(item) {
    const total = item.reduce(
      (totals, item) => {
        totals.qtyShippedTotal += item.qtyShipped
        totals.totalPriceSum += item.totalPrice
        return totals
      },
      { qtyShippedTotal: 0, totalPriceSum: 0 }
    )
    return total
  }

  function convertToBlocks(array, blockSize) {
    return array.reduce(
      (acc, value) => {
        if (acc[acc.length - 1].length === blockSize) {
          acc.push([])
        }
        acc[acc.length - 1].push(value)
        return acc
      },
      [[]]
    )
  }

  const subject = `${t('Message from Insight at the request of')} ${sendToOptions.yourName}`
  return sendEmail({
    sendEmailURL: sendToOptions.sendEmailURL,
    to: sendToOptions.recipientEmail,
    from: sendToOptions.yourEmail,
    subject,
    content: getOrderItemsMarkup(),
  })
}
