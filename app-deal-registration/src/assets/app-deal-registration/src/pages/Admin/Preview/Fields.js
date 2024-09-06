// Adds comment for diff
import React, { Component } from 'react';
import { Button, Loading } from '@insight/toolkit-react';
import { DebouncedInput } from '@components';
import { formatDate } from 'lib';
import { DATE_FORMATTER, COMPLETION_STATUS_OPTIONS } from '../constants';
import { isDateField, getDefaultState, isFieldRequired, ERROR_TEXTS, FIELD_LIST } from '../helpers';
import { FieldError } from '@insight/toolkit-react/lib/Form/Components/Decorators';

const {
	DEAL_REG_ID_NUM,
	ALTERNATE_DEAL_REG_NUM,
	SUBMITTED_DATE,
	EXPIRATION_DATE,
	CLOSED_DATE,
	APPROVED_DATE,
	REJECTED_DATE,
	APPROVAL_STATUS,
	DENIED_REASON_CODE,
	BOTNOTES,
	NOTES
} = FIELD_LIST;

export default class Fields extends Component {

	state = getDefaultState(this.props);

	componentDidUpdate({ id }) {
		if (this.props.id !== id) {
			this.setState({ ...getDefaultState(this.props) });
		}
	}

	handleFieldChange = ({ target: { name, value } }, error, errorText = '') => {
		const { errors, errorMessage } = this.state;
		const newErrors = {
			...errors,
			[name]: errorText,
		}
		const hasErrors = Object.values(newErrors).some(error => error);
		this.setState({
			[name]: isDateField(name) ? formatDate(value, DATE_FORMATTER) : value,
			errors: newErrors,
			...(errorMessage && !hasErrors && { errorMessage: null })
		});
	}

	checkIfInvalidFields = () => {
		let fieldErrors = {};
		const state = this.state;
		const invalid = Object.keys(FIELD_LIST).some((item) => {
			const field = FIELD_LIST[item];
			const { name: fieldName, validate } = field;
			const fieldValue = state[fieldName];

			// Validate field
			const errorText = validate && validate(fieldValue, state);
			if(errorText) {
				fieldErrors = {
					...fieldErrors,
					[fieldName]: errorText,
				}
				return true;
			}
		});

		return {
			invalid,
			fieldErrors
		}
	}

	setErrorMessage = (fieldErrors = {}) => {
		const { errors } = this.state;
		this.setState({
			...this.state,
			...(fieldErrors && {
				errors: {
					...errors,
					...fieldErrors
				}
			}),
			errorMessage: ERROR_TEXTS.PROVIDE_VALID_VALUES,
		});
	}

	updateFields = () => {
		const { invalid, fieldErrors } = this.checkIfInvalidFields();
		if(invalid) {
			this.setErrorMessage(fieldErrors);
			return;
		}
		if (this.state.approvalStatus !== 'Denied') {
			this.state.deniedReasonCode = 0;
		}
		this.props.updateFields(this.state);
	}

