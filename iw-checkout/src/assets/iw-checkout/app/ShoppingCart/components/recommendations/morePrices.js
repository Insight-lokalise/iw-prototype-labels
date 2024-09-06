import React, { Component } from 'react'
import { t } from '@insight/toolkit-utils/lib/labels'
import { IWAnchor , IWModal } from './../../../../libs/iw-components'
import MorePricesModal from './morePricesModal'

class MorePrices extends Component {
    constructor(props){
        super(props);
        this.state = {
              showMorePricesDialog: false,
              selectedWarranty: '',
              quantity: 1,
        }
    }

    componentDidMount() {
        this.onUpdateContract(this.props.webProduct.contractDisplayInfo.contractId)
    }

    onUpdateContract = contractId => {
        this.setState({
            selectedContract: contractId,
        })
    };

    onUpdateQuantity = qty => {
        this.setState({
            quantity: Number(qty),
        })
    };

    handleAddToCart = () => {
        this.props.onAddToCart([{
            materialID:  this.props.webProduct.materialId,
            quantity: this.state.quantity,
            contractID: this.state.selectedContract,
        }])
        this.setState({
            quantity: 1,
        })
        this.hideMorePricesDialog()
    };

    hideMorePricesDialog = () => {
        this.setState({
            showMorePricesDialog: false,
        })
    };

    showMorePricesDialog = () => {
        this.setState({
            showMorePricesDialog: true,
        })
    };

    render(){
      return (
          <div>
              <IWAnchor className='product-tile__more-prices__link' data-gtm-event = "morePrices-link" onClick={this.showMorePricesDialog}>
                  {t('More prices available')}
              </IWAnchor>
              <IWModal
                  backdropClassName='iw-dialog iw-dialog-backdrop'
                  showIf={this.state.showMorePricesDialog}
                  title={t('All contract prices for')}
                  cancelBtnText={t('Cancel')}
                  confrimBtnText={t('Add to cart')}
                  onHide={this.hideMorePricesDialog}
                  onConfirm={this.handleAddToCart}
                  >
                  <MorePricesModal
                    webProduct={this.props.webProduct}
                    onUpdateQuantity={this.onUpdateQuantity}
                    onUpdateContract={this.onUpdateContract}
                    quantity={this.state.quantity}
                    />
              </IWModal>
          </div>

      )
    }
}

export default MorePrices
