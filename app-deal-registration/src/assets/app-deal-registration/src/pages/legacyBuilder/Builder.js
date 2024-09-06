import React, { createRef, Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from '@insight/toolkit-utils'

import { ErrorBoundary } from 'components'
import { withEvents, withPurpose } from 'pages/shared'
import { clearFormState, loadForm } from 'state/modules/builder'

import Manager from './Manager'
import Header from './Header/Header'
import Fields from './NewFields/Fields'
import Layout from './NewLayout/Layout'
import Finalize from './Finalize/Finalize'
import Fab from './Footer/Fab'

import 'react-day-picker/lib/style.css'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

export class Builder extends Component {
	constructor(props) {
		super(props)
		this.builder = createRef()
		this.locationState = props.history.location.state
		this.state = {
			activeStep: 1,
			isDisabled: false,
			isFetching: this.locationState && this.locationState.edit || false
		}
	}

	componentDidMount() {
		this.props.emitter.on('heightChange', this.handleHeightChange)
		if (this.locationState.edit) {
			this.props.loadForm(this.props.purpose.selectedForm)
		}

		this.setState({ isFetching: false })
	}

	componentWillUnmount() {
		this.props.emitter.removeListener('heightChange', this.handleHeightChange)
	}

	clearForm = () => {
		this.props.clearForm()
		if (this.state.activeStep !== 1) {
			this.setState({ activeStep: 1 })
		}
	}

	onStepClick = idx => {
		this.setState({ activeStep: idx })
	}

	goToPrevStep = () => {
		this.setState(({ activeStep }) => ({
			activeStep: activeStep - 1
		}))
	}

	goToList = () => {
		this.props.history.push('/list', {
			templates: !!this.locationState.templates
		})
	}

	handleHeightChange = () => {
		const builder = this.builder.current
		const height = builder.clientHeight
		window.requestAnimationFrame(() => {
			const scrollHeight = builder.scrollHeight
			if (scrollHeight > height) {
				builder.scrollTop = (scrollHeight - height)
			}
		})
	}
	
	renderContentForStep = () => {
		const { locationState } = this
		const { activeStep } = this.state
		const { emitter } = this.props

		switch (activeStep) {
			case 1:
				return <Fields emitter={emitter} isTemplate={locationState.templates || false} />
				break
			case 2:
				if (locationState.templates) {
					return <Finalize emitter={emitter} goToList={this.goToList} isEdit={locationState.edit || false} isTemplate />
				}
				return <Layout emitter={emitter} isEdit={locationState.edit || false} />
				break
			case 3:
				return <Finalize emitter={emitter} goToList={this.goToList} isEdit={this.locationState.edit || false} isTemplate={this.locationState.templates || false } />
				break
			default:
				return null
		}
	}

	render() {
		const { activeStep, isDisabled, isFetching } = this.state
		const { location } = this.props.history
		if (isFetching) {
			return <div>Loading</div>
		}

		return (
			<section className="c-builder">
				<Manager activeStep={activeStep} emitter={this.props.emitter} handleStepClick={this.onStepClick} />
				<div className="c-builder__content" ref={this.builder}>
					<Header
						activeStep={activeStep}
						emitter={this.props.emitter}
						goToPrevStep={this.goToPrevStep}
						handleStepClick={this.onStepClick}
						isDisabled={isDisabled}
						isEdit={this.locationState.edit || false}
						isTemplate={this.locationState.templates || false}
					/>
					{this.renderContentForStep()}
					<Fab activeStep={activeStep} emitter={this.props.emitter} />
				</div>
			</section>
		)
	}
}

const mapDispatchToProps = dispatch => ({
	loadForm: form => dispatch(loadForm(form))
})

export default compose(
	withPurpose,
	withEvents,
	connect(null, mapDispatchToProps)
)(Builder)
