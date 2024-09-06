import React from 'react'
import { useCreateTnCContext } from '@context'
import { t } from 'api'

export default function TnCTableHeader() {
  const { previewView } = useCreateTnCContext()
  return(
    <div className='o-grid u-padding-top-tiny u-border-bot c-tc_tableHeader'>
      <div className='o-grid__item u-1/1 u-padding-bot-tiny u-padding-left'>
        <div className='o-grid'>
          <div className='o-grid__item u-3/6'>
            <div className='o-grid'>
              <div className='o-grid__item u-1/6'>
                <div className="o-grid__item o-grid__item--shrink u-text-center">{t('Type')}</div>
              </div>
              <div className='o-grid__item u-1/6'>
                <div className="o-grid__item o-grid__item--shrink u-text-center">{t('ID')}</div>
              </div>
              <div className='o-grid__item u-1/6'>
                <div className="o-grid__item o-grid__item--shrink">{t('Rev.')}</div>
              </div>
              <div className='o-grid__item u-3/6'>
                <div className="o-grid__item o-grid__item--shrink">{t('Description')}</div>
              </div>
            </div>
          </div>
          <div className="o-grid__item u-3/6">
            <div className="o-grid ">
              <div className='o-grid__item u-1/4'>
                <div className="o-grid__item o-grid__item--shrink">{t('Last Edited by')}</div>
              </div>
              <div className='o-grid__item u-1/4'>
                <div className="o-grid__item o-grid__item--shrink u-text-center">{t('Sales Agreements')}</div>
              </div>
              <div className="o-grid__item u-2/4">
                <div className="o-grid__item o-grid__item--shrink u-text-center">{previewView ? t('Published') : t('Actions')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

