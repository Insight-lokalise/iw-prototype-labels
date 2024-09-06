import React, { Component } from 'react'
import difference from 'lodash-es/difference'
import map from 'lodash-es/map'

import { t } from '@insight/toolkit-utils/lib/labels'
import generateUniqueId from '../../../libs/utils';
import { IWButton, IWLoading } from './../../../../libs/iw-components'
import { IWMessageBox, IWMessage } from './../../../../libs/iw-components/iw-messageBox'
import QuickShopMultipleItemsModal from './quickShopMultipleItemsModal'

class QuickShopView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            quantity: 1,
            // our api returns validatedMaterials including related items
            selectedMaterials: [],
        }
    }
    /**
     * clears quick shop form
     */
    clearForm() {
        this.refs.materialIds.value = ''
        this.refs.materialIds.blur()
        this.refs.quantity.value = 1
    }

    closeMultipleItemsModal() {
        this.setState({ quantity: 1, selectedMaterials: [] });
        const relatedMaterials = map(this.props.quickShop.relatedItems, item => item.materialId)
        let itemsToAdd = difference(this.props.quickShop.validatedMaterials.validMaterialIds, [...relatedMaterials])
        this.props.updateToCart(itemsToAdd, Number(this.state.quantity))
    }

    handleAddToQuickShop() {
        if (!this.refs.materialIds.value.trim()) return
        this.setState({ quantity: parseInt(this.refs.quantity.value, 10) });
        this.props.addToQuickShop(this.refs.materialIds.value, parseInt(this.refs.quantity.value, 10))
        this.clearForm()
    }


    handleUpdateCart() {
        // doing it once sounds like better since executed once
        // const relatedMaterials = reduce(this.props.quickShop.relatedItems, (acc, item)=> acc.concat([item.materialId]), [])
        const relatedMaterials = map(this.props.quickShop.relatedItems, item => item.materialId)
        // removing related items from validated list and add based on user selection
        let itemsToAdd = difference(this.props.quickShop.validatedMaterials.validMaterialIds, [...relatedMaterials])
        itemsToAdd = [...itemsToAdd, ...this.state.selectedMaterials]
        this.props.updateToCart(itemsToAdd, Number(this.state.quantity))
        this.setState({ quantity: 1, selectedMaterials: [] });
    }

    toggleItem(materialId) {
        const index = this.state.selectedMaterials.indexOf(materialId);
        if (index === -1) {
            this.setState({ selectedMaterials: [...this.state.selectedMaterials, materialId] })
        } else {
            this.state.selectedMaterials.splice(index, 1)
            this.setState({ selectedMaterials: this.state.selectedMaterials })
        }
    }

    render() {
        const materialId = generateUniqueId('quick-shop__materialID')
        const quantityId = generateUniqueId('quick-shop__quantity')
        /* we should not have relied on cart to show loading wheel when item is being added from quick shop.
         quick shop component already takes care of setting is loading flag to true, in in a special scenario like
         empty cart we are not showing loading wheel. loading wheel is added in cart component, where as in this case
         cart is not loaded. we are adding additional loading wheel in quick shop to handle this

         this was needed when adding software contractual parts as they take too long to add to cart. this looks like
         page is frozen
         */
        const { totalCount, isPending } = this.props.cart
        const showLoading = totalCount === 0 && isPending

        return (
          <div className="row is-collapse-child quick-shop">
            { showLoading &&
                    <IWLoading modal className="iw-loading__size-giant"></IWLoading>
            }
              <div className="columns">
                  <h4>{t('Quick shop')}</h4>
                  <p>
                    {t('Add items to your cart quickly. Separate part numbers by comma.')}
                  </p>
                  <div className="row row__gutter--tiny collapse align-middle">
                    <div className="columns large-6 medium-4 small-6">
                      <label className="show-for-sr" htmlFor={materialId}>{t('Item Material ID')}</label>
                      <input className="quick-shop__materialID no-margin-bot" ref="materialIds"
                        onKeyPress={(event) => event.which === 13 ? this.handleAddToQuickShop.call(this) : true }
                        type="text" id={materialId}/>
                    </div>
                    <div className="columns large-2 medium-1 small-2">
                      <label className="show-for-sr" htmlFor={quantityId}>{t('Quantity')}</label>
                      <input ref="quantity" type="number" defaultValue="1"
                        onKeyPress={(event) => event.which === 13 ? this.handleAddToQuickShop.call(this) : true }
                        className="quick-shop__quantity text-center no-margin-bot" id={quantityId}/>
                    </div>
                    <div className="columns small-4">
                      <IWButton className="small expanded no-margin-bot" type="button"
                        onClick={this.handleAddToQuickShop.bind(this)}>{t('Add')}</IWButton>
                    </div>
                  </div>
                  <IWMessageBox boxId='quick-shop' Content={props => <IWMessage {...props.messages[0]} />} />
              </div>

                   <QuickShopMultipleItemsModal
                       productMap={this.props.quickShop.relatedItems}
                       handleUpdateCart={this.handleUpdateCart.bind(this)}
                       toggleItem={this.toggleItem.bind(this)}
                       onHide={this.closeMultipleItemsModal.bind(this)}
                       isMultipleSKUFound={this.props.quickShop.isMultipleSKUFound}
                       />
          </div>
      )
    }
}

export default QuickShopView
