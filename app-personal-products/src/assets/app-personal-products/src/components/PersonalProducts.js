import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Loading } from '@insight/toolkit-react'

import { t } from '@insight/toolkit-utils'

import Header from './Header/Header'
import List from './List/List'

export default class PersonalProductsView extends Component {
	state = {
		isLoading: true
	}

	componentDidMount() {
		if (!this.props.productsList.length > 0) {
			this.props.getPersonalProductList().then(() => {
				this.setState({ isLoading: false })
			})
		}
	}

	updateFavoritesOrder = (start, end) => {

	}

	addItemToList = partNumber => {}

	renderContent() {
		const { isLoading } = this.state
		const { isInventorySearchEnabled, productsList } = this.props
		let content

		if (isLoading) {
			content = <Loading size="large" />
		} else if (!isLoading && productsList.length > 0) {
			content = (
				<div className="c-favorites__list">
					<List
						isInventorySearchEnabled={isInventorySearchEnabled} 
						productsList={productsList} 
					/>
				</div>
			)
		} else {
			content = (
				<div className="c-favorites__list--empty">
					<h3>{t('Your Personal Product List is currently empty')}</h3>
					<p>{t('Add products using the field above or visit a product detail page')}</p>
				</div>
			)
		}

		return content
	}

	render() {
		const content = this.renderContent()
		return (
			<section className="c-favorites">
				<Header addItemToList={this.addItemToList} />
				{content}
			</section>
		)
	}
}

PersonalProductsView.propTypes = {
	isInventorySearchEnabled: PropTypes.bool.isRequired,
	productsList: PropTypes.arrayOf(PropTypes.object).isRequired,
	getPersonalProductList: PropTypes.func.isRequired,
}
