import React from 'react';
import { t } from '@insight/toolkit-utils/lib/labels';
import { ButtonGroup, Button, Image, Modal } from '@insight/toolkit-react';
import WarrantyList from "./warrantyList";
import { productImageToRender } from '../../../../../models/Products/';
import PartNumbers from "@insight/toolkit-react/lib/PartNumbers/PartNumbers";

export default function WarrantyModal(props) {

    const { 
      parentMaterialData, 
      warrantiesData = [], 
      thirdPartywarrantiesData = [], 
      selectedProductWarrantyFlag , 
      selectedProductWarranty,
      isStockAndPriceDisplayDisabled
    } = props;
    const defaultWarranty = selectedProductWarrantyFlag ? 
      selectedProductWarranty?.warrMaterialId :
      [...warrantiesData, ...thirdPartywarrantiesData]?.[0]?.materialId;
    const renderWarrantiesList = () => {
      return <>
        <WarrantyList
          warranties={warrantiesData}
          header='Manufacturer warranties'
          defaultWarranty={defaultWarranty}
          isStockAndPriceDisabled={isStockAndPriceDisplayDisabled}
          {...props}
        />
        <WarrantyList
          warranties={thirdPartywarrantiesData}
          header='Other protection options'
          defaultWarranty={defaultWarranty}
          isStockAndPriceDisabled={isStockAndPriceDisplayDisabled}
          {...props}
        />
      </>
    }

    const itemImage = productImageToRender(parentMaterialData.image);
    const showModalContent = parentMaterialData && ((warrantiesData?.length > 0) || (thirdPartywarrantiesData?.length > 0));

    return (
      <Modal size='medium' isOpen={props.showWarrantyDialog} onClose={props.onHide} overlayclassname="c-modal-overlay" className='c-warranties-modal'>
        <Modal.Header onClick={props.onHide}>
          <h3>{t('Protect your purchase')}</h3>
        </Modal.Header>
        <Modal.Body className={`${showModalContent ? "c-warranties-modal__warranty-body" : ""}`}>
          <section>
            {showModalContent ?
              <div className='o-grid'>
                <div className='o-grid__item u-1/1 c-warranties-modal__thumbnail'>
                  <div className='o-grid'>
                    <div className='o-grid__item o-grid__item--shrink' data-testid='item-image'>
                      <Image
                        className='c-warranties-modal__header-image'
                        alt={`${parentMaterialData.description}`}
                        image={itemImage || parentMaterialData.image}
                      />
                    </div>
                    <div className='o-grid__item'>
                      <div className='o-grid'>
                        <div className='o-grid__item u-1/1 c-warranties-modal__description' data-testid='item-description'>
                          <div className='u-text-bold'>{parentMaterialData.description}</div>
                          <PartNumbers
                            inline
                            insightPart={parentMaterialData.materialId}
                            mfrPart={parentMaterialData.manufacturerPartNumber}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="o-grid__item u-1/1 c-warranties-modal__recommendation">
                  { renderWarrantiesList() }
                </div>
                <div className='o-grid__item u-1/1 c-warranties-modal__warranty-footer'>
                  <ButtonGroup align='right'>
                    <Button color="link" onClick={props.onHide}>{t('Cancel')}</Button>
                    <Button color="primary" onClick={props.handleAddWarrantyToCart}>{t('Select')}</Button>
                  </ButtonGroup>
                </div>
              </div>
              :
              <div className="o-grid">
                <div className="o-grid__item parent-product">
                <p>{t('Warranties not available for this product.')}</p>
                </div>
              </div>
            }
          </section>
        </Modal.Body>
      </Modal>
    )
}
