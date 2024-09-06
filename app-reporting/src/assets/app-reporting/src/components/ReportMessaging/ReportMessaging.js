import React from 'react';
import { t } from '@insight/toolkit-utils';
import { Message } from '@insight/toolkit-react';

const ReportMessaging = ({
	message = t('It looks like we’ve encountered a technical issue. Please try again after sometime.')
}) => {
	return <Message
		type='warning'
		children={message}
		ariaLive='polite'
		className='c-reporting__error-page'
	/>
}

export default ReportMessaging;