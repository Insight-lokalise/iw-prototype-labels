import React from 'react'
import axios from 'axios'
import Header from '@insight/toolkit-react/lib/Header/Header'

const eProcurementTypeMap = {
  CX: 'cxml/transferCart',
  EB: 'oci/transferOCICart',
  OA: 'oag/transferOagCart',
}

export default function renderB2BLogoutLink(b2bInfo, label) {
  return <Header.Top.Item onClick={() => performLogout(b2bInfo)}>{label}</Header.Top.Item>
}

function performLogout({ eProcurementType, extrinsic, token }) {
  return axios
    .post(`/insightweb/b2b/${eProcurementTypeMap[eProcurementType]}`, { cancel: true, extrinsic, token })
    .then(({ data }) => {
      window.location = data.setupToken.browserFormPost
    })
    .catch(error => {
      console.warn('Failed to log out of b2b portal', error)
      throw error
    })
}
