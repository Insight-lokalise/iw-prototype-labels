export default function BvPixelTrackEvent({
	name,
	brand,
	productId,
	categoryId,
	detail1,
	detail2,
}) {
	if ( window.BV ) {
		window.BV.pixel.trackEvent('Feature', {
			type: 'Used',
			name: name,
			brand: brand,
			productId: productId,
			bvProduct: 'RatingsAndReviews',
			categoryId: categoryId,
			detail1: detail1,
			detail2: detail2
		})
	}
}
