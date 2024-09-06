import { get, post } from './../fetch'

export function existingEnrollmentIDs() {
    return get(`enrolledPartners`)
        .then((partners) => {
            return partners.reduce((obj, partner) => {
                obj[partner.manufacturerNumber] = partner
                return obj
            }, {})
        })
        .catch((error) => {
            console.warn(`Failed to get enrolled partners`)
            throw error
        })
}

export function setEnrollmentInfo(param) {
    return post(`enrollment`, param)
        .catch((error) => {
            console.warn(`Failed to submit enrollmentInfo`)
            throw error
        })
}

export function splitItems(param) {
    return post('/insightweb/splitEnrollment', param)
        .catch((error) => {
            console.warn(`Failed to split DEP items of : ${JSON.stringify(param)} to cart`)
            throw error // re-throw error for initial testing of functionality
        })
}


