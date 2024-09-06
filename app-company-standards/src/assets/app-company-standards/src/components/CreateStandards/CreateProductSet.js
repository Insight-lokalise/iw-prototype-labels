import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { Panel } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'

import AltPanelHeader from './AltPanelHeader'
import CreateProductSetForm from './CreateProductSetForm'
import NameDisplayContainer from '../../containers/NameDisplayContainer'
import { UniversalMessageContext } from "../UniversalMessages"

export default function CreateProductSet(props) {
  const { isManagerView, navigateOnSubmit, onSubmit, productGroup, categoryId } = props
  const { setActiveMessage } = useContext(UniversalMessageContext)
  const productGroupId = productGroup.id

  function handleSubmit(formData) {
    onSubmit(formData, setActiveMessage).then(ps => navigateOnSubmit({ categoryId, productGroupId, productSetId: ps.id }))
  }

  return (
    <div className="c-container">
      <Panel className="o-box o-grid u-margin-bot">
        <AltPanelHeader title={t('Create a product set')}>
          <NameDisplayContainer
            categoryId={categoryId}
            productGroupId={productGroupId}
          />
        </AltPanelHeader>
        <div className="o-grid__item u-padding-side-small">
          <CreateProductSetForm
            categoryId={categoryId}
            isManagerView={isManagerView}
            productGroupId={productGroupId}
            onSubmit={handleSubmit}
          />
        </div>
      </Panel>
    </div>
  )
}

CreateProductSet.propTypes = {
  isManagerView: PropTypes.bool.isRequired,
  navigateOnSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  productGroup: PropTypes.shape({
    id: PropTypes.string.isRequired,
    parents: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])).isRequired,
  }).isRequired,
  categoryId: PropTypes.string.isRequired,
}
