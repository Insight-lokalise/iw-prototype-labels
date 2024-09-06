import React from 'react';
import { Button, Icon } from '@insight/toolkit-react';
import { t } from '@insight/toolkit-utils';
import { REPORTING_TEXTS } from '../../texts';
import { ACCESS_DENIED_ICON, HOME_PAGE_URL } from '../../constants';

const {
	ACCESS_DENIED_TEXT,
	ACCESS_DENIED_DESCRIPTION,
	BACK_TO_HOMEPAGE,
} = REPORTING_TEXTS

const AccessDenied = (props) => {
	const {
		title = t(ACCESS_DENIED_TEXT),
		description = t(ACCESS_DENIED_DESCRIPTION)
	} = props;

	const accessDeniedClass = 'c-reporting__access-denied';

	return (
		<>
			<div className={`o-grid ${accessDeniedClass}`}>
				<div className={`o-grid__item u-2/3@tablet ${accessDeniedClass}__message`}>
					<h2>{title}</h2>
					<p className={`${accessDeniedClass}__message-desc`}>{description}</p>
					<Button color="primary" href={HOME_PAGE_URL} >{t(BACK_TO_HOMEPAGE)}</Button>
				</div>
				<div className={`o-grid__item u-1/3@tablet ${accessDeniedClass}__image`} >
					<Icon icon={ACCESS_DENIED_ICON} color="primary" />
				</div>
			</div>
		</>
	)
}

export default AccessDenied;