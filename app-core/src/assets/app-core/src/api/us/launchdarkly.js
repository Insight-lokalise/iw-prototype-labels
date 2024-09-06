import { initialize } from 'launchdarkly-js-client-sdk';
import env from './env'

const initLaunchdarklyClient = async () => {
    const user = {
        key: "InsightWebUser"
    }
    const client = initialize(env.launchDarklyClientId, user)

    return client;
} 

export default initLaunchdarklyClient
