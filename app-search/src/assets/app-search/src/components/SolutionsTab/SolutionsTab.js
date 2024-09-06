import React from 'react'

import ContentTab from '../ContentTab/ContentTab';

export const SolutionsTab = ({ handleTabClick, query, items, id }) => {

  return (
    <ContentTab
      handleTabClick={handleTabClick}
      query={query}
      id={id}
      items={items}
    />
  )
}

export default SolutionsTab