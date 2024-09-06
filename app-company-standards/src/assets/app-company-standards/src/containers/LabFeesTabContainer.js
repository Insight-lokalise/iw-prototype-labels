import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { t } from '@insight/toolkit-utils'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import LabFeesTab from '../components/CreateStandards/LabFeesTab'
import { getLabFees, selector_labFees } from '../duck'

function mapStateToProps(state, { groupLabConfig }) {
  return {
    options: [
      { text: t('Select one'), value: '' },
      ...selector_labFees(state, { labConfig: groupLabConfig }).map(partNumber => ({
        text: partNumber,
        value: partNumber,
      })),
    ],
  }
}

function mapDispatchToProps(dispatch, { groupLabConfig }) {
  return bindActionCreators(
    {
      getOptions: () => getLabFees({ labConfig: groupLabConfig }),
    },
    dispatch
  )
}

function LabFeesTabContainer(props) {
  const { getOptions, groupLabConfig, ...otherProps } = props
  useEffect(() => {
    getOptions()
  }, [groupLabConfig])

  return <LabFeesTab {...otherProps} />
}

LabFeesTabContainer.propTypes = {
  getOptions: PropTypes.func.isRequired,
  groupLabConfig: PropTypes.string.isRequired,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LabFeesTabContainer)
