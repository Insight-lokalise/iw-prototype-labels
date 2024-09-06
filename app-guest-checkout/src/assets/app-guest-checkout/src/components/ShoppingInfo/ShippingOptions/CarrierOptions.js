import React, { useEffect } from 'react'
import { t } from '@insight/toolkit-utils/lib/labels'
import { Field, Currency } from '@insight/toolkit-react'
import { RadioGroup } from '@insight/toolkit-react/lib/Form/Components/Elements'

const CarrierOptionsDisplay = ({ carriers = [], getSelectedValue }) => {
  const currencyItem = carrier => <span><span>{`${t(carrier?.conditionDescription)}`} - </span><Currency currencyCode={carrier?.currency} value={carrier?.price} /></span>;
  useEffect( () => {
    if(carriers.length) {
        const selectedCarrier = carriers?.find(carrier => carrier?.defaultCarrier);
        if (selectedCarrier && Object.keys(selectedCarrier).length) {
          getSelectedValue(selectedCarrier?.conditionDescription);
        } else {
          const defaultCarrier = carriers?.find(carrier => carrier?.price === getCarrierMinimumPrice());
          getSelectedValue(defaultCarrier?.conditionDescription);
        }
    }
  }, []);

  const getDefaultCarrier = carrier => carriers.length ? (carrier?.price === getCarrierMinimumPrice()) : false;
  const getCarrierMinimumPrice = () => {
    const carrierPrices = carriers?.map(carrier => carrier?.price);
    return Math.min(...carrierPrices);
  }

  const carrierOptions = carriers?.map((carrier) => {
    return {
      id: `${carrier?.carrierId}`,
      label: currencyItem(carrier),
      value: carrier?.conditionDescription,
      className: 'c-carrier-option',
      checked: carrier?.defaultCarrier ? carrier?.defaultCarrier : getDefaultCarrier(carrier),
      'data-testid': `{carrier-${carrier?.conditionDescription}}`,
      onChange: (e) => {
        getSelectedValue(e.target.value)
      },
    }
  })

  const setDefaultCarrierOption = () => {
    return carrierOptions.find(carrierOptions => carrierOptions.checked)?.['value']
  }

  return (
    <>
      <Field name="carrierOptionType">
        {({fieldProps}) => {
         return (
            <div className="o-grid__item  u-1/1 u-margin-bot">
              <div className="c-form__control">
                <div className="c-form__radio o-grid__item">
                  <RadioGroup {...fieldProps} options={carrierOptions} value={setDefaultCarrierOption()}/>
                </div>
              </div>
            </div>
          )
        }
        }
      </Field>
    </>
  )
}

export default CarrierOptionsDisplay
