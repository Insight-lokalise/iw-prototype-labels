import { getUserInformation } from 'app-api-user-service'

// Set and store initial response as a cached user
let cachedUserInfoResponse

/** Get Session User
 *
 * Get and return the data for the current active user */
export const getSessionUser = async () => {
  try {
    if (!cachedUserInfoResponse) {
      const res = await getUserInformation()
      cachedUserInfoResponse = res
      return res.data
    }
    return cachedUserInfoResponse.data
  } catch (err) {
    console.warn(`Failed to fetch user information`, err)
    throw err
  }
}

export default getSessionUser
