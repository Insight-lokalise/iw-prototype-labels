import React, { useLayoutEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Icon } from '@insight/toolkit-react'
import { t } from "@insight/toolkit-utils"
import { useSelector, useDispatch } from "react-redux"

import ROUTES from "../Shared/constants";
import CatalogList from './CatalogList'
import InvisibleSpacer from './InvisibleSpacer'
import Link from '../Navigation/Link'
import { getProductGroupsByCategory, selector_productGroups } from '../../duck'
import Spinner from './Spinner'

export default function ProductGroupList(props) {
  const { children, dndFunctions, dndState, preselection, category: {id: parentId, order: itemOrder} = {} } = props

  const [hasData, setHasData] = useState(false)
  const itemDictionary = useSelector(selector_productGroups)
  const dispatch = useDispatch()

  useLayoutEffect(() => {
    dispatch(getProductGroupsByCategory(parentId)).then(data => {
      setHasData(true)
    })
  }, [parentId])

  return (
    <>  
    { !hasData ? <Spinner /> : (
      <div className="o-grid__item u-1/1">
        <div className="o-grid">
          <div className="o-grid__item u-1/1">
            <div className="o-grid">
              <div className="o-grid__item o-grid__item--shrink">
                <div className="o-grid">
                  <div className="o-grid_item">
                    <InvisibleSpacer hasRightBorder />
                  </div>
                </div>
              </div>
              <div className="o-grid__item u-border-right u-border-bot">
                <div className="o-grid o-grid--center ">
                  <InvisibleSpacer />
                  <div>
                    {Object.keys(itemDictionary).length === 0 &&
                      t(
                        "There are no product groups associated to this category."
                      )}
                    <div>
                      <Link
                        to={{ pathname: ROUTES.CREATE_PRODUCT_GROUP(parentId) }}
                        color="link"
                      >
                        <span className="u-margin-right-tiny u-text-bold">
                          {t("Add new product group")}
                        </span>
                        <Icon icon="add" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="o-grid__item u-1/1">
            {Object.keys(itemDictionary).length > 0 && (
              <CatalogList
                currentItemOrder={dndState[`${parentId}`]}
                dndFunctions={dndFunctions}
                droppableId={`${parentId}`}
                initialItemOrder={itemOrder}
                itemDictionary={itemDictionary}
                nestLevel={1}
                preselection={preselection}
                categoryId={parentId}
              >
                {children}
              </CatalogList>
            )}
          </div>
        </div>
      </div>
    )}
    </>
  );
}

ProductGroupList.propTypes = {
  children: PropTypes.element.isRequired,
  dndFunctions: PropTypes.shape({}).isRequired,
  dndState: PropTypes.shape({}).isRequired,
  preselection: PropTypes.string,
}
