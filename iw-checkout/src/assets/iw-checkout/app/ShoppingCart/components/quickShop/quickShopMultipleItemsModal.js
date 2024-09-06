import React from 'react'
import { t } from '@insight/toolkit-utils/lib/labels'
import { IWModal } from './../../../../libs/iw-components'

export default function QuickShopMultipleItemsModal(props) {
    const productTiles = props.productMap.map(item => {
        return (<li className="row multiple-items-modal__item" key={item.materialId}>
            <div className="column multiple-items-modal__item-row">
                <div className="row row__gutter--tiny collapse">
                    <div className="columns shrink multiple-items-modal__item-checkbox">
                        <input aria-label={item.materialId}
                        onClick={()=>props.toggleItem(item.materialId)} type="checkbox"/>
                    </div>
                    <div className="columns multiple-items-modal__item-desc">
                        <strong>{item.cnetDescription}</strong><br/>
                        <span className="multiple-items-modal__item-part cart__font-size--sm">{t('Mfr #')}: {item.manufacturerPartNumber}</span>
                        <span className="multiple-items-modal__item-part cart__font-size--sm">{t('Insight #')}: {item.materialId}</span>
                    </div>
                </div>
            </div>
        </li>)
    })
    return (
        <IWModal
           backdropClassName='iw-dialog iw-dialog-backdrop'
           modalSize='medium'
           showIf={props.isMultipleSKUFound}
           title={t('We found multiple products matching the part number you entered.')}
           cancelBtnText={t('Cancel')}
           confrimBtnText={t('Update cart')}
           onHide={props.onHide}
           onConfirm={props.handleUpdateCart}
           >
           <div className="multiple-items-modal">
                 <section>
                     <div className="row">
                         <div className="column">
                             <p className="multiple-items-modal__message--info">
                                 {t('Please select a product from the list below.')}
                             </p>
                         </div>
                     </div>
                     { props.productMap ? <ul className="multiple-items-modal__items-list">{productTiles}</ul> : null }
                 </section>
                 <div className="row">
                     <div className="column">
                         <p>
                         {t('Not seeing the right product?')}
                         <br/>
                         {t('Discard these products and enter a new part number in Quick Shop.')}
                         </p>
                     </div>
                 </div>
           </div>
        </IWModal>
    )
}
