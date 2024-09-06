import React, { useContext, useState, useEffect } from 'react';
import { getCnetConfig } from '../../../lib/locale';
import { PDPContext } from '../../../context';
import { OverviewCNETScript as PDPOverviewCNETScript } from '@insight/toolkit-react';

const OverviewCNETScript = () => {
  const { product } = useContext(PDPContext);
  const [config, setConfig] = useState(null);

  const fetchCnetConfig = async () => {
    try {
      const config = await getCnetConfig();
      setConfig(config);
    } catch (err) {
      console.warn(`Failed to fetch CNET config`, err);
    }
  }

  useEffect(() => {
    fetchCnetConfig();
  },[]);

  return <PDPOverviewCNETScript
    product={product}
    config={config}
  />
}

export default OverviewCNETScript;
