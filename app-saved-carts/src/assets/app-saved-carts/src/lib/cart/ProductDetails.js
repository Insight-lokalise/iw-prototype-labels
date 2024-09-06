import React from 'react'
import PropTypes from 'prop-types'
import { Tag, Product } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'

import LineLevel from './LineLevel'
import DEPItem from './DEPItem'

export default function ProductDetails({
  discontinued,
  approved,
  description,
  displayApproved,
  displayLineLevel,
  displayProration,
  imageURL,
  insightPart,
  mfrPart,
  link,
  lineLevelInfo,
  proratable,
  standardsProduct,
  enrollChildId,
  showDEPInfo,
  bundleId,
}) {

  return (
    <div className='o-grid__item  u-1/1  u-3/5@tablet  c-cart__cell  c-cart__cell--item'>
      <Product className="o-grid">
        <div className="o-grid__item u-1/5 u-margin-left">
          <Product.Image
            alt={description}
            image={imageURL}
          />
        </div>
        <div className="o-grid__item 4/5">
          <div>
            <Product.Info.Name>
            {link && <a href={link}>{description}</a>}
            </Product.Info.Name>
          </div>
          <Product.Info.PartNumbers
            className="u-font-size-tiny"
            insightPart={insightPart}
            mfrPart={mfrPart}
          />
        </div>

        { displayApproved && approved && <Tag icon="checkmark-circled" text={t('Approved item')} color='turquoise' labelClass='u-text-bold' iconClass='c-icon--small' /> }
        { standardsProduct && <Tag icon="pricetag" text={t('Company Standards')} color='purple' labelClass='u-text-bold' iconClass='c-icon--small' /> }
        { displayProration && proratable && (
          <p className="c-prorated-product">{t('The price displayed will be prorated in the cart based on the remaining agreement period.')}</p>
        )}
        { enrollChildId > 0 && (
          <div className="o-grid__item u-5/5 u-margin-left">
            <DEPItem
              enrollChildId={enrollChildId}
              showDEPInfo={showDEPInfo}
              bundleId={bundleId}
            />
          </div>
        )}
        { displayLineLevel && lineLevelInfo && Object.keys(lineLevelInfo).length > 0 && (
          <div className="o-grid__item u-5/5 u-margin-left">
            <LineLevel
              lineLevelInfo={lineLevelInfo}
            />
          </div>
        )}
      </Product>
    </div>
  )
}

ProductDetails.propTypes = {
  discontinued: PropTypes.bool,
  approved: PropTypes.bool,
  description: PropTypes.string.isRequired,
  displayApproved: PropTypes.bool,
  displayLineLevel: PropTypes.bool,
  displayProration: PropTypes.bool,
  imageURL: PropTypes.string,
  insightPart: PropTypes.string,
  link: PropTypes.string,
  lineLevelInfo: PropTypes.objectOf(PropTypes.array),
  mfrPart: PropTypes.string,
  proratable: PropTypes.bool,
  standardsProduct: PropTypes.bool,
  enrollChildId: PropTypes.number.isRequired,
  showDEPInfo: PropTypes.func.isRequired,
  bundleId: PropTypes.number,
}

ProductDetails.defaultProps = {
  discontinued: false,
  approved: false,
  displayApproved: true,
  displayLineLevel: true,
  displayProration: true,
  imageURL: undefined,
  insightPart: '',
  link: undefined,
  lineLevelInfo: undefined,
  mfrPart: '',
  proratable: false,
  standardsProduct: false,
  bundleId: 0,
}
