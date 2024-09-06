import React, {useEffect} from "react";
import PropTypes from 'prop-types'
import {t} from "@insight/toolkit-utils/lib/labels";
import {fetchTaxExemptFromShoppingRequest} from './../../../../libs/models/Payments/payment'

function TaxExemption(props) {
  const {hasTaxOverride, setOverrideTax, overrideTax, isReadOnly} = props
  useEffect(()=>{
    fetchTaxExemptFromShoppingRequest().then((taxExemption)=>{
      setOverrideTax(hasTaxOverride && taxExemption !== null && taxExemption.applyTaxCertificate)
    })
  }, [])
  return (
    <div>
      {isReadOnly ?
        <label htmlFor="iw-checkout__shipping-options-tax-exemption" className="form__label--readonly">{t('Tax Exemption')}</label>
        :
        <h4 className="fieldset__heading">
          {t('Tax Exemption')}
        </h4>
      }

      <div>
        <label className="row collapse" htmlFor="applyTaxCertificate">
          <input
            type="checkbox"
            id="applyTaxCertificate"
            onClick={()=>{ setOverrideTax(!overrideTax) }}
            name="applyTaxCertificate"
            disabled={isReadOnly}
            defaultChecked={overrideTax}
            className="column shrink form__input--checkbox" />
          <span className="column form__label--checkbox">
            {t('Check here to apply any applicable tax exemption certificate on file with Insight\'s Tax Department for my account')}
          </span>
        </label>
      </div>
    </div>
  )
}

export default TaxExemption

TaxExemption.propTypes = {
  isReadOnly: PropTypes.bool.isRequired,
  hasTaxOverride: PropTypes.bool.isRequired,
  setOverrideTax: PropTypes.func.isRequired,
  overrideTax: PropTypes.bool.isRequired,
}

TaxExemption.defaultProps = {
  isReadOnly: false,
  overrideTax: false
}

