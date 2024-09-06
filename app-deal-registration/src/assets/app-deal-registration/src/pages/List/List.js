import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { compose } from '@insight/toolkit-utils'
import { Loading } from '@insight/toolkit-react'
import { activateForm, getActiveTemplates, getForms } from 'api'

import { EmptyList, Items } from './components'
import { INITIAL_LIST_STATE } from './constants'
import {
	addActiveItem,
	getFormApiArgs,
	sortByActiveItem,
	updateItemVersion
} from './helpers'
import { createToast } from './toasts'

export default class List extends Component {
	state = INITIAL_LIST_STATE

	async componentDidMount() {
		const purpose = this.props.purpose.getPurpose()
		const state = this.props.history.location.state
		const response = await (state && state.templates
			? getActiveTemplatesBySalesArea(purpose)
			: getForms(getFormApiArgs(purpose))	
		)
		if (response && !response.status && !response.error) {
			const items = sortByActiveItem(response)
			return this.setState({ isFetching: false, items })
		}
		this.setState({ isFetching: false })
	}

	goToBuilder = e => {
		this.props.history.push('/builder', { edit: false })
	}

	editItem = (item, id) => {
		this.props.purpose.updatePurposeKey({
			key: 'selectedForm',
			value: updateItemVersion(item, this.state.items)
		})
		this.props.history.push('/builder', { edit: true })
	}

	previewItem = item => {
		this.props.purpose.updatePurpose({ selectedForm: item })
		this.props.history.push('/preview')
	}

	setActive = async item => {
		this.setState({ isActivating: item.versionId })
		const response = await activateForm(item)
		if (response) {
			this.props.display.addToast(createToast('activate-form-success'))
			return this.setState(({ items }) => ({
				isActivating: false,
				items: addActiveItem(items)
			}))
		}

		this.props.display.addToast(createToast('active-form-failure'))
		this.setState({ isActivating: false })
	}

	render() {
		const { isActivating, isFetching, items } = this.state
		const classes = cn('c-list', {
			'is-empty': !items.length > 0,
			'is-fetching': isFetching
		})

		let content
		if (isFetching && !items.length > 0) {
			content = <Loading size="small" />
		} else if (!isFetching && !items.length > 0) {
			content = <EmptyList goToBuilder={this.goToBuilder} />
		} else {
			content = (
				<Items
					editItem={this.editItem}
					isActivating={isActivating}
					items={items}
					previewItem={this.previewItem}
					setActive={this.setActive}
				/>
			)
		}

		return <div className={classes}>{content}</div>
	}
}

