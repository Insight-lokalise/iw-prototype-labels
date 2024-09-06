import React from 'react'
import PropTypes from 'prop-types'

import { getLocaleFromCookie, jumpToLearnMore, jumpToScheduleDemo } from 'api'
import { t } from '@insight/toolkit-utils'
import {Button, ButtonGroup} from "@insight/toolkit-react";

export default function ResetPassword(props) {
  const streamlinedCentralized = t('Streamlined and centralized')
  const aboutInsightHelpText = t('Your Insight account includes full access to our e-procurement platform. ' +
    'We provide the visibility, control and personalization you need to ' +
    'simplify IT purchasing and lifecycle management.')
  const learnMore = t('Learn more')
  const scheduleADemo = t('Schedule a demo')
  const locale = getLocaleFromCookie()
  return (
    <div className="c-about-insight">
      <h2 className="c-about-insight__heading">{streamlinedCentralized}</h2>
      <p>{aboutInsightHelpText}</p>
      <div className='c-about-insight__buttons'>
        <ButtonGroup align="center">
          <Button color="secondary" size="large" onClick={()=>jumpToLearnMore(locale)}>{learnMore}</Button>
          <Button color="secondary" size="large" onClick={()=>jumpToScheduleDemo(locale)}>{scheduleADemo}</Button>
        </ButtonGroup>
      </div>
    </div>
  )
}
