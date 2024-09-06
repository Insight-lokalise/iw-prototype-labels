import React, {Fragment} from 'react';
import DeliveryMethodInfo from './setup-delivery/DeliveryMethodInfo'
import DeliveryMethodSelection from './setup-delivery/DeliveryMethodSelection'
import PropTypes from 'prop-types'

export default function SetupDelivery({clientInfo}) {  

  return (    
    <Fragment>
      <DeliveryMethodInfo />
      <DeliveryMethodSelection {...clientInfo} />      
    </Fragment>
  )
}

SetupDelivery.propTypes = { 
  clientInfo: PropTypes.object
}