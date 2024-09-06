import LogRocket from 'logrocket'
import { getRegion } from '@insight/toolkit-utils/lib/helpers/localeHelpers'
import env from './env'

// To be replaced with triggerExternalAction('getUserInformation') when fixed
async function getUserInformation() {
    const res = await fetch('/insightweb/headerInformation')
    return res.json()
}

/**
 * Initialize session recording with LogRocket.
 */
const initLogRocket = async () => {
    if (!env.logRocketId) return

    const userInformation = await getUserInformation();
    const { isLoggedIn, userInformation: { login, restrictedClient, webGroup, isInternalUser } = {}
    } = userInformation;
    const isRecorded = isLoggedIn && !env.botUsers.test(login)
    const isProd = (env.envName === 'NA-PROD' || env.envName === 'EMEA-PROD')
    const isEMEA = getRegion('insight_current_locale') === 'EMEA';
    const isInternalEMEA = isEMEA && isInternalUser;
    if (isRecorded && !isInternalEMEA) {
        LogRocket.init(env.logRocketId, {
            dom: {
                inputSanitizer: isProd,
            },
            network: {
                requestSanitizer: request => {
                    // scrub out the body
                    request.body = isProd ? null : request.body
                    return request
                },
                responseSanitizer: response => {
                    response.body = isProd ? null : response.body
                    return response
                }
            }
        })
        if (login && webGroup && !restrictedClient) {
            LogRocket.identify(login, {
                webGroup: webGroup.webGroupId
            })
        }
    }
}

export default initLogRocket
