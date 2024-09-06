import React, { useContext } from 'react'
import { PDPContext } from '../context'
import { getWebPrice } from '@insight/toolkit-utils'

export const ProductSEO = ({ reviews }) => {
  const { product, specifications, isLoggedIn, showVAT } = useContext(PDPContext)
  const materialId = product?.materialId
  const availabilityLabel =
    product?.availability?.availabilityMessage === 'inStock' ||
    product?.availability?.unlimited
      ? 'InStock'
      : 'OutOfStock'
  const itemConditionMap = {
    open: 'UsedCondition',
    rf: 'RefurbishedCondition',
    ref: 'RefurbishedCondition',
  }
  const itemIdSuffix = (/-(ref|rf|open)$/i.exec(materialId) || [
    '',
    '',
  ])[1].toLowerCase()
  const itemCondition = itemConditionMap[itemIdSuffix] || 'NewCondition'
  const schemaOrgSite = 'https://schema.org'

  const seoEncode = function (obj) {
    if (typeof obj === 'string') {
      obj = obj.replace(/"/gm, '%22').replace(/\s/gm, ' ')
    }
    return obj
  }

  const specValue = function (specName, label) {
    return specifications
      ?.filter((s) => s.label === specName)[0]
      ?.details.filter((d) => d.label === label)[0]?.value
  }

  const specName1 = 'Miscellaneous'
  const specName2 = 'Dimensions & Weight'
  const color = specValue(specName1, 'Color')
  const width = specValue(specName2, 'Width')
  const depth = specValue(specName2, 'Depth')
  const height = specValue(specName2, 'Height')
  const weight = specValue(specName2, 'Weight')

  return (
    <div className="seo-tags">
      <meta
        itemProp="name"
        content={seoEncode(product?.descriptions?.shortDescription)}
      />
      <meta
        itemProp="description"
        content={seoEncode(product?.descriptions?.longDescription)}
      />
      <meta itemProp="sku" content={materialId} />
      <meta itemProp="mpn" content={product?.manufacturer?.partNumber} />
      <meta itemProp="category" content={product?.category?.label} />
      <meta itemProp="brand" content={product?.manufacturer?.name} />
      <meta itemProp="manufacturer" content={product?.manufacturer?.name} />
      <meta itemProp="model" content={product?.modelName} />
      {product?.price && (
        <span itemProp="offers" itemScope itemType={`${schemaOrgSite}/Offer`}>
          <meta
            itemProp="price"
            content={product?.price?.webPrice}
          />
          <meta itemProp="priceCurrency" content={product?.price?.currency} />
          <link
            itemProp="availability"
            href={`${schemaOrgSite}/${availabilityLabel}`}
          />
          <link
            itemProp="itemCondition"
            href={`${schemaOrgSite}/${itemCondition}`}
          />
        </span>
      )}
      {reviews?.totalReviews && (
        <div
          itemProp="aggregateRating"
          itemScope
          itemType={`${schemaOrgSite}/AggregateRating`}
        >
          <span itemProp="ratingValue">{reviews?.averageRating}</span>
          <span itemProp="reviewCount">{reviews?.totalReviews}</span>
        </div>
      )}
      {color && <meta itemProp="color" content={color} />}
      {width && <meta itemProp="width" content={width} />}
      {depth && <meta itemProp="depth" content={depth} />}
      {height && <meta itemProp="height" content={height} />}
      {weight && <meta itemProp="weight" content={weight} />}
    </div>
  )
}
