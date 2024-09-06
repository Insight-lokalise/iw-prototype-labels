import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link as ReactRouterLink } from 'react-router-dom'

import { selector_wId } from '../../duck'

function mapStateToProps(state) {
  return { linkProps: { webGroupId: selector_wId(state) } }
}

function Link({ dispatch, linkProps: { webGroupId }, categoryId, search, disabled, className, ...otherProps }) {
  return (
      disabled ?
        <ReactRouterLink
          className={`${className} c-button  c-button--link is-disabled`}
          onClick={(e)=> e.preventDefault()}
          {...otherProps}
          to={{ ...otherProps.to, search: !!categoryId?`?wId=${webGroupId}&categoryId=${categoryId}`:`?wId=${webGroupId}`, state: { search } }} />
      :
        <ReactRouterLink
          className={className}
          {...otherProps}
          to={{ ...otherProps.to, search: !!categoryId?`?wId=${webGroupId}&categoryId=${categoryId}`:`?wId=${webGroupId}`, state: { search } }} />

    )

}

Link.propTypes = {
  children: PropTypes.node,
  dispatch: PropTypes.func.isRequired,
  linkProps: PropTypes.shape({
    webGroupId: PropTypes.number.isRequired,
  }).isRequired,
  search: PropTypes.bool,
  to: PropTypes.shape({}).isRequired,
  disabled: PropTypes.bool,
}

Link.defaultProps = {
  children: null,
  search: false,
  disabled: false,
}

export default connect(mapStateToProps)(Link)
