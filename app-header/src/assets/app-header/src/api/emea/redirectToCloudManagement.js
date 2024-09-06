import axios from 'axios'

import { windowRedirect } from '../common/util'

/**
 * Redirect to either ET or Odin, depending on which is enabled.
 */
export default function redirectToCloudManagement() {
  const { etHasPrecedence, isEtClient, isOdinClient } = window.cloudConfiguration || {}

  const useOdin = (!etHasPrecedence || !isEtClient) && isOdinClient;

  return useOdin ? redirectToOdin() : redirectToET()
}


/**
 * Redirect to ET.
 */
function redirectToET() {
  const { cloudJumpUri } = window.cloudConfiguration || {}

  return cloudJumpUri
    ? Promise.resolve(windowRedirect({ redirectURL: cloudJumpUri }))
    : Promise.reject()
}


/**
 * Redirect to Odin.
 */
function redirectToOdin() {
  const { admtkn, contactId } = window.cloudConfiguration || {}

  return axios
    .get(`${window.siteServiceBase}/osagateway/v1/users/${contactId}/portal/`, {
      headers: {
        Authorization: admtkn,
        Accept: 'application/json',
      },
    })
    .then(({ data }) => ({ redirectURL: data }))
    .then(windowRedirect)
}
