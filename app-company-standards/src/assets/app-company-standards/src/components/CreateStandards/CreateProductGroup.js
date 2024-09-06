import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { Panel } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'

import AltPanelHeader from './AltPanelHeader'
import CreateProductGroupForm from './CreateProductGroupForm'
import NameDisplayContainer from '../../containers/NameDisplayContainer'
import { UniversalMessageContext } from "../UniversalMessages"

export default function CreateProductGroup({ isManagerView, navigateOnSubmit, onSubmit, parentId }) {
  const categoryId = parentId
  const { setActiveMessage } = useContext(UniversalMessageContext)

  function handleSubmit(formData) {
    onSubmit(formData, setActiveMessage).then(pg => navigateOnSubmit({ categoryId, productGroupId: pg.id }))
  }

  return (
    <div className="c-container">
      <Panel className="o-box o-grid u-margin-bot">
        <AltPanelHeader title={t('Create a product group')}>
          <NameDisplayContainer categoryId={categoryId} />
        </AltPanelHeader>
        <div className="o-grid__item u-padding-side-small">
          <CreateProductGroupForm
            categoryId={categoryId}
            isManagerView={isManagerView}
            onSubmit={handleSubmit}
          />
        </div>
      </Panel>
    </div>
  )
}

CreateProductGroup.propTypes = {
  isManagerView: PropTypes.bool.isRequired,
  navigateOnSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  parentId: PropTypes.string.isRequired,
}
