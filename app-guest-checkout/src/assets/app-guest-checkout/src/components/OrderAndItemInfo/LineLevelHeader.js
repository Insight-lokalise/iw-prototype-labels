import React from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils/lib/labels'
import { Button } from "@insight/toolkit-react";

export default function LineLevelHeader({ clearFormValues, handleCopyToAll, hasRequiredLineLevels, handleSplitLinkClick, materialId, showCopyToAllLink, showSplitLink }){
  const requiredText = t('Item information (required)')
  const optionalText = t('Item information (optional)')
  const splitText = t('Split into individual lines')
  return(
    <div className='o-grid'>
      <div className='o-grid__item u-1/1'>
        <div className='o-grid'>
          <div className='o-grid__item u-4/6@tablet u-1/1'>
            <h4 className='c-resource-item__lineLevel-heading'>{hasRequiredLineLevels ? requiredText : optionalText}</h4>
          </div>
          <div className='o-grid__item u-2/6@tablet u-1/1 u-text-right'>
            { showSplitLink &&
              <Button color="link" className="c-resource-item__split" icon="shuffle" iconPosition="left" onClick={() => handleSplitLinkClick()}>
                {t(splitText)}
              </Button>
            }
          </div>
        </div>
        <div className='o-grid'>
          <div className='o-grid__item u-4/6@tablet u-1/1'>
            <h5 className='c-resource-item__license-heading'>{t('License information')}</h5>
          </div>
          <div className='o-grid__item u-2/6@tablet u-1/1 u-text-right'>
            <Button color="link" className="c-resource-item__split" iconPosition="left" onClick={() => clearFormValues(materialId)}>
              {t('Clear')}
            </Button>
            {showCopyToAllLink &&
              <>
                <span> | </span>
                <Button color="link" className="c-resource-item__split" iconPosition="left" onClick={() => handleCopyToAll(materialId)}>
                  {t('Copy to all')}
                </Button>
              </>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

LineLevelHeader.propTypes = {
  hasRequiredLineLevels: PropTypes.bool.isRequired,
  showCopyToAllLink: PropTypes.bool.isRequired,
  setShowCopyToAllLink: PropTypes.func.isRequired,
  showSplitLink: PropTypes.bool.isRequired
}
