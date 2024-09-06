import { fetchLabels, getCurrentLocale } from '@insight/toolkit-utils';
import { setToolkitLabels } from '@insight/toolkit-react';
import { INSIGHT_CURRENT_LOCALE_COOKIE_NAME } from '../constants';

export function getTranslations() {
	const locale = getCurrentLocale(INSIGHT_CURRENT_LOCALE_COOKIE_NAME);

	return fetchLabels({ labelFileName: 'app-reporting', app: 'app-reporting', locale }).then((labels) => {
		setToolkitLabels(labels);
	}).catch(() => { });
}
