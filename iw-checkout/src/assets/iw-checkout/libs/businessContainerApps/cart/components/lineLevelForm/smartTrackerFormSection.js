import React from 'react';
import PropTypes from 'prop-types'

import { SMARTTRACKER_SECTION_NAME } from '../../constants'
import { orderSmartTrackers } from '../../helpers'
import LineLevelSection from './lineLevelSection'
import SmartTrackerField from './SmartTracker'


export default function SmartTrackerFormSection(props) {
    return (
        <LineLevelSection
            parentFormName={props.parentFormName}
            sectionDisplayName={'SmartTracker'}
            sectionName={SMARTTRACKER_SECTION_NAME}
            showCopyToAll={props.numberOfItemsInCart > 1}
        >
            { orderSmartTrackers(props.defaultLineLevels)
                .map(lineInfo =>
                    <div className="columns small-12 medium-6 large-4" key={lineInfo.lineLevelId}>
                        <SmartTrackerField smartTracker={lineInfo} usedInCart />
                    </div>
                )
            }
        </LineLevelSection>
    );
}


SmartTrackerFormSection.propTypes = {
	defaultLineLevels: PropTypes.objectOf(PropTypes.object).isRequired,
	numberOfItemsInCart: PropTypes.number.isRequired,
	parentFormName: PropTypes.string.isRequired,
}
