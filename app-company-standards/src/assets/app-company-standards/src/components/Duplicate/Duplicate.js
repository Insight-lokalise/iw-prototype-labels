import React from 'react'
import PropTypes from 'prop-types'
import { Panel } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'

import { ENTITY_TYPES } from '../Routes'
import DuplicateProductGroupContainer from '../../containers/DuplicateProductGroupContainer'
import DuplicateProductSet from './DuplicateProductSet'
import EntityProvider from '../../containers/EntityProvider'
import NameDisplayContainer from '../../containers/NameDisplayContainer'
import DuplicateCategoryContainer from '../../containers/DuplicateCategoryContainer'


export default function Duplicate(props) {
  const { duplicate, entity, isManagerView, navigateOnSubmit, viewType, categoryId: catId = null } = props
  const categoryId = entity.parents.length == 1 ? entity.id : catId
  const productGroupId = entity.parents.length == 2 ? entity.id : (entity.parents[2] || undefined)
  const productSetId = entity.parents.length == 3 ? entity.id : undefined
  return (
    <div className="o-box c-container">
      <Panel>
        <Panel.Body>
          <h2 className="o-grid__item u-1/1">{t('Duplicate')}</h2>
          <div className="o-grid__item u-1/1 u-margin-bot">
            <NameDisplayContainer
              categoryId={categoryId}
              productGroupId={productGroupId}
              productSetId={productSetId}
            />
          </div>
          <div className="o-grid__item u-1/1 u-border-top u-padding-top-small">
            {viewType === ENTITY_TYPES.CATEGORY && (
              <DuplicateCategoryContainer
                category={entity}
                duplicate={duplicate}
                navigateOnSubmit={navigateOnSubmit}
              />
            )}
            {viewType === ENTITY_TYPES.PRODUCT_GROUP && (
              <EntityProvider entityId={catId} entityType={ENTITY_TYPES.CATEGORY}>
                {({ entity: category }) => (
                  <DuplicateProductGroupContainer
                    category={category}
                    duplicate={duplicate}
                    navigateOnSubmit={navigateOnSubmit}
                    productGroup={entity}
                  />
                )}
              </EntityProvider>
            )}
            {viewType === ENTITY_TYPES.PRODUCT_SET && (
              <DuplicateProductSet
                duplicate={duplicate}
                isManagerView={isManagerView}
                navigateOnSubmit={navigateOnSubmit}
                productSet={entity}
                categoryId={categoryId}
              />
            )}
          </div>
        </Panel.Body>
      </Panel>
    </div>
  )
}

Duplicate.propTypes = {
  duplicate: PropTypes.func.isRequired,
  entity: PropTypes.shape({
    name: PropTypes.objectOf(PropTypes.string).isRequired,
    parents: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])).isRequired,
  }).isRequired,
  isManagerView: PropTypes.bool.isRequired,
  navigateOnSubmit: PropTypes.func.isRequired,
  viewType: PropTypes.string.isRequired,
  categoryId: PropTypes.string,
}
