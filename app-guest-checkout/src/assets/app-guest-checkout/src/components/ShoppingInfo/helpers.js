//Groups carrier list based on 'carrier' attribute in each item
//returns {PGL:[{carrier1},{carrier2}], CEVA:[{carrier1},{carrier2}]}
import {fetchTaxAndEWRFee} from "../../api";
import {save as saveShoppingRequest} from "../../state/slices/shoppingRequestSlice";

export const groupByCarrier = (carrierOptionsArr) => {
  const resultObj = {}
  !!carrierOptionsArr?.length && carrierOptionsArr?.map((item) => {
    const key = item['carrier']
    const group = resultObj[key]
    if (!group) {
      resultObj[key] = [item]
    } else {
      group.push(item)
    }
  })
  return resultObj
}
//Used to sort the grouped carrier by price starting from the lowest
export const sortObjByPrice = (obj) => {
  const sortedObjects = []
  for (const key in obj) {
    const objects = obj[key]
    const sorted = objects.sort((a, b) => a.price - b.price)
    sortedObjects.push(...sorted)
  }
  return sortedObjects
}

/*
 * Gets address object mapping - matches keys and populates defaultAddress with values
 * params { defaultAddress: Object, source: object }
 * @return {Object} 
 * */
export function createAddressObject(defaultAddress, address) {
  for (let key in address) {
    if (key in defaultAddress) {
      defaultAddress[key] = address[key]
    }
  }
  //set countryId value as country
  return {
    ...defaultAddress,
    address1: address?.street1,
    address2: address?.street2,
    countryId:address?.country}
}

//To construct initial Address form values
export const createInitialFormValues = (addressObj) => {
  if (!Object.values(addressObj)?.length) return;
  return {
    companyName: addressObj?.companyName || addressObj?.attentionLine,
    street1: addressObj?.address?.address1,
    street2: addressObj?.address?.address2,
    street3: addressObj?.address?.address3 || '',
    state: addressObj?.address?.state,
    country: addressObj?.address?.countryId,
    attention: addressObj?.attentionLine,
    city: addressObj?.address?.city,
    zipCode: addressObj?.address?.zipCode,
    phoneNum: addressObj?.phone
  }
}

/**
 * Used to convert the list of emails as a string with comma separated values
 * @param {Array} emails 
 * @returns string
 */
export const normalizeEmailPayload = (emails) => {
  if(!emails?.length) return;
  return emails?.reduce((prev, acc) => {
    const email = `${prev} ${acc}`;
    return emails?.indexOf(acc) === emails.length - 1 ? email.trim() : `${email};`.trim()
  },'')
}


export function normalizeCarrierValue(carrier) {
    const carrierValue = {
        name: carrier.carrier || carrier.name,
        option: carrier.shippingCode || carrier.option || carrier.condition,
        saturday: !!(carrier.saturday || Number(carrier.saturdayDelivery)),
    }
    if (!carrierValue.name || !carrierValue.option) return

    return JSON.stringify(carrierValue)
};
export function getSelectedCarrier(allCarriers, name, code, saturday) {
        const currentCarrier = allCarriers.find(
            carrier => {
                return carrier.carrier == name && carrier.shippingCode === code && (carrier.saturdayDelivery!=="0") === saturday
            }
        )
        return currentCarrier;
    }
function createCarrierOption(carrierTabData, { name, option, saturday }) {
    if (!carrierTabData[name]) return undefined
    const availableOption = carrierTabData[name].find(optionData => optionData.shippingCode === option)
    return {
        description: availableOption && availableOption.shippingCondition,
        name,
        option,
        price: availableOption && availableOption.price,
        saturday: saturday || !!(availableOption && Number(availableOption.saturdayDelivery)),
    }
}
const  handleCarrierOptionSelect = (carrierOption, selectedCarrier = null) => {
    return { carrierOption, selectedCarrier }
    } 

export const selectCarrierOption = (value) => {
        const parsedValue = JSON.parse(value)
        const option = createCarrierOption(carrierTabData, parsedValue)
        const shippingOption = { name: option.name, code: option.option, saturday: option.saturday }
        const selectedCarrier = getSelectedCarrier(carriers, option.name, option.option, option.saturday)
        handleCarrierOptionSelect(option, selectedCarrier) //should call setter fn and save 'option' and 'selectedCarrier' to component state

    };
    export function createCarrierRequestBody(values) {
      const isUsingThirdParty = (values.billMyCarrier && !!values.thirdPartyCarrier)
      //filter out empty emails
      const concatEmails = (emails) => {
          if(!emails) {
              return ''
          }
          return emails.reduce((result, email) => {
              if(email !== "") {
                  result.push(email)
              }
              return result
          }, []).join(';')
      }
  
      const shipping = {
          carrier: {
              thirdPartyAccountNumber: isUsingThirdParty ? values.thirdPartyCarrier.carrierAccountNumber : '',
              thirdPartyDisplayName: isUsingThirdParty ? values.thirdPartyCarrier.carrierAccountDisplayValue : '',
              name: values.carrierOption.name,
              option: values.carrierOption.option,
              saturday: values.carrierOption.saturday,
              description: values.carrierOption.description,
              vasOptions: values.vasOptions
          },
          additionalShippingNotificationEmail: concatEmails(values.additionalEmails),
          notes: values.notes || '',
          shipComplete: values.shipComplete,
      }
      const cart = {
          summary: {
              shippingCost: isUsingThirdParty ? 0 : values.carrierOption.price,
          },
      }
  
      return {
          cart,
          shipping,
      }
  }
/**
 *  During address validation for guest, if the user inputs a valid address different from suggested SAP-modified version the api call fails
 *  when we validate a second time. The workaround is to compare that state,city,region, postalcode and country provided by user matches 
 *  that suggested by SAP. if true, then we don't revalidate a second time; we just update shoppingReq obj with the user-provided address.
 * @param {Object} inputAddress 
 * @param {Object} sapSuggesstedAddress 
 * @returns Boolean
 */
export function isValidSapAddress(inputAddress, sapSuggesstedAddress) {
  const propertiesToCheck = ["state","city","region", "country","postalcode"]
  for (let key in inputAddress) {
    if (!(propertiesToCheck.includes(key))) {
      continue
    }
    else if (key === "postalcode") {
      //This implementation is for sales org 2400, it will need to be worked on when we expand to other sales org
      if (inputAddress[key] !== sapSuggesstedAddress[key].substring(0, 5)) {
        return false;
      }
    } else if (sapSuggesstedAddress.hasOwnProperty(key)) {
      if (String(inputAddress[key]).toLowerCase() !== String(sapSuggesstedAddress[key]).toLowerCase()) {
        return false;
      }
    }
  }
  return true;
}

export const fetchTaxAndEWRFeeForTheCartItems = async (shoppingRequest) => {
  try {
    const response = await fetchTaxAndEWRFee(shoppingRequest)
    return response?.data;
  } catch (error) {
    console.error(error)
  }
}
