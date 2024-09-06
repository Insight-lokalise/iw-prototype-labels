import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { Panel } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'

import AltPanelHeader from './AltPanelHeader'
import CreateCategoryForm from './CreateCategoryForm'
import { UniversalMessageContext } from "../UniversalMessages"

export default function EditCategory({ category, isManagerView, navigateOnSubmit, onSubmit }) {
  const { setActiveMessage } = useContext(UniversalMessageContext)

  function handleSubmit(formData) {
    onSubmit(formData, setActiveMessage).then(navigateOnSubmit)
  }
  const disabled = category.block && isManagerView

  return (
    <div className="c-container">
      <Panel className="o-box o-grid u-margin-bot">
        <AltPanelHeader title={t(`${disabled ? 'View' : 'Edit'} category`)} />
        <div className="o-grid__item u-1/1 u-padding-side-small">
          <CreateCategoryForm category={category} isManagerView={isManagerView} isEdit onSubmit={handleSubmit} />
        </div>
      </Panel>
    </div>
  )
}

EditCategory.propTypes = {
  category: PropTypes.shape({
    block: PropTypes.bool.isRequired,
    description: PropTypes.objectOf(PropTypes.string).isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.objectOf(PropTypes.string).isRequired,
    parents: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])).isRequired,
  }).isRequired,
  navigateOnSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
}
