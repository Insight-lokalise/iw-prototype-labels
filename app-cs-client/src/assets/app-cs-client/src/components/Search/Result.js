import React from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils'

import RedirectLink from '../Navigation/RedirectLink'
import { TagPinContainer } from "../Shared";

export default function Result({ categoryId, item, productGroupId, path, resultId, resultName, tags }) {
  const type = (item && 'Product') || (productGroupId && 'Product options') || (categoryId && 'Subcategory') || 'Category'
  let nestLevel;
  let categoryIdToUse;
  let productGroupIdToUse;
  switch (type) {
    case 'Product':
    case 'Product options': {
      categoryIdToUse = categoryId
      productGroupIdToUse = productGroupId
      nestLevel = 2
      break;
    }
    case 'Subcategory': {
      categoryIdToUse = categoryId
      productGroupIdToUse = resultId
      nestLevel = 2
      break;
    }
    case 'Category': {
      categoryIdToUse = resultId
      nestLevel = 1
      break;
    }
    default:
      nestLevel = 0
  }
  const location = path.length > 0 ? `${t(type)} ${t('in')} ${path.join(' / ')}` : type

  return (
    <div className="o-grid__item u-1/1 u-border-top">
      <div className="o-grid u-margin-top-tiny">
        <div className="o-grid__item u-2/3 u-margin-bot-tiny">
          <div className="o-grid o-grid--bottom">
            <div className="o-grid__item u-1/1 o-grid__item--shrink">
              <RedirectLink categoryId={categoryIdToUse} productGroupId={productGroupIdToUse} nestLevel={nestLevel}>
                <span className="u-font-size-small u-text-bold">{resultName}</span>
              </RedirectLink>
            </div>
            <div className="o-grid__item u-1/1 o-grid__item--shrink">
              <span className="c-cs-result__path">{location}</span>
            </div>
          </div>
        </div>
        <div className="o-grid__item u-1/3 u-padding-left-small">
          <TagPinContainer showTags={tags} tagOptions={{ justification: 'left', layout: 'vertical', padding: false, tagOrder: tags }} />
        </div>
      </div>
    </div>
  )
}

Result.propTypes = {
  categoryId: PropTypes.string,
  item: PropTypes.string,
  path: PropTypes.arrayOf(PropTypes.string),
  productGroupId: PropTypes.string,
  resultId: PropTypes.string.isRequired,
  resultName: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string),
}

Result.defaultProps = {
  categoryId: undefined,
  item: '',
  path: [],
  productGroupId: undefined,
  tags: [],
}
