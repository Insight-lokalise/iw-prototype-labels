import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { PDPContext } from '../../context';
import { UIContext } from '../../shared/UIContext/UIContext';
import { SpecificationsTechOverview as PDPSpecificationsTechOverview } from '@insight/toolkit-react';

export const SpecificationsTechOverview = () => {
  const { product } = useContext(PDPContext);
  const { scrollIntoView } = useContext(UIContext);
  const history = useHistory();

  return <PDPSpecificationsTechOverview
    description={product?.descriptions?.longDescription}
    scrollIntoView={scrollIntoView}
    history={history}
  />
}

export default SpecificationsTechOverview;
