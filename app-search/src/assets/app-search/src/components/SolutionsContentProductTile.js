import React from 'react'
import cn from 'classnames'
import { t } from '@insight/toolkit-utils/lib/labels'
import { Image, Button, TextEllipsis } from '@insight/toolkit-react'
import { ILISTVIEW } from '../constants'

const SolutionsContentProductTile = ({ doc, view }) => {
  const { imageUrl, pagePath, title, description, displayDate } = doc

  const onClickItem = () => {
    const searchedArticles = {
      ctaLinkText: t('Learn More'), // View CTA button text
      ctaHeading: title, // Heading of the content
    }
    window.fireTagEvent('searchedArticles', searchedArticles)

    window._satellite &&
      _satellite.track &&
      _satellite.track('searchedArticles')

    window.location.href = pagePath
  }

  const classes = cn('o-grid', {
    'c-solutions-product-tile': view !== ILISTVIEW.grid,
    'c-solutions-product-tile-grid': view === ILISTVIEW.grid,
  })

  return (
    <div className={classes}>
      <div className="o-grid__item u-1/1 u-2/5@desktop u-2/5@tablet">
        <Image
          className="c-solutions-product-image"
          image={imageUrl}
          alt="Product Image"
        />
      </div>
      <div className="o-grid__item u-1/1 u-3/5@desktop u-3/5@tablet c-solutions-product-tile-data">
        <div className="c-solutions-product-title u-text-bold"> {title}</div>
        <TextEllipsis length={200} className="c-solutions-product-description">
          {description}
        </TextEllipsis>
        <div className="o-grid c-solutions-cta-part">
          <div className="o-grid__item u-1/3@desktop u-1/3@tablet c-empty-div" />
          <div className="o-grid__item u-2/3@desktop u-2/3@tablet o-grid  o-grid--center">
            <div className="c-solutions-product-date u-text-bold o-grid__item u-1/1 u-1/2@tablet u-1/2@desktop">
              {' '}
              {t('Solution')} / {displayDate}
            </div>
            <Button
              className="c-button--block o-grid__item c-solutions-product-button u-1/1 u-1/2@tablet u-1/2@desktop"
              color={'primary'}
              size="small"
              onClick={() => onClickItem()}
            >
              {t('Learn more')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SolutionsContentProductTile
