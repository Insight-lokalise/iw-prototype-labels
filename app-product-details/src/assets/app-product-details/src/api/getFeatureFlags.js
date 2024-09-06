import { getAllFeatureFlags } from 'app-api-user-service'

let cachedResponse

export function getFeatureFlags() {
    if (!cachedResponse) {
        cachedResponse = getAllFeatureFlags().then(({ data }) => {
            return data
        })
    }

    return cachedResponse
}
