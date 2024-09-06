import React, { Fragment } from 'react'
import PropTypes from 'prop-types';
import { t } from '@insight/toolkit-utils';

export default function ContractIpsHeaderView({ ipsContractName }) {  

  return (
    <div className='c-software-license__ips-header u-text-bold'>          
      {ipsContractName}
    </div>
  )

}

ContractIpsHeaderView.propTypes = {
  ipsContractName: PropTypes.string.isRequired,
}
