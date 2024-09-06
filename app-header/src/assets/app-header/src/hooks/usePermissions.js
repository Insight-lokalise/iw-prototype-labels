import { useContext } from 'react'

import IAHeaderContext from '../context/IAHeaderContext'

export default function usePermissions() {
  const { headerInfo: { userInformation: { permissions } } } = useContext(IAHeaderContext)
  return permissions
}
