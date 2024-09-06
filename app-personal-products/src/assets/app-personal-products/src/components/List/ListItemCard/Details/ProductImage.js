import React from 'react'
import PropTypes from 'prop-types'


const ProductImage = ({
	description,
	imageURL
}) => {
	return (
		<div className="o-grid__item o-grid__item--shrink">
			<img className="c-item-card__details-image" src={imageURL} alt={description} data-testid="productImage" />
		</div>
	)
}

ProductImage.propTypes = {
	description: PropTypes.string,
	imageURL: PropTypes.string
}

ProductImage.defaultProps = {
	description: '',
	imageURL: ''
}

export default ProductImage
