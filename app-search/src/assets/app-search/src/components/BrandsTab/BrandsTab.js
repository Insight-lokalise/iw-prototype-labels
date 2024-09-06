import React from 'react';
import ContentTab from '../ContentTab/ContentTab';
import { isEmeaRegion } from '@insight/toolkit-utils';

export const BrandsTab = ({ handleTabClick, query, items, id, country }) => {

  const isEMEA = isEmeaRegion();
  const showContentRowUI = country === 'US' || isEMEA;

  return (
    <ContentTab
      handleTabClick={handleTabClick}
      query={query}
      id={id}
      items={items}
      newContentRowUI={showContentRowUI}
    />
  )
}

export default BrandsTab
