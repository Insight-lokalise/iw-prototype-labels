import axios from 'axios'

import { getHeaderInformation } from './'
import { windowRedirect } from '../common/util'

export default function switchWebGroup({ id }) {
  const timestamp = new Date().getTime()
  return getHeaderInformation()
    .then(({ userInformation: { webLoginProfileId } }) => webLoginProfileId)
    .then(webLoginProfileId =>
      axios
        .get(`/insightweb/endUser/changeWebGroup/${id}/${webLoginProfileId}/${timestamp}`)
        .catch(error => {
          console.warn('Failed to change webGroup', error)
          throw error
        })
        .then(({ data }) => {
          const redirectURL = data.redirectUrl || '/insightweb/welcome'
          return { redirectURL }
        })
        .then(windowRedirect)
    )
}
