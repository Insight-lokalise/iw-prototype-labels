import { getInObject } from '@insight/toolkit-utils'

export default function getUserPermissions() {
  const userPermissions = getInObject(window, [ 'Insight', 'userPermissions' ], {})
  return userPermissions.includes('enable_browse_sw_contract')
}
