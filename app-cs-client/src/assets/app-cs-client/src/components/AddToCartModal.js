import React, { Fragment } from 'react'
import PropTypes from "prop-types";
import { Button, Currency, Image, Loading, Modal } from "@insight/toolkit-react";
import { t } from '@insight/toolkit-utils';
import cn from "classnames";

export default function AddToCartModal({ cartData, closeModal, modalIsOpen, isEMEA, isStockAndPriceDisplay }) {

  return (
    <Fragment>
      <Modal
        isOpen={modalIsOpen}
        onClose={closeModal}
        overlayclassname="c-modal-overlay"
        size="medium"
      >
        {cartData ?
          <Fragment>
            <Modal.Header onClick={closeModal}>
              <h4 className="u-text-bold">{t('Added to cart')}</h4>
            </Modal.Header>
            <Modal.Body className="c-cs-modalbody">
              {cartData.items.map(item => (
                <Fragment>
                  <div key={item.materialId} className="o-grid u-border-bot u-padding-vertical">
                    <div className="o-grid__item u-1/4">
                      <Image alt={item.description} image={item.imageUrl} />
                    </div>
                    <div className='o-grid__item u-3/4'>
                      <div className="o-grid u-1/1">
                        <div className="o-grid__item u-1/1 u-margin-bot-small u-text-bold">
                          <h6 className="c-cs-modalProduct__description">{item.description}</h6>
                        </div>
                        <div className="o-grid__item u-1/1 u-margin-bot-small">
                          <div className="o-grid u-1/1">
                            <div className="o-grid__item u-1/2">{t('Insight#')}: {item.materialId}</div>
                            <div className="o-grid__item u-1/2">{t('Mfr#')}: {item.manufacturerId}</div>
                          </div>
                        </div>
                        <div className="o-grid__item u-1/2">{t('Quantity')}: {item.qty}</div>
                        {isStockAndPriceDisplay ? <div className="o-grid__item u-1/2 u-text-right">{t('Your price')}: <Currency showVAT={isEMEA} tax={false} value={item.unitPrice * item.qty} /></div> : <div />}
                      </div>
                    </div>
                  </div>
                </Fragment>
              ))}
              <div className="o-grid u-1/1 u-padding-top-small u-text-right">
                {isStockAndPriceDisplay ? <div className="o-grid__item u-1/1">{t('Subtotal')}: <Currency showVAT={isEMEA} tax={false} value={cartData.subTotal} /></div> : <div />}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button color="secondary" onClick={closeModal}>
                {t('Continue shopping')}
              </Button>
              <Button onClick={closeModal} color="primary" href="/insightweb/viewCart" >
                {t('Continue to checkout')}
              </Button>
            </Modal.Footer>
          </Fragment>
          : <div className="u-padding u-text-center"><Loading /></div>}
      </Modal>
    </Fragment>
  )
}

AddToCartModal.propTypes = {
  cartData: PropTypes.arrayOf(PropTypes.object).isRequired,
  closeModal: PropTypes.func.isRequired,
  modalIsOpen: PropTypes.bool.isRequired,
  isEMEA: PropTypes.bool.isRequired,
  isStockAndPriceDisplay: PropTypes.bool.isRequired
}



