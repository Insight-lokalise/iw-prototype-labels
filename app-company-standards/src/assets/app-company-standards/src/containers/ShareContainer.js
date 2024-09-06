import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { selector_salesArea, selector_wId } from '../duck'
import EntityProvider from './EntityProvider'
import Share from '../components/Share/Share'

function mapStateToProps(state) {
  return {
    currentSalesArea: selector_salesArea(state),
    currentWebGroupId: selector_wId(state),
  }
}

function ShareContainer(props) {
  return (
    <EntityProvider entityId={props.id} entityType={props.viewType}>
      {({ entity }) => <Share entity={entity} {...props} />}
    </EntityProvider>
  )
}

ShareContainer.propTypes = {
  id: PropTypes.string.isRequired,
  viewType: PropTypes.string.isRequired,
}

export default connect(mapStateToProps)(ShareContainer)
