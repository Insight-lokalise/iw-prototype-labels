import React, { useState, useLayoutEffect } from 'react'
import PropTypes from 'prop-types'
import { Icon } from '@insight/toolkit-react'
import { t } from "@insight/toolkit-utils";
import { useSelector, useDispatch } from "react-redux"

import ROUTES from "../Shared/constants";
import CatalogList from './CatalogList'
import InvisibleSpacer from './InvisibleSpacer'
import Link from '../Navigation/Link'
import { getProductSetsByProductGroup, selector_productSets } from '../../duck';
import Spinner from './Spinner';

export default function ProductSetList(props) {
  const {
    children,
    dndFunctions,
    dndState,
    preselection,
    category,
    productGroup: {id: parentId, order: itemOrder, master} = {},
  } = props

  const [hasData, setHasData] = useState(false)
  const itemDictionary = useSelector(selector_productSets)
  const dispatch = useDispatch()

  useLayoutEffect(() => {
    dispatch(getProductSetsByProductGroup(parentId)).then( () => {
      setHasData(true)
    })
  }, [parentId])
  
  return (
    <>
    { !hasData ? <Spinner/> : (
      <div className="o-grid__item u-1/1">
        <div className="o-grid">
          <div className="o-grid__item o-grid__item--shrink">
            <div className="o-grid">
              <InvisibleSpacer isSmall />
              <InvisibleSpacer hasRightBorder />
            </div>
          </div>
          <div className="o-grid__item u-border-right u-border-bot">
            <div className="o-grid">
              <InvisibleSpacer />
              <div className="o-grid__item o-grid__item--center">
                {Object.keys(itemDictionary).length === 0 &&
                  t(
                    "There are no product sets associated to this product group."
                  )}
                <div>
                  <Link
                    to={{ pathname: ROUTES.CREATE_PRODUCT_SET(parentId) }}
                    color="link"
                    disabled={!master}
                  >
                    <span className="u-margin-right-tiny u-text-bold">
                      Add new product set
                    </span>
                    <Icon icon="add" />
                  </Link>
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
                nestLevel={2}
                preselection={preselection}
                categoryId={category?.id}
              >
                {children}
              </CatalogList>
            )}
          </div>
        </div>
      </div>
    )}
    </>
  )
}

ProductSetList.propTypes = {
  children: PropTypes.element,
  dndFunctions: PropTypes.shape({}).isRequired,
  dndState: PropTypes.shape({}).isRequired,
  preselection: PropTypes.string,
}

ProductSetList.defaultProps = {
  children: null,
}
