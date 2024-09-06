import pick from 'lodash-es/pick'
import { getCurrentLocale } from '@insight/toolkit-utils/lib/helpers/localeHelpers'
import initialState from './../../../app/libs/initialState'

export default function(state = initialState.insight, action) {
    const nextInsightState = pick(window.Insight, ['ipsUser', 'userInformation', 'eightHundredNumber', 'rrApiUrl', 'isIpsLogo'])
    return {
        ...state,
        ...nextInsightState,
        locale: getCurrentLocale("insight_current_locale", "insight_locale")
    }
}
