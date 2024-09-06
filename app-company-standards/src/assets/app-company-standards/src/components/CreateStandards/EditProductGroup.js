import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { Panel } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'

import AltPanelHeader from './AltPanelHeader'
import CreateProductGroupForm from './CreateProductGroupForm'
import NameDisplayContainer from '../../containers/NameDisplayContainer'
import { UniversalMessageContext } from "../UniversalMessages"

export default function EditProductGroup({ isManagerView, navigateOnSubmit, onSubmit, productGroup, categoryId }) {
  const { setActiveMessage } = useContext(UniversalMessageContext)

  function handleSubmit(formData, updatedProductGroupId='') {
    onSubmit(formData, updatedProductGroupId, setActiveMessage).then(pg =>navigateOnSubmit({ categoryId, productGroupId: pg.id }))
  }
  const disabled = productGroup.block && isManagerView

  return (
    <div className="c-container">
      <Panel className="o-box o-grid u-margin-bot">
        <AltPanelHeader title={t(`${disabled ? 'View' : 'Edit'} product group`)}>
          <NameDisplayContainer categoryId={categoryId} />
        </AltPanelHeader>
        <div className="o-grid__item u-1/1 u-padding-side-small">
          <CreateProductGroupForm
            categoryId={categoryId}
            isManagerView={isManagerView}
            isEdit
            onSubmit={handleSubmit}
            productGroup={productGroup}
          />
        </div>
      </Panel>
    </div>
  )
}

EditProductGroup.propTypes = {
  navigateOnSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  productGroup: PropTypes.shape({
    block: PropTypes.bool.isRequired,
    description: PropTypes.objectOf(PropTypes.string).isRequired,
    ipsContractId: PropTypes.string.isRequired,
    labConfigType: PropTypes.string.isRequired,
    name: PropTypes.objectOf(PropTypes.string).isRequired,
    parents: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])).isRequired,
    routine: PropTypes.bool.isRequired,
  }).isRequired,
}
