import React from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils/lib/labels'

/**
 * Renders the proper contract title.
 * @param { Object } Item
 */
export default function ContractHeader({ item }) {
  return (
    <div className="contract-header" id="contract">
      <h2 className="contract-header__title">
        {t('Contract')}: {item.name}
      </h2>
    </div>
  )
}

ContractHeader.propTypes = {
  item: PropTypes.shape({
    type: PropTypes.string,
    name: PropTypes.string,
    data: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
}
