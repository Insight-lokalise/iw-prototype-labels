import React from 'react'

export default function getAssortmentInfo(assortments){
  
  const assortmentIds = assortments && Object.keys(assortments)
  const levels = assortmentIds && assortmentIds.map(key => {
    return <span>{assortments[key]}<br /></span>
  })

  return { assortmentIds, levels}
}
          