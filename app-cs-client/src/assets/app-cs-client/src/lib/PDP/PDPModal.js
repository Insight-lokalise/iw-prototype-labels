import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import { Loading, Modal } from "@insight/toolkit-react"
import { l, t } from '@insight/toolkit-utils'

import PDPBody from './PDPBody'

export default function PDPModal({ contracts, contractId, materialId, onClose, isEMEA, fetchPDPData,...config }) {
  const contract = contracts.find(({ id }) => id === contractId)
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
  }, [contractId, materialId])

  return (
    <Modal isOpen={!!materialId} onClose={onClose} overlayclassname="c-modal-overlay" size="medium">
      <Modal.Header onClick={onClose}>
        <h3 className="u-text-bold">{t('Product detail')}</h3>
      </Modal.Header>
      <Modal.Body id={materialId}>
        {pdpData ? (
          <PDPBody
            {...pdpData}
            {...config}
            contract={contract}
            isEMEA={isEMEA}
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
  isEMEA: PropTypes.bool.isRequired,
  isViewPriceEnabled:PropTypes.bool,
  isViewAvailabilityEnabledEnabled:PropTypes.bool,
  contracts: PropTypes.arrayOf(PropTypes.shape({}))
}

PDPModal.defaultProps = {
  contractId: null,
  materialId: null,
  contracts: null,
  isViewPriceEnabled: true,
  isViewAvailabilityEnabled: true
}
