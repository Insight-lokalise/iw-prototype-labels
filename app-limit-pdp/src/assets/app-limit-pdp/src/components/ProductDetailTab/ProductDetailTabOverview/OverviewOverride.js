/* eslint-disable react/no-danger */
import React, { useContext } from 'react'
import DOMPurify from 'dompurify'
import { PDPContext } from '../../../context'

export const OverviewOverride = () => {
  const { overview } = useContext(PDPContext)

  const renderOverview = () => {
    // Generate a sanitized overview
    const sanitizedData = () => ({
      __html: DOMPurify.sanitize(overview),
    })
    return <div dangerouslySetInnerHTML={sanitizedData()} />
  }

  return (
    <div className="c-product-tabs__overview__product">{renderOverview()}</div>
  )
}

export default OverviewOverride
