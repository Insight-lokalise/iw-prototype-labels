import React, { Fragment } from 'react'

export const ListItemDetail = ({ detailData }) => {
  if (!detailData?.length) return null
  const renderDetails = () => {
    // Limit specifications to the first 4 bullets
    const specifications = detailData.slice(0, 4)

    return specifications.map((specification, index) => {
      if (!specification) return null
      let specificationObj = { key: null, value: specification }
      // Check if specification contains a key value pair
      if (specification.includes(':')) {
        const keyValue = specification.split(/:/g)
        // Assign specification key value nodes
        specificationObj = { key: keyValue[0], value: keyValue[1] }
      }
      return (
        <div key={index} className="c-item-details__row">
          {!specificationObj.key ? (
            <span className="c-item-details__row__value left-align">
              {specificationObj.value}
            </span>
          ) : (
            <Fragment>
              <span className="c-item-details__row__key">
                {specificationObj.key}:
              </span>
              <span className="c-item-details__row__value">
                {specificationObj.value}
              </span>
            </Fragment>
          )}
        </div>
      )
    })
  }
  return (
    <div className="c-item-details">
      {renderDetails()}
    </div>
  )
}
