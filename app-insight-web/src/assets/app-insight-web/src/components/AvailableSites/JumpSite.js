import React from 'react'
import PropTypes from 'prop-types'
import Button from '@insight/toolkit-react/lib/Button/Button'
import { t  } from '@insight/toolkit-utils';

import AvailableSites from "./AvailableSites";
import CreateAccount from "./CreateAccount";

export default function JumpSite(props) {
  return (
    <div className='c-jump-page'>
      <div className="o-grid">
        <div className="o-grid__item  u-1/1 u-text-center c-jump-page__hero">
          <h1 className="c-jp__hero-heading">{t('Insight Access Manager')}</h1>
          <p className='c-jp__hero-heading u-jp-font-weight-override'>
            {t('You are not associated with this Insight site.')}
            <br/>
            {t('However, you do have access to other Insight sites.')}
          </p>
        </div>
        <div className='o-grid__item u-1/1'>
          <div className='o-grid o-grid--gutters-large c-jump-page__options'>
            <div className="o-grid__item  u-1/1 u-text-center">
              <h3 className='u-jp-font-weight-override'>{t('Please choose from the following:')}</h3>
            </div>
            <div className='o-grid__item  u-1/1 u-1/3@desktop'>
              <CreateAccount />
            </div>
            <div className='o-grid__item  u-1/1 u-2/3@desktop'>
              <AvailableSites />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

JumpSite.propTypes = {}

