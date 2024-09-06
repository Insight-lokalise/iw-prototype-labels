import React from 'react'
import get from 'lodash-es/get'
import { t } from '@insight/toolkit-utils/lib/labels'
import PropTypes from 'prop-types'

export default function EMEAEmailFooter(props) {
  const {configLabels, consortiaID, sendToOptions } = props

  return(
    <table width="100%" border="0">
      <tr>
        <td align="center" valign="middle" style={{fontSize: '12px', lineHeight: '18px', padding: '20px 0 20px 20px', color: '#222222', background: '#E6E6E5',fontFamily: 'Arial, Arial sans-serif'}}>
          <div style={{fontSize: '12px', fontWeight: 'bold'}}>{t('Revolutionize the way you manage technology')}</div>
          <table width="100%" style={{background: '#E6E6E5',border:'0'}}>
            {configLabels.newsLetterLink ?
              <tr>
                <td style={{width:'50%',textAlign:'right',paddingTop: '10px',paddingRight: '20px',fontSize: '12px',fontFamily: 'Arial, Arial sans-serif'}}>
                  <span>{t('Learn more about')}{' '}</span>
                  <a href={get(sendToOptions, 'loginURL')} style={{ color: '#ae0a46', textDecoration: 'none'}}>{t('Insight')}</a>
                </td>
                <td style={{width:'50%',textAlign:'left',paddingTop: '10px',paddingLeft: '20px',fontSize: '12px',verticalAlign: 'center',fontFamily: 'Arial, Arial sans-serif'}}>
                  <table style={{background: '#E6E6E5'}} border='0'>
                    <tr>
                      <td style={{ width:'3%'}} >
                        <span style={{ verticalAlign: 'bottom'}}>
                          <img src="https://www.insight.com/content/dam/insight/bgimages/social/25x23/ico-newsLetter2.png" alt="Get the Newsletter" />
                        </span>
                      </td>
                      <td style={{fontSize: '12px',verticalAlign: 'bottom',paddingLeft:'5px'}} >
                        <a style={{ verticalAlign: 'bottom',color: '#ae0a46', textDecoration: 'none'}}  href={get(sendToOptions,'emailLinkBase')+configLabels.newsLetterLink} title="Get the Newsletter">
                          <span>{t('Get the Newsletter')}</span>
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              :
              <tr>
                <td style={{textAlign:'center',fontSize: '12px'}}>
                  <span>{t('Learn more about')}{' '}</span>
                  <a href={get(sendToOptions, 'loginURL')} style={{ color: '#ae0a46', textDecoration: 'none',}}>{t('insight.com account')}</a>
                </td>
              </tr>
            }
          </table>
        </td>
      </tr>
      <tr style={{border: 'none'}}>
        <td align="center"
        style={{lineHeight:'20px', paddingTop: '20px', paddingBottom: '20px', fontSize: '12px',background: '#5F5753',color: '#fff',borderBottom: '1px solid #6F6764',fontFamily: 'Arial, Arial sans-serif'}}>
          <div>{configLabels.footerCompanyInfo1}</div>
          <div>{configLabels.footerCompanyInfo2}</div>
          <div>{configLabels.footerCompanyInfo3}</div>
        </td>
      </tr>
      <tr>
        <td align="center" style={{padding: '20px 20px',background: '#5F5753',border:'none'}}>
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
            <a style={{fontWeight: 'normal', textDecoration: 'none',color: '#fff', paddingRight: '10px'}} href={sendToOptions.emailLinkBase+configLabels.privacyPolicyLink}><span>{t('Privacy Policy')}</span></a>
            <span style={{ color: '#CBC4C3'}}>{' '}|{' '}</span>
            {consortiaID !== 0 ?
              <a style={{fontWeight: 'normal', textDecoration: 'none',color: '#fff', paddingLeft: '10px'}} href={sendToOptions.emailLinkBase+configLabels.termsAndConditionsLink+'?c='+consortiaID}><span>{t('Terms and Conditions')}</span></a>
              :
              <a style={{fontWeight: 'normal', textDecoration: 'none',color: '#fff', paddingLeft: '10px'}} href={sendToOptions.emailLinkBase+configLabels.termsAndConditionsLink}><span>{t('Terms and Conditions')}</span></a>
            }
          </span>
        </td>
      </tr>
    </table>
  )
}

EMEAEmailFooter.propTypes = {
  configLabels: PropTypes.shape({
    // key value pairs
    fbLink: PropTypes.string,
    footerCompanyInfo1: PropTypes.string,
    footerCompanyInfo2: PropTypes.string,
    footerCompanyInfo3: PropTypes.string,
    instagramLink: PropTypes.string,
    linkedInLink: PropTypes.string,
    newsLetterLink: PropTypes.string,
    privacyPolicyLink: PropTypes.string,
    termsAndConditionsLink: PropTypes.string,
    twitterLink: PropTypes.string,
    xingLink: PropTypes.string,
    youtubeLink: PropTypes.string,
  }).isRequired,
  sendToOptions: PropTypes.shape({
    // key value pairs
    emailLinkBase: PropTypes.string,
  }).isRequired,
  consortiaID: PropTypes.bool.isRequired
}
