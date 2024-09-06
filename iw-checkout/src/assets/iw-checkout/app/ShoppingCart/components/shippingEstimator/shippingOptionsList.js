import React from 'react'
import PropTypes from 'prop-types'

import Currency from '@insight/toolkit-react/lib/Currency/Currency'

export function ShippingOptionsList(props) {    
    const { carrierId: selectedCarrierId } = props.selectedCarrier

    return (
        <ul className='shipping-options__list'>
         {props.shippingOptions.map((freight, index) => (
                <li key={index} className='shipping-options'>
                    <label onClick={(event)=>props.handleShippingOption(freight, event)}>
                        <input className='shipping-options__radio'
                        defaultChecked ={selectedCarrierId && freight.carrierId == selectedCarrierId}
                        name="shippingOption" type="radio"/>
                        {props.isEMEA ? '' : freight.carrier !== 'SLS' ? freight.carrier : ''}&nbsp;
                        <span className='shipping-options__condition'>
                            {freight.shippingCondition}
                        </span>&nbsp;-&nbsp;
                        <Currency
                            value={freight.cost}
                            currencyCode={freight.currency}/>
                    </label>
                </li>
         ))}
        </ul>
    );
}

ShippingOptionsList.propTypes = {
    shippingOptions: PropTypes.array,
    handleShippingOption: PropTypes.func,
    isEMEA: PropTypes.bool
}
