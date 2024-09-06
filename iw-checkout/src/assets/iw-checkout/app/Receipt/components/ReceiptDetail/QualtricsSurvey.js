import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { isEmeaRegion } from '@insight/toolkit-utils/lib/helpers/localeHelpers'
import { getCurrentLocale } from '@insight/toolkit-utils/lib/helpers/localeHelpers'
import { webGroupPermissions } from '../../../../libs/User/permissions'
import { selector_featureFlags } from '../../../../libs/flags/selectors'
import {
  selector_webGroupPermissions,
  selector_consortiaAgreements,
} from '../../../../libs/User/selectors'
import { selector_ipsUser } from '../../../../libs/Insight/selectors'
import { selector_isRequisition } from '../../../LineLevel/selectors'
import { LANGUAGE_MAPPING, NPS_SURVEY_ID } from '../../../constants'

const QualtricsSurvey = ({
  featureFlags,
  webGroupPermissionsList,
  isRequisition,
  consortiaAgreements,
  isIPS,
}) => {
  const doesUserHaveConsortiaAgreements = consortiaAgreements.length > 0
  const SURVEY_ID = isEmeaRegion()
    ? NPS_SURVEY_ID.EMEA_SURVEY_ID
    : isIPS
    ? NPS_SURVEY_ID.IPS_ID
    : NPS_SURVEY_ID.NA_SURVEY_ID

  const oneTrustFunctionalCookie = () => {
    if (window.getPrivacySettings) {
      if (getPrivacySettings().functional) {
        return true
      }
    } else {
      console.warn(
        'getPrivacySettings should be defined - initializing Qualtrics Survey.'
      )
    }
    return false
  }

  //get Qualtrics language code from locale
  const getLanguageCode = () => {
    const [language, country] = getCurrentLocale(
      'insight_current_locale'
    ).split('_')

    if (LANGUAGE_MAPPING[language]) {
      return (
        LANGUAGE_MAPPING[language][country] ||
        LANGUAGE_MAPPING[language].DEFAULT
      )
    }

    return language.toUpperCase()
  }

  useEffect(() => {
    const enableNpsSurvey =
      //feature flag is checking context for logged-in and required salesOrg
      featureFlags['GNA-12406-NPS-SURVEY'] &&
      oneTrustFunctionalCookie() &&
      !doesUserHaveConsortiaAgreements &&
      !isRequisition &&
      !webGroupPermissionsList.includes(webGroupPermissions.DISABLE_NPS_SURVEY)
    if (!enableNpsSurvey) return false
    //set default language for the survey
    Insight.Q_Language = getLanguageCode()

    /** <--BEGIN QUALTRICS WEBSITE FEEDBACK SNIPPET-->
     * Note:
     * Qualtrics is parsing data from global Insight object and DOM to get order information and default language for the survey.
     * Check with marketing to see how it is configured within Qualtrics website.
     **/
    ;(function () {
      var g = function (e, h, f, g) {
        this.get = function (a) {
          for (
            var a = a + '=',
              c = document.cookie.split(';'),
              b = 0,
              e = c.length;
            b < e;
            b++
          ) {
            for (var d = c[b]; ' ' == d.charAt(0); )
              d = d.substring(1, d.length)
            if (0 == d.indexOf(a)) return d.substring(a.length, d.length)
          }
          return null
        }
        this.set = function (a, c) {
          var b = '',
            b = new Date()
          b.setTime(b.getTime() + 6048e5)
          b = '; expires=' + b.toGMTString()
          document.cookie = a + '=' + c + b + '; path=/; '
        }
        this.check = function () {
          var a = this.get(f)
          if (a) a = a.split(':')
          else if (100 != e)
            'v' == h && (e = Math.random() >= e / 100 ? 0 : 100),
              (a = [h, e, 0]),
              this.set(f, a.join(':'))
          else return !0
          var c = a[1]
          if (100 == c) return !0
          switch (a[0]) {
            case 'v':
              return !1
            case 'r':
              return (
                (c = a[2] % Math.floor(100 / c)),
                a[2]++,
                this.set(f, a.join(':')),
                !c
              )
          }
          return !0
        }
        this.go = function () {
          if (this.check()) {
            var a = document.createElement('script')
            a.type = 'text/javascript'
            a.src = g
            document.body && document.body.appendChild(a)
          }
        }
        this.start = function () {
          var t = this
          'complete' !== document.readyState
            ? window.addEventListener
              ? window.addEventListener(
                  'load',
                  function () {
                    t.go()
                  },
                  !1
                )
              : window.attachEvent &&
                window.attachEvent('onload', function () {
                  t.go()
                })
            : t.go()
        }
      }
      try {
        new g(
          100,
          'r',
          `QSI_S_ZN_${SURVEY_ID}`,
          `https://zn${SURVEY_ID.toLowerCase()}-insightenterprises.siteintercept.qualtrics.com/SIE/?Q_ZID=ZN_${SURVEY_ID}`
        ).start()
      } catch (i) {}
    })()
    /**
     * <--END QUALTRICS WEBSITE FEEDBACK SNIPPET-->
     **/
  }, [])

  return (
    <>
      <div id={`ZN_${SURVEY_ID}`}></div>
    </>
  )
}

function mapStateToProps(state) {
  return {
    featureFlags: selector_featureFlags(state),
    webGroupPermissionsList: selector_webGroupPermissions(state),
    isRequisition: selector_isRequisition(state),
    consortiaAgreements: selector_consortiaAgreements(state),
    isIPS: selector_ipsUser(state),
  }
}

export default connect(mapStateToProps, null)(QualtricsSurvey)
