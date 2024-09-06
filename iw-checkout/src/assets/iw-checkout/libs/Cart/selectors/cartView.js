import get from 'lodash-es/get'

export const selector_cartItemsByContract = state => get(state, ['cartView', 'cartViewByContractsAndMaterialIDKey'], {})

export const selector_DEPItemsInCart = (state) => {
    return Object.values(selector_cartItemsByContract(state)).filter(item => item.DEPChecked).length
}

export const selectCartItemsViewByContract = (state, materialIDKey, contractId = '') => {
    return selector_cartItemsByContract(state)[`${contractId}__${materialIDKey}`] || {}
}

export const selector_cartItemsEnrollment = (state) => {
    const enrollmentInfo = selector_cartItemsByContract(state)
    const enrollments = Object.values(enrollmentInfo).filter((enrollment) => enrollment.DEPChecked && (!enrollment.customerId || enrollment.invalidID || enrollment.isExistingID))
    const enrollmentOptIn = Object.values(enrollmentInfo).filter((enrollment) => {
        return enrollment.DEPChecked && enrollment.customerId !== enrollment.defaultCustomerID && !enrollment.invalidID && !enrollment.isExistingID
    })
    const enrollmentOptOut = Object.values(enrollmentInfo).filter((enrollment) => !enrollment.DEPChecked && enrollment.customerId !== enrollment.defaultCustomerID || enrollment.reset)

    const optInPartners = enrollmentOptIn.length > 0 ? enrollmentOptIn.map(item => (
        {
            ...item,
            ...(!!item.defaultCustomerID && item.defaultCustomerID !== item.customerId && {childId: item.childEnrollmentId}),
        }
    )).filter(partner => !!partner.childId || !partner.defaultCustomerID) : []

    return { DEPOptOut: enrollmentOptOut, DEPOptIn: optInPartners, isCheckoutDisabled: enrollments.length > 0}
}
