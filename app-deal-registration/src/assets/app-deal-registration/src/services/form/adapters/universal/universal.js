import { SALES_ORGS } from '@constants';
import { ADDRESS_FIELDS, MISC_CURRENCY_FIELDS, POPULATABLE_SELECTS } from '../../constants';

// TODO: UNFINISHED. WILL BE DONE IN A LATER DIFF
export default function universalAdapter(field, context) {
    const { groupDisplay, handlers, populatedSelects, values } = context;
    const { display: fieldDisplay } = field; 
    const isSapAccount = values && values['dealInfo-sapAccount'] && values['dealInfo-sapAccount'] === 'No' ? false : true;

    field.name = `${groupDisplay}-${fieldDisplay}`
    if (fieldDisplay === 'notificationEmails') {
        field.name = `${field.name}[0]`;
    }

    if (fieldDisplay === 'salesOrg') {
        field.values = SALES_ORGS;
    }

    if (fieldDisplay === 'manufacturer' || fieldDisplay === 'program') {
        field.disabled = true;
        field.readOnly = true;
    }

    if (fieldDisplay === 'accountNumber') {
        field.onKeyPress = e => {
            if (e.key === 'Enter') {
                handlers['account'](e);
            }
        }
        field.handleBlur = e => {
            handlers['account'](e);
        }
    }

    if (fieldDisplay === 'quoteNumber') {
      field.onKeyPress = e => {
        if (e.key === 'Enter') {
          handlers['quote'](e);
        }
      }
      field.handleBlur = e => {
        handlers['quote'](e);
      }
    }

    if (groupDisplay === 'fieldRepInfo') {
        field.handleChange = handlers['rep'];
    }

    // This actually needs to apply to all conditional fields. 
    if (fieldDisplay === 'fieldRepEmail' || fieldDisplay === 'fieldRepName') {
        field.unregisterOnUnmount = true;
        field.removeValueOnUnmount = true;
    }

    // Force Expected Close Date to need to be today or later (only add validator if it doesn't exist
    if (fieldDisplay === 'expectedCloseDate' && !(field.validators && field.validators.find(v => v.type === 'asOf'))) {
        field.validators = [...(field.validators || []), { type: 'asOf' }];
    }

    if (ADDRESS_FIELDS.includes(field.label)) {
        // This actually needs to prompt to the UI? So, that is a little odd.
        field.handleChange = handlers['address'];
    }

    if (MISC_CURRENCY_FIELDS.includes(fieldDisplay)) {
        //field.format = value => formatCurrencyValue(value)
    }

    if (POPULATABLE_SELECTS.includes(fieldDisplay)) {
        const formattedDisplay = `${fieldDisplay}s`;
        field.handleChange = isSapAccount ? handlers['populate'] : handlers['field'];
        field.type = isSapAccount ? 'Select' : 'Text';

        if (populatedSelects[formattedDisplay] && populatedSelects[formattedDisplay].length > 0) {
            field.values = populatedSelects[formattedDisplay];
        }
    } else if (field.values && field.values.length > 0 && fieldDisplay !== 'salesOrg') {
        const splitter = fieldDisplay === 'contactNumber' ? ';' : ',';
        field.values = Array.isArray(field.values)
            ? field.values
            : field.values.split(splitter).filter(Boolean);
    }

    if (!field.handleChange) {
        field.handleChange = handlers['field'];
    }

    // TODO: Remove later once templatization is finalized
    if (fieldDisplay === 'targetSellPrice' || fieldDisplay === 'opptyRevAmt') {
        field.type = 'Number';
    }
    
    if (fieldDisplay === 'businessCase') {
        field.validators = [...(field.validators || []), { type: 'maxLength', value: 250 }];
    }
    
    return field;
}
