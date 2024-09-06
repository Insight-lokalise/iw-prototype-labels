import { useContext } from 'react'

import IAHeaderContext from '../context/IAHeaderContext'

export default function useFilteredItemMap() {
  const { filteredItemMap } = useContext(IAHeaderContext)

  return filteredItemMap
}
