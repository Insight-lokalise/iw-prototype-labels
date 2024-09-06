import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import { Loading, Modal } from "@insight/toolkit-react"
import { l, t } from '@insight/toolkit-utils'

import PDPBody from './PDPBody'

export default function PDPModal({ contractId, materialId, onClose, fetchPDPData }) {

  const [pdpData, setPDPData] = useState(false)
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await fetchPDPData({
        contractId: contractId,
        locale: l(),
        materialId: materialId
      })
      setPDPData(data)
    }
    setPDPData(false)
    fetchData()
  }, [contractId, materialId]
  )
  return (
    <Modal isOpen={!!materialId} onClose={onClose} overlayclassname="c-modal-overlay">
      <Modal.Header onClick={onClose}>
        <h3 className="u-text-bold">{t('Product Detail')}</h3>
      </Modal.Header>
      <Modal.Body id={materialId}>
        {pdpData ? (
          <PDPBody
            {...pdpData}
          />
        ) : (
            <Loading />
          )}
      </Modal.Body>
    </Modal>
  )
}

PDPModal.propTypes = {
  contractId: PropTypes.string,
  materialId: PropTypes.string,
  fetchPDPData: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}

PDPModal.defaultProps = {
  contractId: null,
  materialId: null,
}
