const generateURL = ({ lineItem, opportunityId }, currentUser) => {
  return currentUser ? `${opportunityId}/lineItemId/${lineItem}/createdBy/${currentUser.name}`
    : `${opportunityId}/lineItemId/${lineItem}`
}
export default async function getClientlinkData(pathArgs, currentUser) {
    if(!pathArgs.opportunityId) return {};
    const baseURL = '/dealreg/clientlink/opportunityId/'
    const url = baseURL + generateURL(pathArgs, currentUser)
    const response = await fetch(url)
    return response.json()
}
