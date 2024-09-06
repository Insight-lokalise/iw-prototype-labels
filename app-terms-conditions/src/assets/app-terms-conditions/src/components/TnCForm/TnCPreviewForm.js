import React, { Fragment }  from 'react'
import { TnCTable } from "@components";
import { t } from 'api'
import TnCContent from "./TnCContent";

export default function TnCPreviewForm()  {
  return (
    <div className='o-grid u-margin-top u-margin-bot-small u-padding-bot'>
      <div className='o-grid u-1/1'>
        <div className='o-grid__item u-1/1 c-tc_heading'>
          <h3>{t('Preview')}</h3>
        </div>
        <TnCTable />
        <div className='o-grid__item u-1/1 u-padding-top'>
          <TnCContent />
        </div>
      </div>
    </div>
  )
}

