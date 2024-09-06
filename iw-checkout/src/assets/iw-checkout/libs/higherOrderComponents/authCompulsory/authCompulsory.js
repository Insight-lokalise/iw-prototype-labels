import React from 'react';

import { selector_user } from './../../User/selectors'

export default function(ComposedComponent) {
    function AuthCompulsory(props) {
        return <ComposedComponent {...props}/>;
    }

    function mapStateToProps(state) {
		return { authenticated: selector_user(state) }
	}

    return AuthCompulsory
}
