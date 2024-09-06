import React, { useContext } from 'react';
import { PDPContext } from '../../context';
import { SpecificationsVariants as PDPSpecificationsVariants } from '@insight/toolkit-react';

export const SpecificationsVariants = () => {
    const { variants, sendTracking } = useContext(PDPContext);

    return <PDPSpecificationsVariants
        variants={variants}
        sendTracking={sendTracking}
    />
}