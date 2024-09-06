import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Panel } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'

import { fetchSharedWith, share, unshare } from '../../api'
import { ENTITY_TYPES } from '../Routes'
import CatalogLink from '../Navigation/CatalogLink'
import NameDisplayContainer from '../../containers/NameDisplayContainer'
import SharedWith from './SharedWith'
import ShareTo from './ShareTo'
import { isProductGroup } from '../../api/us/helpers'

export default function Share(props) {
  const [currentlySharedWebGroups, setCurrentlySharedWebGroups] = useState([])
  const [foundAndUnsharedWebGroups, setFoundAndUnsharedWebGroups] = useState([])
  const hasCategories = props.viewType === ENTITY_TYPES.PRODUCT_GROUP

  useEffect(() => {
    fetchSharedWith(props.entity).then(nextCurrentlySharedWebGroups => {
      setCurrentlySharedWebGroups(nextCurrentlySharedWebGroups)
    })
  }, [props.entity.id])

  function addFoundAndUnsharedWebGroup(webGroup) {
    setFoundAndUnsharedWebGroups([webGroup, ...foundAndUnsharedWebGroups])
  }

  function handleShare(webGroup) {
    return () => {
      share({ sharedToEntity: webGroup, sharedEntity: props.entity }).then(nextCurrentlySharedWebGroups => {
        setCurrentlySharedWebGroups(nextCurrentlySharedWebGroups)

        const nextFoundAndUnsharedWebGroups = [...foundAndUnsharedWebGroups]
        const newlySharedMatchIndex = nextFoundAndUnsharedWebGroups.findIndex(wg => wg.id === webGroup.id)
        nextFoundAndUnsharedWebGroups.splice(newlySharedMatchIndex, 1)
        setFoundAndUnsharedWebGroups(nextFoundAndUnsharedWebGroups)
      })
    }
  }

  function handleUnshare(webGroup) {
    return () => {
      unshare({ unsharedToEntity: webGroup, unsharedEntity: props.entity }).then(nextCurrentlySharedWebGroups => {
        setCurrentlySharedWebGroups(nextCurrentlySharedWebGroups)
        addFoundAndUnsharedWebGroup(webGroup)
      })
    }
  }
  const entityType = isProductGroup(props.entity) ? 'product group' : 'category'

  return (
    <div className="o-box o-grid c-container">
      <Panel>
        <Panel.Body>
          <h2 className="o-grid__item u-1/1">{t('Share')}</h2>
          <div className="o-grid__item u-1/1 u-border-top u-padding-top-small">
            <div className="o-grid">
              <p className="o-grid__item u-1/1 u-margin-bot u-font-size-tiny">
                {
                  t(`Sharing will create copies of this ${entityType} in other web groups and establishes a link between them. Any updates to the master ${entityType} will automatically update the shared copies.`)
                }
              </p>
              <div className="o-grid__item u-1/1 u-margin-bot">
                <NameDisplayContainer
                  categoryId={props.entity.parents[1] || props.entity.id}
                  productGroupId={props.entity.id || ''}
                />
              </div>
              <div className="o-grid__item u-1/1 u-margin-bot">
                <ShareTo
                  addFoundAndUnsharedWebGroup={addFoundAndUnsharedWebGroup}
                  currentSalesArea={props.currentSalesArea}
                  currentWebGroupId={props.currentWebGroupId}
                  foundAndUnsharedWebGroups={foundAndUnsharedWebGroups}
                  handleShare={handleShare}
                  hasCategories={hasCategories}
                />
              </div>
              <div className="o-grid__item u-1/1 u-margin-bot">
                <SharedWith
                  currentlySharedWebGroups={currentlySharedWebGroups}
                  entityType={entityType}
                  handleUnshare={handleUnshare}
                  hasCategories={hasCategories}
                  isProductGroup={entityType === 'product group'}
                />
              </div>
            </div>
            <div className="o-grid__item u-1/1 u-padding-top u-text-right">
              <CatalogLink
                categoryId={props.entity.parents[1] || props.entity.id}
                className='u-text-bold'
                productGroupId={props.entity.id || ''}
              >
                {t('Return to catalog')}
              </CatalogLink>
            </div>
          </div>
        </Panel.Body>
      </Panel>
    </div>
  )
}

Share.propTypes = {
  currentSalesArea: PropTypes.number.isRequired,
  currentWebGroupId: PropTypes.number.isRequired,
  entity: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    name: PropTypes.objectOf(PropTypes.string).isRequired,
    parents: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])).isRequired,
  }).isRequired,
  viewType: PropTypes.string.isRequired,
}
