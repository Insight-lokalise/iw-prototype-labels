import React from 'react';
import { t } from '@insight/toolkit-utils/lib/labels'
import PropTypes from 'prop-types';
import ReviewSection from "./ReviewSection";
import { Address } from "@insight/toolkit-react";

const AddressSection = ({ type, address, onEdit }) => {
  const title = type === 'shipping-address' ? t('Shipping address') : t('Billing address')
  return (
    <div>
      <ReviewSection title={title} isEditable={true} onEdit={() => onEdit(type)}>
        <Address
          address={{
            attentionLine: address.attentionLine,
            company: address.companyName,
            address1: address.address1,
            address2: address.address2,
            address3: address.address3,
            city: address.city,
            state: address.state,
            zipcode: address.zipCode,
            country: address.countryId,
            phone: address.phone,
          }}
        />
      </ReviewSection>
    </div>
  );
};

export default AddressSection;

AddressSection.propTypes = {
  type: PropTypes.string.isRequired,
  address: PropTypes.shape({
    attentionLine: PropTypes.string,
    companyName: PropTypes.string,
    address1: PropTypes.string,
    address2: PropTypes.string,
    address3: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    zipCode: PropTypes.string,
    countryId: PropTypes.string,
    phone:  PropTypes.string,
  }).isRequired,
};
