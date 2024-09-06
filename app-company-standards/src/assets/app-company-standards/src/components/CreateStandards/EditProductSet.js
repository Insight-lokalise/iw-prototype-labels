import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { Panel } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'

import AltPanelHeader from './AltPanelHeader'
import CreateProductSetForm from './CreateProductSetForm'
import NameDisplayContainer from '../../containers/NameDisplayContainer'
import { UniversalMessageContext } from "../UniversalMessages"

export default function EditProductSet({ isManagerView, navigateOnSubmit, onSubmit, productSet, categoryId }) {
  const [webGroupId, , productGroupId] = productSet.parents
  const { setActiveMessage } = useContext(UniversalMessageContext)

  function handleSubmit(formData) {
    onSubmit(formData, setActiveMessage).then(() => navigateOnSubmit({ categoryId, productGroupId, productSetId: productSet.id }))
  }
  const disabled = productSet.block && isManagerView

  return (
    <div className="c-container">
      <Panel className="o-box o-grid u-margin-bot">
        <AltPanelHeader title={t(`${disabled ? 'View' : 'Edit'} product set`)}>
          <NameDisplayContainer categoryId={categoryId} productGroupId={productGroupId} />
        </AltPanelHeader>
        <div className="o-grid__item u-1/1 u-padding-side-small">
          <CreateProductSetForm
            categoryId={categoryId}
            isEdit
            isManagerView={isManagerView}
            onSubmit={handleSubmit}
            productGroupId={productGroupId}
            productSet={productSet}
            webGroupId={webGroupId}
          />
        </div>
      </Panel>
    </div>
  )
}

EditProductSet.propTypes = {
  isManagerView: PropTypes.bool.isRequired,
  navigateOnSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  productSet: PropTypes.shape({
    block: PropTypes.bool.isRequired,
    description: PropTypes.objectOf(PropTypes.string).isRequired,
    disableQty: PropTypes.bool.isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.objectOf(PropTypes.string).isRequired,
    parents: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])).isRequired,
    type: PropTypes.string.isRequired,
  }).isRequired,
  categoryId: PropTypes.string.isRequired,
}
