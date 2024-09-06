import React from 'react'
import { useSelector } from "react-redux"
import PropTypes from "prop-types";
import { Image } from '@insight/toolkit-react';

import Quantity from './Quantity'
import RedirectLink from '../Navigation/RedirectLink'
import { selector_language, selector_isPurchasingPopupEnabled } from "../../duck"
import parse from './parse'
import { l } from "@insight/toolkit-utils";
import { TagPinContainer } from './index'

export default function Tile(props) {
  const { categoryId, nestLevel, productGroupId, showQty, tile } = props
  const { language, showAddToCartPopup } = useSelector(state => ({
    language: selector_language(state),
    showAddToCartPopup: selector_isPurchasingPopupEnabled(state)
  }));


  return (
    <div className="c-cs-client__tile o-grid__item o-grid--center u-1/1 u-1/2@tablet u-1/4@desktop u-padding">
      <div className="o-grid o-grid--justify-center u-margin-bot-small">
        <div className="o-grid c-cs-tile__image-container">
          <TagPinContainer showPin={tile.id} pinOptions={{ pinClassName: "c-cs-pin__tile", id: tile.id }} />
          <Image className='o-grid__item o-grid__item--shrink c-cs-tile__product-image-container' imageClassName='c-cs-tile__product-image' image={tile.imageUrl} alt={tile.name[language]} />
        </div>
      </div>
      <div>
        <RedirectLink className="o-grid o-grid--justify-center u-1/1 u-text-bold u-margin-bot" categoryId={categoryId} nestLevel={nestLevel} productGroupId={productGroupId}>
          <span className="u-font-size u-text-center">{tile.name[language] || tile.name['en']}</span>
        </RedirectLink>
        {showQty &&
          <div className="o-grid o-grid__item o-grid__item--shrink o-grid--bottom o-grid--justify-center u-margin-bot">
            <Quantity productGroupId={productGroupId} showAddToCartPopup={showAddToCartPopup}/>
          </div>
        }
        <div className="o-grid o-grid--justify-center u-margin-bot">
          <TagPinContainer showTags={tile.tags} tagOptions={{ justification: 'centered', layout: 'vertical', tagOrder: tile.tags}} />
        </div>
      </div>
      <div className="o-grid o-grid--justify-center c-cs-tile__category-description u-text-center u-font-size-small">
        <div className="o-grid__item u-1/1">
          {parse(tile.description[language] || tile.description['en'])}
        </div>
      </div>
    </div>
  )
}

Tile.propTypes = {
  categoryId: PropTypes.string.isRequired,
  nestLevel: PropTypes.number.isRequired,
  productGroupId: PropTypes.string,
  showQty: PropTypes.bool.isRequired,
  tile: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.objectOf(PropTypes.string).isRequired,
  }).isRequired
}

Tile.defaultProps = {
  productGroupId: ''
}
