import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { pathOr } from 'lib'

export default function EmailList({ notificationEmails }) {
	const emails = pathOr([], 'notificationEmails', notificationEmails)
	if (!emails.length > 0) {
		return null
	}

	return emails.map(email => ([
  <span>
    <span key={email}>{email}</span>
    <br key={`${email}-break`} ></br>
  </span>
	]))
}
