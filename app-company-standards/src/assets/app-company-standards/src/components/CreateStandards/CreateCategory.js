import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { Panel } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'

import CreateCategoryForm from './CreateCategoryForm'
import AltPanelHeader from './AltPanelHeader'
import { UniversalMessageContext } from "../UniversalMessages";

export default function CreateCategory({ isManagerView, navigateOnSubmit, onSubmit }) {
  const { setActiveMessage } = useContext(UniversalMessageContext)

  function handleSubmit(formData) {
    onSubmit(formData, setActiveMessage).then(cat => navigateOnSubmit({ categoryId: cat.id }))
  }

  return (
    <div className="c-container">
      <Panel className="o-box o-grid u-margin-bot">
        <AltPanelHeader title={t('Create a category')} />
        <div className="o-grid__item u-padding-side-small">
          <CreateCategoryForm
            isManagerView={isManagerView}
            onSubmit={handleSubmit}
          />
        </div>
      </Panel>
    </div>
  )
}

CreateCategory.propTypes = {
  isManagerView: PropTypes.bool.isRequired,
  navigateOnSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
}
