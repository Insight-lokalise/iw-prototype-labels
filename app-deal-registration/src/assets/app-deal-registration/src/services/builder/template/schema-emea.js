import cuid from 'cuid'
import { SALES_ORGS } from '@constants'

// This is just the base tremplate copied from V1 of the builder. This is just for convenience. With sligh modificatins

const groups = [
	{
		display: 'dealInfo',
		name: 'Deal Info',
		inputs: [
			{
				display: 'manufacturer',
				name: 'universal-manufacturer',
				type: 'Text',
				label: 'Manufacturer',
			},
			{
				display: 'program',
				name: 'universal-program',
				label: 'Program',
				type: 'Text',
			},
			{
				display: 'salesOrg',
				name: 'universal-salesOrg',
				label: 'Sales Org',
				type: 'Text',
				validators: [{ type: 'required' }],
			},
			{
				display: 'opportunityNumber',
				name: 'universal-opportunityNumber',
				type: 'Text',
				label: 'Opportunity #',
			},
			{
				display: 'quoteNumber',
				name: 'universal-quoteNumber',
				type: 'Text',
				label: 'Quote #',
			},
			{
				display: 'sapAccount',
				name: 'universal-customerAccount',
				type: 'Dropdown',
				label: 'Customer Account',
				values: 'Yes,No',
				validators: [{ type: 'required' }],
			},
		],
	},
	{
		display: 'accountInfo',
		name: 'Account Info',
		inputs: [
			{
				display: 'accountNumber',
				name: 'universal-accountNumber',
				helpText:
					'Ensure you have picked the correct salesOrg before hitting enter',
				label: 'Account #',
				type: 'Text',
				validators: [{ type: 'required' }],
			},
			{
				display: 'accountName',
				name: 'universal-accountName',
				label: 'Account Name',
				type: 'Text',
				validators: [{ type: 'required' }],
			},
			{
				display: 'accountAddress',
				name: 'universal-accountAddress',
				label: 'Address',
				type: 'Text',
				validators: [{ type: 'required' }],
			},
			{
				display: 'accountAddressLine1',
				name: 'universal-accountAddressLine1',
				label: 'Address line 1',
				type: 'Text',
				validators: [],
			},
			{
				display: 'accountAddressLine2',
				name: 'universal-accountAddressLine2',
				label: 'Address line 2',
				type: 'Text',
				validators: [],
			},
			{
				display: 'accountCity',
				name: 'universal-accountCity',
				label: 'City',
				type: 'Text',
				validators: [{ type: 'required' }],
			},
			{
				display: 'accountZip',
				name: 'universal-accountZip',
				label: 'Postcode',
				type: 'Text',
				validators: [{ type: 'required' }],
			},
			{
				display: 'accountCountry',
				name: 'universal-accountCountry',
				label: 'Country',
				type: 'Text',
				validators: [{ type: 'required' }],
			},
		],
	},
	{
		display: 'shipTo',
		name: 'Delivery Address',
		inputs: [
			{
				display: 'shipToNumber',
				name: 'universal-shipToNumber',
				label: 'Ship-To #',
				type: 'Dropdown',
				validators: [],
				values: '',
			},
			{
				display: 'shipToName',
				name: 'universal-shipToName',
				label: 'Ship-To Name',
				type: 'Text',
				validators: [{ type: 'required' }],
			},
			{
				display: 'shipToStreet',
				name: 'universal-shipToStreet',
				label: 'Street',
				type: 'Text',
				validators: [{ type: 'required' }],
			},
			{
				display: 'shipToAddressLine1',
				name: 'universal-shipToAddressLine1',
				label: 'Address line 1',
				type: 'Text',
				validators: [],
			},
			{
				display: 'shipToAddressLine2',
				name: 'universal-shipToAddressLine2',
				label: 'Address line 2',
				type: 'Text',
				validators: [],
			},
			{
				display: 'shipToCity',
				name: 'universal-shipToCity',
				label: 'City',
				type: 'Text',
				validators: [{ type: 'required' }],
			},
			{
				display: 'shipToPostcode',
				name: 'universal-shipToPostcode',
				label: 'Postcode',
				type: 'Text',
				validators: [{ type: 'required' }],
			},
			{
				display: 'shipToCountry',
				name: 'universal-shipToCountry',
				label: 'Country',
				type: 'Text',
				validators: [{ type: 'required' }],
			},
		],
	},
	{
		display: 'contactInfo',
		name: 'Client Contact Info',
		inputs: [
			{
				display: 'contactNumber',
				name: 'universal-contactNumber',
				label: 'Contact Number',
				type: 'Dropdown',
				values: '',
			},
			{
				display: 'contactName',
				name: 'universal-contactName',
				label: 'Contact Name',
				type: 'Text',
				validators: [{ type: 'required' }],
			},
			{
				display: 'contactTitle',
				name: 'universal-contactTitle',
				label: 'Title',
				type: 'Dropdown',
				values:
					'Buyer,CEO,CIO,CTO,Controller,VP of IT,IT Director,Procurement Director,Procurement Manager,Network Admin,Sys/Admin,Database Admin,Security',
				validators: [{ type: 'required' }],
			},
			{
				display: 'contactDept',
				name: 'universal-contactDept',
				label: 'Dept',
				type: 'Dropdown',
				values: 'IT,Purchasing,Sales,Administration,Production,Finance,Legal',
				validators: [{ type: 'required' }],
			},
			{
				display: 'contactPhone',
				name: 'universal-contactPhone',
				label: 'Contact Phone',
				type: 'Text',
				validators: [{ type: 'required' },{ type: 'phone' }],
			},
			{
				display: 'contactExt',
				name: 'universal-contactExt',
				label: 'Contact Ext',
				type: 'Text',
			},
			{
				display: 'contactEmail',
				name: 'universal-contactEmail',
				label: 'Contact Email',
				type: 'Text',
				validators: [{ type: 'email' }],
			},
		],
	},
	{
		display: 'repInfo',
		name: 'Account Manager Info',
		inputs: [
			{
				display: 'repID',
				name: 'universal-repID',
				label: 'AM ID',
				type: 'Text',
				validators: [{ type: 'required' }],
			},
			{
				display: 'repName',
				name: 'universal-repName',
				label: 'AM Name',
				type: 'Text',
				validators: [{ type: 'required' }],
			},
			{
				display: 'repPhone',
				name: 'universal-repPhone',
				label: 'AM Phone',
				type: 'Text',
				validators: [{ type: 'required' },{ type: 'phone' }],
			},
			{
				display: 'repExt',
				name: 'universal-repExt',
				label: 'AM Ext',
				type: 'Text',
			},
			{
				display: 'repEmail',
				name: 'universal-repEmail',
				label: 'AM Email',
				type: 'Text',
				validators: [{ type: 'email' }],
			},
		],
	},
	{
		display: 'fieldRepInfo',
		name: 'Field AM Info',
		inputs: [
			{
				display: 'fieldRepInfo',
				name: 'universal-fieldRepInfo',
				label: 'Are you working with the manufacturer field AM?',
				type: 'Dropdown',
				values: 'Yes,No',
				validators: [{ type: 'required' }],
			},
			{
				conditionalGroups: [
					{
						conditionals: [
							{
								is: 'Yes',
								when: 'fieldRepInfo-fieldRepInfo',
							},
						],
						id: cuid(),
					},
				],
				display: 'fieldRepName',
				name: 'universal-fieldRepName',
				label: 'Field AM name',
				type: 'Text',
				validators: [
					{
						type: 'conditionalRequired',
						when: 'fieldRepInfo-fieldRepInfo',
						is: 'Yes',
					},
				],
			},
			{
				conditionalGroups: [
					{
						conditionals: [
							{
								is: 'Yes',
								when: 'fieldRepInfo-fieldRepInfo',
							},
						],
						id: cuid(),
					},
				],
				display: 'fieldRepEmail',
				name: 'universal-fieldRepEmail',
				label: 'Field AM Email',
				type: 'Text',
				validators: [
					{ type: 'email' },
					{
						type: 'conditionalRequired',
						when: 'fieldRepInfo-fieldRepInfo',
						is: 'Yes',
					},
				],
			},
		],
	},
	{
		display: 'notificationEmails',
		name: 'Insight Notification Email List',
		inputs: [
			{
				display: 'notificationEmails',
				name: 'universal-notificationEmails',
				label: 'Notification Emails',
				type: 'Text',
				validators: [{ type: 'email' }],
			},
		],
	},
	{
		display: 'misc',
		name: 'Misc',
		inputs: [
			{
				display: 'competition',
				name: 'universal-competition',
				label: 'Competition (Manufacturer)',
				type: 'Text',
				validators: [{ type: 'required' }],
			},
			{
				display: 'opptyRevAmt',
				name: 'universal-opptyRevAmt',
				label: 'Oppty Rev Amt',
				type: 'Text',
				validators: [{ type: 'required' }],
			},
			{
				display: 'expectedCloseDate',
				name: 'universal-expectedCloseDate',
				label: 'Expected Close Date',
				type: 'Date',
				validators: [{ type: 'required' }, { type: 'asOf' }],
				dateFormat: 'DD/MM/YYYY',
			},
			{
				display: 'probabilityOfClosing',
				name: 'universal-probabilityOfClosing',
				label: 'Probability of Closing',
				type: 'Dropdown',
				values: '10%,25%,50%,75%,100%',
				validators: [{ type: 'required' }],
			},
			{
				display: 'businessCase',
				name: 'universal-businessCase',
				label: 'Business Case',
				type: 'TextArea',
				validators: [{ type: 'required' }],
			},
			{
				display: 'opportunityType',
				name: 'universal-opportunityType',
				label: 'What kind of opportunity is this?',
				type: 'Radio',
				values:
					'New Opportunity, Renewal of existing agreement, Modification of existing agreement',
				validators: [{ type: 'required' }],
			},
		],
	},
	{ display: '', name: '', inputs: [] },
]

const modifiedSchema = groups.reduce((acc, group) => {
	const groupId = cuid()
	const inputs = group.inputs.map(({ name, ...rest }) => ({
		isConditional: false,
		id: `${groupId}-${cuid()}`,
		name,
		sets: [rest],
	}))
	return [
		...acc,
		{
			...group,
			id: groupId,
			isUniversal: true,
			inputs,
		},
	]
}, [])

export default modifiedSchema
