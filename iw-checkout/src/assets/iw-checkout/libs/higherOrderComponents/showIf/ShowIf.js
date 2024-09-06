import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import {
    selector_isLoggedIn,
    selector_userPermissions,
    selector_webGroupPermissions
} from './../../User/selectors'

/**
 * Render children if..
 *  - has children
 *  - the value provided at props.test, if props.test exists:
 *      - is a Boolean/Number and is truthy
 *      - is an Object/Array and all keys are truthy
 *      - is a Function, that receives the props passed to ShowIf, that returns true
 *  - user is logged in, if props.isLoggedIn is available
 *  - user has all permissions passed on the props.permissions key if it is available
 *
 *  @example
 *      <ShowIf
 *          isLoggedIn
 *          permissions={['show_lease_history', 'rmp']}
 *          test={{red: true, blue: 'truthy', five: 5, fn: {}}}
 *      >
 *          <Your Component props />
 *      </ShowIf>
 *
 * @param {Object} props    An object with the properties passed down through
 *                          React's props mechanism accessible via props[key]
 *                          and additional data provided by Redux, located at
 *                          props.reduxState
 *                          { reduxState, ownProps }
 */
export function ShowIfComponent({ children, ...props }) {
    let shouldShow = true
    if (children == null) return null

    // Verify that the user has all provided permissions
    if ('permissions' in props && props.permissions != null && shouldShow) {
        if (props.reduxState.userPermissions) {
            const permissions = Array.isArray(props.permissions) ? props.permissions : [props.permissions]
            const userHasPermission = permission => props.reduxState.userPermissions.includes(permission)
            shouldShow = shouldShow && permissions.filter(userHasPermission).length === permissions.length
        } else {
            shouldShow = false
        }
    }

    // Verify that the user has all provided web-group permissions
    if ('webGroupPermissions' in props && props.webGroupPermissions != null && shouldShow) {
        if (props.reduxState.webGroupPermissions) {
            const permissions = Array.isArray(props.webGroupPermissions) ? props.webGroupPermissions : [props.webGroupPermissions]
            const webGroupHasPermission = permission => props.reduxState.webGroupPermissions.includes(permission)
            shouldShow = shouldShow && permissions.filter(webGroupHasPermission).length === permissions.length
        } else {
            shouldShow = false
        }
    }

    // Verify that the user is logged in.
    if ('isLoggedIn' in props && shouldShow) {
        shouldShow = shouldShow && !!(props.reduxState.isLoggedIn === props.isLoggedIn)
    }

    if ('test' in props && shouldShow) {
        const { test } = props
        if (typeof test === 'function') {
            shouldShow = !!test(props)
        } else if (typeof test === 'boolean' || typeof test === 'number') {
            shouldShow = !!test
        } else {
            throw Error(`ShowIf does not understand a ${typeof test} test prop.`)
        }
    }

    // Should the component render its children only if our validation has resolved to false?
    if ('isFalse' in props && shouldShow) {
        shouldShow = !shouldShow
    }

    return shouldShow && children
}


/**
 * Because the ShowIf component will be widely used and on largely stable data,
 * we need to memoize these selectors.
 * @param  {Object} state   whole state
 * @return {Object}         { reduxState: { userPermissions, isLoggedIn }}
 */
export function mapStateToProps(state) {
    return {
        reduxState: {
            userPermissions: selector_userPermissions(state),
            webGroupPermissions: selector_webGroupPermissions(state),
            isLoggedIn: selector_isLoggedIn(state),
        },
    }
}

/**
 * The connected ShowIf component.
 * @type {ConnectedComponent}
 */
export const ShowIf = connect(mapStateToProps, null)(ShowIfComponent)

/**
 * ShowIfFalse is a helper for reversing the ShowIf component's render decision.
 * Because <ShowIf /> is connected to redux, we do not need to connect this component.
 * @param {Object} props props
 */
export function ShowIfFalse(props) {
    return <ShowIf {...props} isFalse />
}

ShowIfComponent.propTypes = {
    isFalse: PropTypes.bool,
    isLoggedIn: PropTypes.bool,
    test: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.bool,
        PropTypes.number,
    ]),
    permissions: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
    ]),
    webGroupPermissions: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
    ]),
    reduxState: PropTypes.object.isRequired,
}
