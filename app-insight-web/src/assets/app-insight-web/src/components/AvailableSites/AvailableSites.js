import React, { useState, useEffect } from 'react'
import Button from "@insight/toolkit-react/lib/Button/Button";
import { t } from '@insight/toolkit-utils';

import { getAvailableSites } from 'api'

export default function AvailableSites() {
  const [websites, setWebsites] = useState([]);
  useEffect(() => {
    getAvailableSites().then(websites => {
      setWebsites(websites)
    })
  }, [])

  return(
    <div className='c-available-sites'>
      <h4 className='u-jp-font-weight-override'>{t('Clear the shopping cart and transfer to:')}</h4>
      <div className='o-grid'>
        {websites.map(({display, domain, name, nav}) => {
          return (
            <div key={name} className='o-grid__item u-1/1 u-1/2@tablet u-1/3@desktop c-available-sites__site'>
              <div>{t(display)}</div>
              <Button
                className='u-jp-font-weight-override'
                color='inline-link'
                href={`/insightweb/sso/gigya?targetDomain=${nav}`}
              >
                {t(domain)}
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
