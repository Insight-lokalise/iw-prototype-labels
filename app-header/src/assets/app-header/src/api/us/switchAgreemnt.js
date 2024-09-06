import axios from "axios";
import {windowRedirect} from "../common/util";

export default function switchAgreement({ id }) {
  const redirectURL = '/insightweb/welcome'
  return axios
    .post(`/insightweb/updateConsortia/${id}`)
    .then(() => ({ redirectURL }))
    .then(windowRedirect)
    .catch(error => {
      console.warn('Failed to switch agreement', error)
      throw error
    })


}


