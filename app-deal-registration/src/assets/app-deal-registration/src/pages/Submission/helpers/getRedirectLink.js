import { CANADA_REDIRECT_LINK, US_REDIRECT_LINK } from '../constants'

export default function getRedirectLink(salesAreaId) {
    if (salesAreaId === 3) {
        return CANADA_REDIRECT_LINK
    }
    return US_REDIRECT_LINK
}