	render() {
		const {
			alternateDealRegNum,
			approvedDate,
			botnotes,
			closedDate,
			dealRegIdNum,
			errors,
			errorMessage,
			expirationDate,
			notes,
			rejectedDate,
			submittedDate,
			approvalStatus,
			deniedReasonCode
		} = this.state;
		const { isSubmitting } = this.props;

		return (
			<div className='c-admin-preview__fields'>
				<div className='c-admin-preview__group'>
					<DebouncedInput
						fieldComponent={DEAL_REG_ID_NUM.fieldComponent}
						handleChange={this.handleFieldChange}
						label={DEAL_REG_ID_NUM.label}
						name={DEAL_REG_ID_NUM.name}
						required={isFieldRequired(DEAL_REG_ID_NUM.name, this.state)}
						validate={(value) => DEAL_REG_ID_NUM.validate(value, this.state)}
						value={dealRegIdNum}
						error={errors[DEAL_REG_ID_NUM.name]}
						showError
					/>
					<DebouncedInput
						fieldComponent={ALTERNATE_DEAL_REG_NUM.fieldComponent}
						handleChange={this.handleFieldChange}
						label={ALTERNATE_DEAL_REG_NUM.label}
						name={ALTERNATE_DEAL_REG_NUM.name}
						value={alternateDealRegNum}
					/>
					<DebouncedInput
						fieldComponent={SUBMITTED_DATE.fieldComponent}
						handleChange={this.handleFieldChange}
						label={SUBMITTED_DATE.label}
						name={SUBMITTED_DATE.name}
						required={isFieldRequired(SUBMITTED_DATE.name, this.state)}
						validate={(value) => SUBMITTED_DATE.validate(value, this.state)}
						value={submittedDate || ''}
						error={errors[SUBMITTED_DATE.name]}
						showError
					/>
					<DebouncedInput
						fieldComponent={EXPIRATION_DATE.fieldComponent}
						handleChange={this.handleFieldChange}
						label={EXPIRATION_DATE.label}
						name={EXPIRATION_DATE.name}
						validate={(value) => EXPIRATION_DATE.validate(value, this.state)}
						value={expirationDate || ''}
						error={errors[EXPIRATION_DATE.name]}
						showError
					/>
				</div>
				<div className='c-admin-preview__group'>
					<DebouncedInput
						fieldComponent={CLOSED_DATE.fieldComponent}
						handleChange={this.handleFieldChange}
						label={CLOSED_DATE.label}
						name={CLOSED_DATE.name}
						validate={(value) => CLOSED_DATE.validate(value, this.state)}
						value={closedDate || ''}
						error={errors[CLOSED_DATE.name]}
						showError
					/>
					<DebouncedInput
						fieldComponent={APPROVED_DATE.fieldComponent}
						handleChange={this.handleFieldChange}
						label={APPROVED_DATE.label}
						name={APPROVED_DATE.name}
						required={isFieldRequired(APPROVED_DATE.name, this.state)}
						validate={(value) => APPROVED_DATE.validate(value, this.state)}
						value={approvedDate || ''}
						error={errors[APPROVED_DATE.name]}
						showError
					/>
					<DebouncedInput
						fieldComponent={REJECTED_DATE.fieldComponent}
						handleChange={this.handleFieldChange}
						label={REJECTED_DATE.label}
						name={REJECTED_DATE.name}
						validate={(value) => REJECTED_DATE.validate(value, this.state)}
						value={rejectedDate || ''}
						error={errors[REJECTED_DATE.name]}
						showError
					/>
					<DebouncedInput
						fieldComponent={APPROVAL_STATUS.fieldComponent}
						handleChange={this.handleFieldChange}
						label={APPROVAL_STATUS.label}
						name={APPROVAL_STATUS.name}
						options={COMPLETION_STATUS_OPTIONS}
						value={approvalStatus}
					/>
						{(approvalStatus === 'Denied') && (
							<DebouncedInput
								fieldComponent={DENIED_REASON_CODE.fieldComponent}
								handleChange={this.handleFieldChange}
								label={DENIED_REASON_CODE.label}
								name={DENIED_REASON_CODE.name}
								options={this.props.deniedReasonsOptions}
								value={deniedReasonCode}
							/>
						)}
				</div>
				<div className='c-admin-preview__group--notes'>
					<DebouncedInput
						fieldComponent={BOTNOTES.fieldComponent}
						handleChange={this.handleFieldChange}
						label={BOTNOTES.label}
						name={BOTNOTES.name}
						value={botnotes}
					/>
					<DebouncedInput
						fieldComponent={NOTES.fieldComponent}
						handleChange={this.handleFieldChange}
						label={NOTES.label}
						name={NOTES.name}
						value={notes}
					/>
				</div>
				<div className='c-admin-preview__submit'>
					{errorMessage &&
						<FieldError id={`error-${errorMessage}`} showErrorIcon>
							{errorMessage}
						</FieldError>}
					<Button color='primary' onClick={this.updateFields}>
						{isSubmitting ? <Loading size='s' /> : <span>Save</span>}
					</Button>
				</div>
			</div>
		)
	}
}
