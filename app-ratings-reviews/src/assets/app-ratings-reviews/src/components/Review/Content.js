import React from 'react'

import { Button, Date, Icon } from '@insight/toolkit-react'
import { t } from '@insight/toolkit-utils'
import PropTypes from "prop-types";

export default function Content({
	expanded,
	isRecommended,
	reviewText,
	showMoreOrLessText,
  SubmissionTime,
	title,
	userNickname
}) {
	const displayedText = expanded ? reviewText : reviewText.substr(0, 500)

	return (
		<div className="c-review__content">
			<h4 className="c-review__title">{title}</h4>
			<p className="c-review__text">{displayedText}</p>
			{reviewText.length > 500 && (
				<Button className="c-review__show" color="link" onClick={showMoreOrLessText}>
					<span>{expanded ? t('Show less') : t('Show more')}</span>
					<Icon icon={expanded ? 'arrow-dropup' : 'arrow-dropdown'} />
				</Button>
			)}
			<p className="c-review__user">{userNickname} - <span className="c-review__date"><Date date={SubmissionTime} /></span></p>
			{isRecommended ? (
				<p className="c-review__recommended">
					<Icon className="c-icon__sizing" icon="checkmark-circled" type="success" />
          <span><span className="u-text-bold">{`${t('Yes')},`}</span> {t('I recommend this product.')}</span>
				</p>
			) : (
				<p className="c-review__recommended">
					<Icon className="c-icon__sizing" icon="close-circled" type="error" />
          <span><span className="u-text-bold">{`${t('No')},`}</span> {t(`I don't recommend this product.`)}</span>
				</p>
			)}
		</div>
	)
}

Content.propTypes = {
  expanded: PropTypes.bool.isRequired,
  isRecommended: PropTypes.bool.isRequired,
  reviewText: PropTypes.string.isRequired,
  showMoreOrLessText: PropTypes.func.isRequired,
  SubmissionTime: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  userNickname: PropTypes.string.isRequired,
}
