import React from 'react'
import PropTypes from 'prop-types'

import { t } from '@insight/toolkit-utils/lib/labels'
import { IWAnchor } from '../../../../iw-components'
import Button from '@insight/toolkit-react/lib/Button/Button'

import SaveLineLevels, { linkTypes } from './saveLineLevels'

export default function LineLevelFormHeader(props) {
  const requiredText = t('Item information (required)')
  const optionalText = t('Item information (optional)')
  const splitText = t('Split into individual lines')
  return (
    <div className="row expanded align-middle">
      <div className="columns small-12 medium-6">
        {props.hasRequiredLineLevels ? (
          <h4 className="line-level__heading line-level__heading--required">
            {requiredText}
          </h4>
        ) : (
          <h4 className="line-level__heading line-level__heading--optional">
            <IWAnchor onClick={props.toggleFormRendering}>
              <Button className="u-text-left" color="link" icon="add">
                {t(optionalText)}
              </Button>
            </IWAnchor>
          </h4>
        )}
      </div>
      <div className="columns small-12 medium-6 medium-text-right">
        {props.showSplitLink && (
          <SaveLineLevels
            associatedForm={props.associatedForm}
            isBundled={props.isBundled}
            linkType={linkTypes.SPLIT_LINK}
            text={splitText}
          />
        )}
      </div>
    </div>
  )
}

LineLevelFormHeader.propTypes = {
  associatedForm: PropTypes.string.isRequired,
  hasRequiredLineLevels: PropTypes.bool.isRequired,
  isBundled: PropTypes.bool,
  showSplitLink: PropTypes.bool.isRequired,
  toggleFormRendering: PropTypes.func.isRequired,
}

LineLevelFormHeader.defaultProps = {
  outOfBundleChildItems: [],
}
