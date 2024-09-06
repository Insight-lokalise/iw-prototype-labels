import { getUserInformation } from "app-api-user-service";
import { REPORTING_TEXTS } from '../texts';
const {API_WARNINGS} = REPORTING_TEXTS;
// Set and store initial response as a cached user
let cachedUserInfoResponse;

/** Get Session User
 *
 * Get and return the data for the current active user */
export const getUserInfo = async () => {
  try {
    if (!cachedUserInfoResponse) {
      const res = await getUserInformation();
      cachedUserInfoResponse = res;
    }
    return cachedUserInfoResponse.data;
  } catch (err) {
    console.warn(API_WARNINGS.FAILED_TO_FETCH_USER_INFO, err);
    throw err;
  }
};

export default getUserInfo;