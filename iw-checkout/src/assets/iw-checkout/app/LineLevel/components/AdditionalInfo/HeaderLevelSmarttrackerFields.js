import React from 'react'
import cn from 'classnames'
import PropTypes from 'prop-types'
import { FormSection } from 'redux-form'
import SmartTrackerField from './../../../../libs/businessContainerApps/cart/components/lineLevelForm/SmartTracker'

export default function HeaderLevelSmartTrackerFields(props) {
  const {
    clearSetAsMyDefault,
    headerLevelSmartTrackers,
    isEditChkoutDefaultFavs,
    isLimitedUser,
    isNavy,
    isSingleWebGroup,
    navySTName,
    orderSmartTrackers
  } = props
  const allowSetAsMyDefault =
    !isLimitedUser && isEditChkoutDefaultFavs && isSingleWebGroup

  return (
    <FormSection name="smartTracker">
      <div className="row expanded">
        {headerLevelSmartTrackers.map((smartTracker, index) => {
          const isNavySmarttracker = isNavy && navySTName === smartTracker.name
          const orderSmartTracker = orderSmartTrackers.filter(
            (st) => st.id == smartTracker.lineLevelId
          )[0] || { id: smartTracker.lineLevelId, value: smartTracker.value }
          return (
            <div
              className={cn(
                { hide: isNavySmarttracker },
                'columns small-12 medium-6 large-4 header-level-smartTracker-field'
              )}
              key={index}
            >
              <SmartTrackerField
                allowSetAsMyDefault={allowSetAsMyDefault}
                clearSetAsMyDefault={(value) =>
                  clearSetAsMyDefault('smartTracker.' + value, false)
                }
                orderSmartTrackerValue={orderSmartTracker.value}
                smartTracker={smartTracker}
              />
            </div>
          )
        })}
      </div>
    </FormSection>
  )
}

HeaderLevelSmartTrackerFields.defaultProps = {
  isEditChkoutDefaultFavs: false,
  isLimitedUser: false,
  isSingleWebGroup: false,
}

HeaderLevelSmartTrackerFields.propTypes = {
  clearSetAsMyDefault: PropTypes.func.isRequired,
  headerLevelSmartTrackers: PropTypes.array,
  isEditChkoutDefaultFavs: PropTypes.bool,
  isLimitedUser: PropTypes.bool,
  isNavy: PropTypes.bool,
  isSingleWebGroup: PropTypes.bool,
  navySTName: PropTypes.string,
  orderSmartTrackers: PropTypes.array,
}
