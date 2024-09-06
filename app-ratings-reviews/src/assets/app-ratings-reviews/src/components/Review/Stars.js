import React from 'react'

import StarRating from '@insight/toolkit-react/lib/StarRating/StarRating'

export default function Star({ rating }) {
	return (
		<div className="c-review__stars">
			<StarRating
				ediable={false}
				rating={rating}
				size="large"
				showAverage
				stars={5}
			/>
		</div>
	)
}
