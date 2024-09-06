import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import EditLink from "../Navigation/EditLink";

export default function NameDisplay({ categoryId, categoryName, productGroupId, productGroupName, productSetId, productSetName }) {
  return (
    <div>
      <span className="c-current-selection-name-display u-text-bold u-margin-bot-none">
        <EditLink id={categoryId} nestLevel={0}>{categoryName}</EditLink>
        {productGroupName && (
          <Fragment>
            <span className='c-standards-current-selection-name-display__separator'> / </span>
            <EditLink id={productGroupId} categoryId={categoryId} nestLevel={1}>{productGroupName}</EditLink>
          </Fragment>
        )}
        {productSetName && (
          <Fragment>
            <span> / </span>
            <EditLink id={productSetId} categoryId={categoryId} nestLevel={2}>{productSetName}</EditLink>
          </Fragment>
        )}
      </span>
    </div>
  )
}

NameDisplay.propTypes = {
  categoryName: PropTypes.string.isRequired,
  productGroupName: PropTypes.string,
  productSetName: PropTypes.string,
}

NameDisplay.defaultProps = {
  productGroupName: '',
  productSetName: '',
}
