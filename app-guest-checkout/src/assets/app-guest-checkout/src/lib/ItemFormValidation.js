import { validateEmail } from '@insight/toolkit-utils/lib/helpers/validators'
import { t } from "@insight/toolkit-utils/lib/labels";
import { rewrite } from './Helpers'

export function formValidation(formValues, id, materialID, requiredLineLevelFields){
  const errors = {}
  requiredLineLevelFields.map(field => {
    if(!formValues[`${field.name}__${id}`]){
      const fieldName = rewrite(field.name)
      errors[`${field.name}__${id}`] = t(`Please enter ${fieldName}`)
    }
    // if(!formValues[`countryUsage_${materialID}`]){
    //   errors[`countryUsage_${materialID}`] = t('Please select Country of usage.')
    // }
    if(!formValues[`CONTACT_EMAIL__${id}`]){
      errors[`CONTACT_EMAIL__${id}`] = t('Please enter a valid email address.')
    }else if(formValues[`CONTACT_EMAIL__${id}`] !== ''){
      const inValid = !validateEmail(formValues[`CONTACT_EMAIL__${id}`])
      if(inValid) errors[`CONTACT_EMAIL__${id}`] = t('Please enter a valid email address.')
    }
  })
  return errors
}
