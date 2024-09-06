import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Icon, Loading, ToastList } from '@insight/toolkit-react'

import { t } from '@insight/toolkit-utils'

import Header from './Header/Header'
import List from './List/List'

export default class PersonalProductsView extends Component {
	state = {
		isLoading: true,
    toasts: [],
	}

  componentDidMount() {
		if (!this.props.productsList.length > 0) {
			this.props.getPersonalProductList().then(() => {
				this.setState({ isLoading: false })
			})
		}
	}

	updateFavoritesOrder = (start, end) => {

    const productSequence = reorder(
      this.props.productSequence,
      start,
      end
    );
    const productsIDOrder = productSequence.map(p => p.id)
    this.props.updatePersonalProductsOrder({
      productSequence,
      productsIDOrder,
    })
	}

	removeItemFromList = item => {
	  this.props.removeFromPersonalProductsList(item).then(()=>{
      this.addToast({
        title: '',
        text:(
          <div>{t('Part deleted from your list.')}</div>
        ),
        id: 'deleted items',
        icon:'checkmark-circled',
        color: 'success',
      })
    })
  }

	renderContent() {
		const { isLoading } = this.state
		const {
			isAllValid,
      isBestPriceAvailable,
      isCOIAvailable,
      isCSIAvailable,
		  isInventorySearchEnabled,
			isPurchasingPopUpEnabled,
      isReservedAvailable,
			isYourPriceLabel,
      productsList,
      user,
		} = this.props
		const isIPS = !!user.ips
    let content

		if (isLoading) {
      content = <div className="u-text-center"><Loading size="large" /></div>
		} else if (!isLoading && productsList.length > 0) {
			content = (
				<div className="c-favorites__list">
        	<List
            addToast={this.addToast}
						isAllValid={isAllValid}
            isIPS={isIPS}
            isBestPriceAvailable={isBestPriceAvailable}
            isCOIAvailable={isCOIAvailable}
            isCSIAvailable={isCSIAvailable}
            isReservedAvailable={isReservedAvailable}
            isInventorySearchEnabled={isInventorySearchEnabled}
						isPurchasingPopUpEnabled={isPurchasingPopUpEnabled}
						isYourPriceLabel={isYourPriceLabel}
            productsList={productsList}
            removeFromPersonalProducts={this.removeItemFromList}
            updateFavoritesOrder={this.updateFavoritesOrder}
            />
				</div>
			)
		} else {
			content = (
				<div className="c-favorites__list--empty">
					<h5 className="c-favorites__list--empty--text">
						<Icon icon="alert"  title="info" />
						{t('Your Personal Product List is currently empty.')}
					</h5>
					<p className="c-favorites__list--message">{t('Add products using the field above or visit a product detail page.')}</p>
				</div>
			)
		}

		return content
	}

  addToast = toast => {
    this.setState({
      toasts: this.state.toasts.concat(toast)
    })
  }

  removeToast = removedToast => {
    this.setState(prevState => ({
      toasts: prevState.toasts.filter(({ id }) => id !== removedToast.id)
    }))
  }

	render() {
		const content = this.renderContent()
    const { toasts } = this.state
		return (
			<section className="c-favorites">
				<Header 
          addToast={this.addToast}
          toasts={toasts}
          dismissToast={this.removeToast}
        />
				{content}
			</section>
		)
	}
}

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

PersonalProductsView.propTypes = {
  isBestPriceAvailable: PropTypes.bool.isRequired,
  isCOIAvailable: PropTypes.bool.isRequired,
  isCSIAvailable: PropTypes.bool.isRequired,
  isReservedAvailable: PropTypes.bool.isRequired,
	isAllValid: PropTypes.bool.isRequired,
  isInventorySearchEnabled: PropTypes.bool.isRequired,
	isPurchasingPopUpEnabled: PropTypes.bool.isRequired,
	isYourPriceLabel: PropTypes.bool,
  productsList: PropTypes.arrayOf(PropTypes.object).isRequired,
  productSequence: PropTypes.arrayOf(PropTypes.object).isRequired,
  getPersonalProductList: PropTypes.func.isRequired,
  removeFromPersonalProductsList: PropTypes.func.isRequired,
  updatePersonalProductsOrder: PropTypes.func.isRequired,
	user: PropTypes.shape({
		/* key value pairs */
	}).isRequired,
}

PersonalProductsView.defaultProps ={
  isYourPriceLabel: false,
}
