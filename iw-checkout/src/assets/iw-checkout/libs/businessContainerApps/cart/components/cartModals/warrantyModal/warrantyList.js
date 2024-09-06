import React from "react";
import cn from 'classnames';
import { Field, Image } from "@insight/toolkit-react";
import PartNumbers from "@insight/toolkit-react/lib/PartNumbers/PartNumbers";
import Currency from "@insight/toolkit-react/lib/Currency/Currency";
import { t, getVatPriceProps} from "@insight/toolkit-utils";

export default function WarrantyList(props) {
  const {
    showVAT,
    header,
    warranties,
    toggleWarranty,
    defaultWarranty,
    isStockAndPriceDisabled
  } = props;
  const { exclVatProps, inclVatProps } = getVatPriceProps(showVAT);

  const productTiles = warranties.map(item => {
    const {
      materialId,
      manuIid,
      description,
      price,
      clickTrackingURL,
      ippWarranties,
      image
    } = item;

    const currency = price?.currency;
    const warrantyPrice = price?.price;
    const warrantyPriceInclVat = price?.priceInclVat;
    const displayInclVat = showVAT && warrantyPriceInclVat;

    return (
      <div className='o-grid'>
        <div className='o-grid__item u-5/6'>
          <div className='o-grid'>
            <div className='o-grid__item u-1/6 c-warranties-modal__radio'>
              <Field
                fieldComponent="Radio"
                value={materialId}
                name="warrantyItemRadio"
                checked={materialId === defaultWarranty}
                onChange={() => toggleWarranty({ materialId, ippWarranties, trackingUrl: clickTrackingURL })}
              />
            </div>
            <div className='o-grid__item u-1/6'>
              <Image
                className='c-warranties-modal__image'
                alt={description}
                image={image}
              />
            </div>
            <div className='o-grid__item u-4/6'>
              <div className='o-grid'>
                <div className='o-grid__item u-1/1'
                  data-testid='item-description'>
                  <div className='u-text-bold'>{description}</div>
                  <div className="o-grid c-warranties-modal__partNumbers u-margin-bot-tiny">
                    <PartNumbers
                      inline
                      insightPart={materialId}
                      mfrPart={manuIid || materialId}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {!isStockAndPriceDisabled &&
          <div className={cn('o-grid__item u-1/6 u-text-center u-text-bold', {
            'c-warranties-modal__price': displayInclVat
          })}>
            <Currency currencyCode={currency} value={Number(warrantyPrice)} {...exclVatProps} />
            {displayInclVat && <Currency currencyCode={currency} value={Number(warrantyPriceInclVat)} {...inclVatProps} />}
          </div>
        }
      </div>
    )
  })

  return productTiles?.length > 0 ? (<>
      <h6 className="u-text-bold c-warranties-modal__heading">{t(header)}</h6>
      {productTiles}
    </>) : null;
}
