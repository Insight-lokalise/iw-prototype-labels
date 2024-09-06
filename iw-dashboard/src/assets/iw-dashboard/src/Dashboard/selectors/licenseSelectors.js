export function selector_licensePositionByPublisher(state) {
    return state.licensePositionByPublisher || {}
}

export function selector_enterpriseAgreementDetails(state) {
    return state.enterpriseAgreementDetails || {}
}

function selector_enterpriseAgreementDetailsData(state) {
  return selector_enterpriseAgreementDetails(state).data || []
}

export function selector_enterpriseAgreementDetailsDataSelection(state, selection) {
  return selector_enterpriseAgreementDetailsData(state)[selection] || {}
}
