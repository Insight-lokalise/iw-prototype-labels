import React, { createElement, Component } from 'react'
import { debounce } from '@insight/toolkit-utils'
import InputDecorator from './LegacyDecorator'


export default class DebouncedInput extends Component {
	static defaultProps = {
		debounce: true,
		debounceTime: 250
	}

	lastValueProps = this.props.value
	state = {
		error: '',
		value: this.props.value
	}

	componentDidUpdate({ value, error }, prevState) {
		if (value !== this.props.value) {
			this.setState({
				value: this.props.value
			})
		}
		if (error !== this.props.error) {
			this.setState({
				error: this.props.error
			})
		}
	}

	dispatchDebouncedChange = debounce((e, error) => {
		const errorText = this.state.error;
		this.props.handleChange(e, error, errorText);
	}, this.props.debounceTime)

	dispatchChange = (e, error) => {
		this.props.handleChange(e, error)
	}

	handleBlur = e => {
	  const { validate, validateOnChange, handleBlur } = this.props
    if (validate && !validateOnChange) {
      const error = validate(e.target.value) || ''
      this.setError(error)
    }
    handleBlur && handleBlur(e)
  }

	handleChange = e => {
		const { required, validate, validateOnBlur } = this.props
		let error = ''
		if (validate && (!validateOnBlur || required)) {
			error = validate(e.target.value)
			this.setError(error)
		}

		this.setState({ value: e.target.value })
		this.props.debounce ? this.dispatchDebouncedChange(e, error) : this.dispatchChange(e, error)
	}

	setError = value => {
		if (!value && this.state.error) {
			this.setState({ error: '' })
		} else if ((value && !this.state.error) || (value && value !== this.state.error)) {
			this.setState({ error: value })
		}
	}

	render() {
		const {
			className,
			debounce,
			debounceTime,
			disabled,
			fieldComponent,
			error: errorProp,
			handleChange,
			name,
			validate,
			validateOnBlur,
			value: valueProp,
			showError,
			...rest
		} = this.props
		
		const { error, value } = this.state
		// for 'showError' as true, display error using error prop from parent, else fallback to the existing condition
		const passedError = (showError && errorProp) ? errorProp : (errorProp || !error) ? '' : error;

		const fieldProps = {
			className,
			disabled,
			error: passedError,
			name,
			onBlur: this.handleBlur,
			onChange: this.handleChange,
			value,
			...rest
		}

		return <InputDecorator fieldComponent={fieldComponent} fieldProps={fieldProps} />
	}
}
