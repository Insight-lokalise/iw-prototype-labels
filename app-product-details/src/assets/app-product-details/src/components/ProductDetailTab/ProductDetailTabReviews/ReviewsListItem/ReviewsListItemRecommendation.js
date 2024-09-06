import React, { Fragment } from 'react'
import { Icon } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'
import PropTypes from 'prop-types'

export const ReviewsListItemRecommendation = ({ isRecommended }) => {
  const renderRecommendation = () => {
    if (!isRecommended) {
      return (
        <Fragment>
          <Icon
            className="c-icon__sizing"
            icon="close-circled"
            type="error"
            size="small"
          />
          <span>
            <span className="u-text-bold">{`${t('No')},`}</span>{' '}
            {t(`I don't recommend this product.`)}
          </span>
        </Fragment>
      )
    }
    return (
      <Fragment>
        <Icon
          className="c-icon__sizing"
          icon="checkmark-circled"
          type="success"
          size="small"
        />
        <span>
          <span className="u-text-bold">{`${t('Yes')},`}</span>{' '}
          {t('I recommend this product.')}
        </span>
      </Fragment>
    )
  }
  return (
    <div className="c-reviews__list__item__footer__recommendation">
      {renderRecommendation()}
    </div>
  )
}

ReviewsListItemRecommendation.propTypes = {
  isRecommended: PropTypes.bool.isRequired,
}

export default ReviewsListItemRecommendation
