import React, { useContext } from 'react';
import { PDPContext } from '../../context';
import { SpecificationsPropCompliance as PDPSpecificationsPropCompliance } from '@insight/toolkit-react';

export const SpecificationsPropCompliance = () => {
  const { product, getPropCompliance } = useContext(PDPContext);

  return <PDPSpecificationsPropCompliance
    product={product}
    getPropCompliance={getPropCompliance}
  />
}
