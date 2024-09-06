import React from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils'

import { TagList } from '../Shared'
import EditLink from '../Navigation/EditLink'

export default function Result({ categoryId, item, productGroupId, path, resultId, resultName, tags }) {
  const type = (item && 'Product') || (productGroupId && 'Product set') || (categoryId && 'Product group') || 'Category'
  const nestLevel = (item && 3) || (productGroupId && 2) || (categoryId && 1) || 0
  const location = path.length > 0 ? `${t(type)} ${t('in')} ${path.join(' / ')}` : type

  return (
    <div className="o-grid__item u-1/1 u-border-top">
      <div className="o-grid u-margin-top-tiny">
        <div className="o-grid__item u-2/3 u-margin-bot-tiny">
          <div className="o-grid o-grid--bottom">
            <div className="o-grid__item u-1/1 o-grid__item--shrink">
              <EditLink id={resultId} categoryId={categoryId} nestLevel={nestLevel} search={true}>
                <span className="u-font-size-small u-text-bold">{resultName}</span>
              </EditLink>
            </div>
            <div className="o-grid__item u-1/1 o-grid__item--shrink">
              <span className="c-cs-result__path">{location}</span>
            </div>
          </div>
        </div>
        <div className="o-grid__item u-1/3 u-padding-left-small">
          {tags.length > 0 && (
            <span>
              <TagList tagOrder={tags} padding={false} />
            </span>
          )}
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
  item: false,
  path: [],
  productGroupId: undefined,
  tags: [],
}
