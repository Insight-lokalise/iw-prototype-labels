import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@insight/toolkit-react'
import { isHybridXEnabled } from 'app-api-user-service'
import { getCurrentLocale, t } from '@insight/toolkit-utils'

export default function ProductCompareView({
	addToCompareProps,
	materialId,
	getProductCompareHref,
	user
}) {
	const { isSelectedToCompare, needsCompareTo, toggleSelectToCompare } = addToCompareProps
	const locale = getCurrentLocale('insight_locale')
	const { isLoggedIn, isCES } = user
	const COMPARE_HREF = isHybridXEnabled(isLoggedIn, isCES)? getProductCompareHref():`/content/insight-web/${locale}/shop/compare.html`
	const addToCompareText = (
		<Button
			className="c-item-card__compare"
			color="link"
			onClick={() => toggleSelectToCompare(materialId)}
		>
			{t('Add to compare list')}
		</Button>
	)
	const compareToText = needsCompareTo
		? <span className="c-item-card__compare-text" data-testid='compare-text' >{`(${t('Select 2 or more to compare.')})`}</span>
		: <Button className="c-item-card__compare-now" color="link" href={COMPARE_HREF}>{t('Compare now')}</Button>
	const compareNowText = <div className="c-item-card__compare">{t('Added')}{compareToText}</div>
	return isSelectedToCompare ? compareNowText : addToCompareText
}

ProductCompareView.propTypes = {
	addToCompareProps: PropTypes.shape({
		isSelectedToCompare: PropTypes.bool,
		needsCompareTo: PropTypes.bool,
		toggleSelectToCompare: PropTypes.func
	}).isRequired,
	materialId: PropTypes.string.isRequired,
}
