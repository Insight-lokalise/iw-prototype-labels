import { DEFAULT_LOGGED_OUT_FEATURE_FLAG } from "../constants";

// Check if CES user or Default Logged user
export function isCesOrDefaultLoggedOut() {
    const { userInformation } = window.Insight;
    const { isCES } = userInformation || {};
    const isDefaultLoggedOut = window.flags && window.flags[DEFAULT_LOGGED_OUT_FEATURE_FLAG];
    return isCES || isDefaultLoggedOut;
}