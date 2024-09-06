import { useContext } from 'react'

import IAHeaderContext from '../context/IAHeaderContext'

export default function useFilteredItemStatus(id) {
  const { filteredItemMap } = useContext(IAHeaderContext)

  return filteredItemMap[id]
}
