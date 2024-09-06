export const selector_userData = (state) => state.userData || {}
export const selector_userPermissions = (state) => selector_userData(state).userPermissions || []
export const selector_webGroupPermissions = (state) => selector_userData(state).webGroupPermissions || []
export const selector_userInfo = (state) => selector_userData(state).userInformation || null
