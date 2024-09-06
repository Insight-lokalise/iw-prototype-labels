import React from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import { getCurrentLocale, getRegion } from '@insight/toolkit-utils/lib/helpers/localeHelpers'
import { t } from "@insight/toolkit-utils/lib/labels";
import { INSIGHT_LOCALE_COOKIE_NAME, REGION_CODE } from "../../api/common/locales";

export default function EndIESupportMessage({isCheckout, isTestCase, testLocale, testRegion}) {

  const isIE = (/*@cc_on\!@*/false) || (document.documentMode) || testLocale
  
  const secondaryNavPresent = !!document.getElementById(
    "react-app-secondary-nav"
  )
  const secondaryNavBlackPresent = !!document.querySelector('.c-subnav--black');

  const getSupportLink = () => {
    const defaultLocale = testLocale || getCurrentLocale(INSIGHT_LOCALE_COOKIE_NAME)
    const region = testRegion || getRegion(INSIGHT_LOCALE_COOKIE_NAME)

    if(region == REGION_CODE.EMEA) {
      return `/${defaultLocale}/knowledge-base/help/what-browsers-does-insight-support.html`
    }
    else if(region == REGION_CODE.APAC) {
      return `/${defaultLocale}/help/frequently-asked-questions.html#supported-browsers`
    }
    else {
      if(defaultLocale.toLowerCase().indexOf('ca') > -1) {
        return `/${defaultLocale}/help/faqs.html#supported-browsers`
      }
      else {
        //default to US
        return `/${defaultLocale}/content-and-resources/knowledge-base/myinsight-faqs/e-commerce-guides/what-browsers-does-insight-support.html`
      }
    }

  }

  return (
    <>
    {isIE && !isCheckout &&
      <div className={
        cn(`o-grid o-grid--center o-grid--full-height c-end-ie-support-message`, 
        { 
          "secondary-nav": secondaryNavPresent,
          "secondary-nav-black": secondaryNavBlackPresent
        })
        }>
          <div className="o-grid__item">
              <span>{t('Insight will be ending support for Internet Explorer 11 on Nov. 30, 2022. We recommend you open this website in a')} <a href={getSupportLink()}>{t('supported browser')}</a></span>
          </div>          
      </div>
    }
    </>
  );
}

EndIESupportMessage.propTypes = {
  isCheckout: PropTypes.bool,
  testLocale: PropTypes.string,
  testRegion: PropTypes.string,
};

EndIESupportMessage.defaultProps = {
  isCheckout: false,
};
