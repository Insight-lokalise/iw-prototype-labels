import React, { useEffect, useRef, useState } from 'react';
import { getSalesOrgMap } from '@api';
import { usePurpose } from '@context';
import { useFormContext } from '@components';
import {
	parseForm,
	populateGroup,
	retrieveAccountData,
	retrieveContactData,
	retrieveQuoteData,
	mapShipToValuesFromQuote
} from '@services/deal';
import UniversalGroup from './UniversalGroup';
import { FORM_FIELD_LABELS, SALES_ORG_TO_ID_MAP } from 'constants';

export default function UniversalGroups({
	groups,
	inputs,
	isEdit,
	passedPopulated,
	registerHandler,
	styles,
}) {
	const [lastGroupsModified, setGroupsModified] = useState('');
	const [populatedSelects, populateSelects] = useState({
		billToNumbers: [],
		contactNumbers: [],
		shipToNumbers: [],
		...passedPopulated,
	});
	const hasRetrievedValues = useRef(false);
	const prevFormValues = useRef({});

	const form = useFormContext();

	useEffect(() => {
		registerHandler(() => ({
			isFormValid: form.validateAll('', true),
			key: 'universal',
			passedValues: parseForm(form.getFormValues(), 'universal'),
		}))
	}, []);

	useEffect(() => {
		const fetch = async () => {
			const salesOrgs = await getSalesOrgMap();
			const salesOrgValues = Object.keys(salesOrgs).map(salesOrg => ({
				text: salesOrg,
			}));
			populateSelects(prev => ({ ...prev, salesOrgs: salesOrgValues }));
		}
		fetch();
	}, []);

	const values = (() => {
		if (hasRetrievedValues.current === true) {
			return form.getFormValues();
		}
		hasRetrievedValues.current = true;
		return isEdit ? form.getInitialValues() : form.getFormValues();
	})();

	const purpose = usePurpose();
	const purposeProps = purpose.getPurpose();
	const selectedCountry = purposeProps.selectedCountry;
	const isEMEA = !isEdit ? (selectedCountry.region === 'EMEA' || selectedCountry.region === 'EMEX') : false;

	const getNumber = (val) => parseInt(val.toString(), 10);
	const isSameAsPreviousValue = (value, previousValue) => previousValue && getNumber(previousValue) === getNumber(value);

	const handlers = {
		account: async ({ target: { name, value } }) => {
			const salesOrg = values[FORM_FIELD_LABELS.salesOrg];
			if (!value || !salesOrg || isSameAsPreviousValue(value, prevFormValues.current[name])) return;

			prevFormValues.current[name] = value;
			prevFormValues.current[FORM_FIELD_LABELS.quoteNumber] = '';
			form.resetFields([name, FORM_FIELD_LABELS.salesOrg, FORM_FIELD_LABELS.sapAccount]);
			const { newValues, populated } = await retrieveAccountData(value, salesOrg);
			form.updateFields(newValues);
			populateSelects(prev => ({ ...prev, ...populated }));
		},
		quote: async ({ target: { name, value }}) => {
			try {
                const salesOrgValue = values[FORM_FIELD_LABELS.salesOrg];
                const salesOrgId = SALES_ORG_TO_ID_MAP[salesOrgValue];
                if (!value || !salesOrgId || isSameAsPreviousValue(value, prevFormValues.current[name])) return;
 
                form.resetFields([name]);
                const { newValues, customerSoldto, salesOrg } = await retrieveQuoteData(value);
                if (customerSoldto) {
                    prevFormValues.current[name] = value;
                    prevFormValues.current[FORM_FIELD_LABELS.accountNumber] = customerSoldto;
                    const { populated } = await retrieveAccountData(customerSoldto, salesOrg);
                    const { mappedValue, shipToPresent } = mapShipToValuesFromQuote(populated.shipToNumbers, newValues);
                    const updatedValues = { ...newValues, [FORM_FIELD_LABELS.shipToNumber]: mappedValue};
                    if (!shipToPresent) {
                        populated.shipToNumbers = [ mappedValue, ...populated.shipToNumbers];
                    }
                    form.updateFields(updatedValues);
                    populateSelects(prev => ({ ...prev, ...populated }));
                }
            } catch (e) {
                console.warn(`Failed to fetch Quote/Account details: `,e);
            }
		},
		contact: async ({ target: { name, value } }) => {
			const populatedValues = await retrieveContactData(value, name.split('-')[0]);
			setGroupsModified(prev => [name.split('-')[0]]);
			form.updateFields(populatedValues);
		},
		field: ({ target: { name, value } }) => {
			setGroupsModified(prev => [name.split('-')[0]]);
		},
		populate: ({ target: { name, value } }) => {
			const [groupDisplay] = name.split('-');
			const populatedValues = populateGroup(value, groupDisplay, isEMEA);
			form.updateFields(populatedValues);
			setGroupsModified(prev => [name.split('-')[0]]);
		},
		removeArrayValue: (name, index) => {
			form.removeArrayValue(name, index);
		},
		rep: ({ target: { name, value } }) => {
			const [prefix] = name.split('-');
			setGroupsModified(prev => [prefix]);
		}
	}

	return (
		<div className="c-deal__groups is-universal">
			{groups.map(group => (
				<UniversalGroup
					group={group}
					handlers={handlers}
					inputs={inputs[group.id]}
					key={group.id}
					lastGroupsModified={lastGroupsModified}
					populatedSelects={populatedSelects}
					styles={styles}
					values={values}
				/>
			))}
		</div>
	)
}
