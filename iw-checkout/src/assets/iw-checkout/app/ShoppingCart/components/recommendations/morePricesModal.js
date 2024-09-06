import React, {Component} from 'react'
import { IWAnchor , IWImage } from '../../../../libs/iw-components'
import { t } from '@insight/toolkit-utils/lib/labels'
import { StockStatus } from '../../../../libs/businessContainerApps/cart/components/cartSFCs'
import {makeProductDetailURL, productImageToRender} from '../../../../libs/models/Products/'
import Currency from '@insight/toolkit-react/lib/Currency/Currency'
class MorePricesModal extends Component {

    constructor(props){
      super(props);
    }

    updateQuantity(){
        this.props.onUpdateQuantity(this.refs.quantity.value)
    }

    render(){
        const { contractDisplayInfo, moreContractInfo, image, description, longDescription, materialId, manufacturerPartNumber, manufacturerName, availabilityInfos, nonShipabble,  } = this.props.webProduct
        const itemURL = makeProductDetailURL({
            materialId,
            mfrName: manufacturerName,
            mfrId: manufacturerPartNumber,
            description,
        })
        const priceTiles = moreContractInfo.map(item => {
            return (<li className="more-prices-container__item" key={item.contractId}>
              <div className="row more-prices-container__item-row">
                  <div className="columns flex-child-shrink">
                      <input aria-label={item.contractId} name="warrantyItemRadio" id={item.contractId} className="more-prices-container__item-input"
                      defaultChecked ={contractDisplayInfo.contractId === item.contractId}
                      onClick={()=>this.props.onUpdateContract(item.contractId)} type="radio"/>
                  </div>
                  <div className="columns">
                        <div className="row">
                             <Currency
                               currencyCode={item.currency}
                               value={Number(item.contractPrice)} />
                             &nbsp;-&nbsp;
                             {item.contractTitle === 'OPENMARKETPRICELABEL'?
                                t('OPEN MARKET')
                             :
                                `${item.contractShortTitle || item.contractTitle} #${item.contractId}`
                             }
                        </div>
                  </div>
              </div>
            </li>)
        })
        const itemImage = productImageToRender(image)


      return (
              <div className="more-prices-modal">
                  <section>
                      <div>
                          <div className="row parent-product parent-product__border">
                              <div className="columns shrink">
                                  <IWImage className='parent-product__img' src={itemImage} alt={description} />
                              </div>
                              <div className="columns">
                                <div className="parent-product__desc">
                                    <div>
                                        <IWAnchor className='product-tile__name' target='_blank' href={itemURL}>
                                            {description}
                                        </IWAnchor>
                                    </div>
                                    <div>
                                        {t('Insight #')}: {materialId}
                                    </div>
                                    <div>
                                        {t('Mfr #')}: {manufacturerPartNumber}
                                    </div>
                                  </div>
                              </div>
                              <div className="columns small-2 flex-child-shrink">
                                  <div>{t('Qty')}</div>
                                  <div className="parent-product__qty">
                                      <label className="show-for-sr" htmlFor="parent-product__quantity">{t('Quantity')}</label>
                                      <input ref="quantity" type="number" defaultValue="1"
                                      onChange={()=>this.updateQuantity()}
                                        className="parent-product__quantity no-margin-bot" id="parent-product__quantity"/>
                                  </div>
                                  <div>
                                      <StockStatus
                                          nonShippable={nonShipabble}
                                          stock={availabilityInfos?.[0]?.stockAvailability || 0}
                                          quantity={this.props.quantity || 1} />
                                  </div>
                              </div>
                          </div>
                          <div className="row">
                              <div className="columns">
                                  { moreContractInfo.length>0 ? <ul className="more-prices-container__items-list">{priceTiles}</ul> : null }
                              </div>
                          </div>
                      </div>
                  </section>
              </div>
      )
    }
}

export default MorePricesModal
