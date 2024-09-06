import React, { Fragment, useEffect, useState } from 'react'
import { useSelector } from "react-redux";
import cn from 'classnames'
import { t } from '@insight/toolkit-utils'
import { Button, Icon } from "@insight/toolkit-react";
import ProductGroupLeftNav from './ProductGroupLeftNav'
import ProductGroupDetailView from './ProductGroupDetailView'
import RedirectToTarget from "./Navigation/RedirectToTarget";
import { selector_category, selector_productGroup } from "../duck";

const ProductGroupView = props => {

  const { category, productGroup } = useSelector(state => ({
    category: selector_category(state, props.match.params.catId),
    productGroup: selector_productGroup(state, props.match.params.productGrpId)
  }));

  const [isExpanded, setIsExpanded] = useState(true)

  const toggleView = () => {
    setIsExpanded(!isExpanded)
  }

  const backToCategory = () => {
    const redirectParams = {
      categoryId: props.match.params.catId,
      productGroupId: props.match.params.productGrpId,
      targetLevel: 1
    }
    const target = RedirectToTarget(redirectParams)
    props.history.push(target)
  }

  return (
    <Fragment>
      <div className="o-grid u-1/1">
        <div className="o-grid__item u-1/2 u-1/1@tablet">
          <Button
            className="c-cs-back--button u-font-size-small"
            color="link"
            onClick={() => backToCategory()}
          >
            <Icon icon="arrow-dropdown" className="c-cs-back--icon" /> {t('Back')}
          </Button>
        </div>
      </div>
      <div className="o-grid u-1/1">
        {isExpanded ? (
          <div className="o-grid__item u-1/4 u-show@desktop">
            <ProductGroupLeftNav
              categoryId={category.id}
              productGrpId={props.match.params.productGrpId}
              toggleView={toggleView}
            />
          </div>
        ) : (
            <div className="o-grid__item u-show@desktop u-font-size-small c-cs-client__expandcatalog u-text-center" onClick={() => toggleView()}>
              <Icon icon='add' />{t('Expand catalog')}
            </div>
          )
        }
        <div className={cn('o-grid__item ', { 'u-1/1': !isExpanded, 'u-3/4@desktop': isExpanded })}>
          <ProductGroupDetailView category={category} productGroup={productGroup} />
        </div>
      </div>
    </Fragment>
  )
}

export default ProductGroupView;
