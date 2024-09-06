import cuid from 'cuid'
import { SALES_ORGS } from '@constants'

// This is just the base tremplate copied from V1 of the builder. This is just for convenience. With sligh modificatins  

const groups = [
	{	
		display: 'dealInfo',
		name: 'Deal Info',
		inputs: [{
			display: 'manufacturer',
			name: 'universal-manufacturer',
			type: 'Text',
			label: 'Manufacturer',
		}, {
			display: 'program',
			name: 'universal-program',
			label: 'program',
			type: 'Text',
		}, {
			display: 'salesOrg',
			name: 'universal-salesOrg',
			label: 'Sales Org',
			type: 'Dropdown',
			values: SALES_ORGS,
			validators: [{ type: 'required' }]
		}, {
			display: 'quoteNumber',
			name: 'universal-quoteNumber',
			type: 'Text',
			label: 'Quote #',
		}, {
			display: 'sapAccount',
			name: 'universal-sapAccount',
			type: 'Dropdown',
			label: 'SAP Account',
			values: 'Yes,No',
			validators: [{ type: 'required' }]
		}]
	},
	{	
		display: 'accountInfo',
		name: 'Account Info',
		inputs: [{
			display: 'accountNumber',
			name: 'universal-accountNumber',
			helpText: 'Ensure you have picked the correct salesOrg before hitting enter',
			label: 'Account #',
			type: 'Text',
			validators: [{ type: 'required' }]
		}, {
			display: 'accountName',
			name: 'universal-accountName',
			label: 'Account Name',
			type: 'Text',
			validators: [{ type: 'required' }]
		}, {
			display: 'accountAddress',
			name: 'universal-accountAddress',
			label: 'Address',
			type: 'Text',
			validators: [{ type: 'required' }]
		}, {
			display: 'accountCity',
			name: 'universal-accountCity',
			label: 'City',
			type: 'Text',
			validators: [{ type: 'required' }]
		}, {
			display: 'accountState',
			name: 'univeral-accountState',
			label: 'State',
			type: 'Text',
			validators: [{ type: 'required' }],
		}, {
			display: 'accountZip',
			name: 'universal-accountZip',
			label: 'Zip',
			type: 'Text',
			validators: [{ type: 'required' }]
		},
		{
			display: 'accountCountry',
			name: 'universal-accountCountry',
			label: 'Country',
			type: 'Text',
			validators: [{ type: 'required' }]
		}]
	}, {
		display: 'shipTo',
		name: 'Ship To',
		inputs: [{
			display: 'shipToNumber',
			name: 'universal-shipToNumber',
			label: 'Ship-To #',
			type: 'Dropdown',
			validators: [{ type: 'required' }],
			values: ''
		}, {
			display: 'shipToName',
			name: 'universal-shipToName',
			label: 'Ship-To Name',
			type: 'Text',
			validators: [{ type: 'required' }]
		}, {
			display: 'shipToAddress',
			name: 'universal-shipToAddress',
			label: 'Address',
			type: 'Text',
			validators: [{ type: 'required' }]
		}, {
			display: 'shipToCity',
			name: 'universal-shipToCity',
			label: 'City',
			type: 'Text',
			validators: [{ type: 'required' }]
		}, {
			display: 'shipToState',
			name: 'universal-shipToState',
			label: 'State',
			type: 'Text',
			validators: [{ type: 'required' }]
		}, {
			display: 'shipToZip',
			name: 'universal-shipToZip',
			label: 'Zip',
			type: 'Text',
			validators: [{ type: 'required' }]
		}]
	}, {
		display: 'billTo',
		name: 'Bill To',
		inputs: [{
			display: 'billToNumber',
			name: 'universal-billToNumber',
			label: 'Bill-To Number',
			type: 'Dropdown',
			values: '',
			validators: [{ type: 'required' }]
		}, {
			display: 'billToName',
			name: 'universal-billToName',
			label: 'Bill-To Name',
			type: 'Text',
			validators: [{ type: 'required' }]
		}, {
			display: 'billToAddress',
			name: 'universal-billToAddress',
			label: 'Address',
			type: 'Text',
			validators: [{ type: 'required' }]
		}, {
			display: 'billToCity',
			name: 'universal-billToCity',
			label: 'City',
			type: 'Text',
			validators: [{ type: 'required' }]
		}, {
			display: 'billToState',
			name: 'universal-billToState',
			label: 'State',
			type: 'Text',
			validators: [{ type: 'required' }]
		}, {
			display: 'billToZip',
			name: 'universal-billToZip',
			label: 'Zip',
			type: 'Text',
			validators: [{ type: 'required' }]
		}]
	}, {
		display: 'contactInfo',
		name: 'Contact Info',
		inputs: [{
			display: 'contactNumber',
			name: 'universal-contactNumber',
			label: 'Contact Number',
			type: 'Dropdown',
			values: ''
		}, {
			display: 'contactName',
			name: 'universal-contactName',
			label: 'Contact Name',
			type: 'Text',
			validators: [{ type: 'required' }]
		}, {
			display: 'contactTitle',
			name: 'universal-contactTitle',
			label: 'Title',
			type: 'Dropdown',
			values: 'Buyer,CEO,CIO,CTO,Controller,VP of IT,IT Director,Procurement Director,Procurement Manager,Network Admin,Sys/Admin,Database Admin,Security',
			validators: [{ type: 'required' }]
		}, {
			display: 'contactDept',
			name: 'universal-contactDept',
			label: 'Dept',
			type: 'Dropdown',
			values: 'IT,Purchasing,Sales,Administration,Production,Finance,Legal',
			validators: [{ type: 'required' }]
		}, {
			display: 'contactPhone',
			name: 'universal-contactPhone',
			label: 'Contact Phone',
			type: 'Text',
			validators: [{ type: 'required' }, { type: 'phone' }]
		}, {
			display: 'contactExt',
			name: 'universal-contactExt',
			label: 'Contact Ext',
			type: 'Text'
		}, {
			display: 'contactEmail',
			name: 'universal-contactEmail',
			label: 'Contact Email',
			type: 'Text',
			validators: [{ type: 'required' }, { type: 'email' }]
		}]
	}, {
		display: 'repInfo',
		name: 'Rep Info',
		inputs: [{
			display: 'repID',
			name: 'universal-repID',
			label: 'Rep ID',
			type: 'Text',
			validators: [{ type: 'required' }]
		}, {
			display: 'repName',
			name: 'universal-repName',
			label: 'Rep Name',
			type: 'Text',
			validators: [{ type: 'required' }]
		}, {
			display: 'repPhone',
			name: 'universal-repPhone',
			label: 'Rep Phone',
			type: 'Text',
			validators: [{ type: 'required' }, { type: 'phone' }]
		}, {
			display: 'repExt',
			name: 'universal-repExt',
			label: 'Rep Ext',
			type: 'Text'
		}, {
			display: 'repEmail',
			name: 'universal-repEmail',
			label: 'Rep Email',
			type: 'Text',
			validators: [{ type: 'required' }, { type: 'email' }]
		}]
	}, {
		display: 'fieldRepInfo',
		name: 'Field Rep Info',
		inputs: [{
			display: 'fieldRepInfo',
			name: 'universal-fieldRepInfo',
			label: 'Are you working with the manufacturer field rep?',
			type: 'Dropdown',
			values: 'Yes,No',
			validators: [{ type: 'required' }]
		}, {
			conditionalGroups: [{
				conditionals: [{
					is: 'Yes',
					when: 'fieldRepInfo-fieldRepInfo'
				}],
				id: cuid()
			}],
			display: 'fieldRepName',
			name: 'universal-fieldRepName',
			label: 'Field Rep name',
			type: 'Text',
			validators: [{ type: 'conditionalRequired', when: 'fieldRepInfo-fieldRepInfo', is: 'Yes' }],
		}, {
			conditionalGroups: [{
				conditionals: [{
					is: 'Yes',
					when: 'fieldRepInfo-fieldRepInfo'
				}],
				id: cuid()
			}],
			display: 'fieldRepEmail',
			name: 'universal-fieldRepEmail',
			label: 'Field Rep Email',
			type: 'Text',
			validators: [{ type: 'email' }, { type: 'conditionalRequired', when: 'fieldRepInfo-fieldRepInfo', is: 'Yes'}]
		}]
	}, {
		display: 'notificationEmails',
		name: 'Insight Notification Email List',
		inputs: [{
			display: 'notificationEmails',
			name: 'universal-notificationEmails',
			label: 'Notification Emails',
			type: 'Text',
			validators: [{ type: 'email' }]
		}]
	}, {
		display: 'misc',
		name: 'Misc',
		inputs: [{
			display: 'competition',
			name: 'universal-competition',
			label: 'Competition (Manufacturer)',
			type: 'Text',
			validators: [{ type: 'required' }]
		}, {
			display: 'targetSellPrice',
			name: 'universal-targetSellPrice',
			label: 'Target Sell Price $',
			type: 'Number',
			validators: [{ type: 'required' }]
		}, {
			display: 'opptyRevAmt',
			name: 'universal-opptyRevAmt',
			label: 'Oppty Rev Amt $',
			type: 'Number',
			validators: [{ type: 'required' }]
		}, {
			display: 'expectedCloseDate',
			name: 'universal-expectedCloseDate',
			label: 'Expected Close Date',
			type: 'Date',
			validators: [{ type: 'required' }, { type: 'asOf'}]
		}, {
			display: 'probabilityOfClosing',
			name: 'universal-probabilityOfClosing',
			label: 'Probability of Closing',
			type: 'Dropdown',
			values: '10%,25%,50%,75%,100%',
			validators: [{ type: 'required' }]
		}, {
			display: 'businessCase',
			name: 'universal-businessCase',
			label: 'Business Case',
			type: 'TextArea',
			validators: [{ type: 'required' }, { type: 'maxLength', value: 250 }]
		}, {
			display: 'opportunityType',
			name: 'universal-opportunityType',
			label: 'What kind of opportunity is this?',
			type: 'Radio',
			values: 'New Opportunity, Renewal of existing agreement, Modification of existing agreement',
			validators: [{ type: 'required' }]
		}]
	}
]

const modifiedSchema = groups.reduce((acc, group) => {
    const groupId = cuid()
    const inputs = group.inputs.map(({ name, ...rest }) => ({
        isConditional: false,
        id: `${groupId}-${cuid()}`,
        name,
        sets: [rest]
    }))
    return [...acc, {
        ...group,
        id: groupId,
        isUniversal: true,
        inputs
	}]
}, [])

export default modifiedSchema