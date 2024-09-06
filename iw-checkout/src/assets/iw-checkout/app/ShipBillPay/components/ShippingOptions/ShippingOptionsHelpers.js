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
* Creates a normal value from a source carrier description from either
 * a service or the ShoppingRequest.
 * The value is then stringified for consumption by radio inputs.
 * @return {String}         Stringified {name: String, option: String}
 */
export function normalizeCarrierValue(carrier) {
    const carrierValue = {
        name: carrier.carrier || carrier.name,
        option: carrier.shippingCode || carrier.option || carrier.condition,
        saturday: !!(carrier.saturday || Number(carrier.saturdayDelivery)),
    }
    if (!carrierValue.name || !carrierValue.option) return

    return JSON.stringify(carrierValue)
}

/**
 * Regular keyboard input passes through but if longer content is pasted in, we
 * parse it as a semicolon-separated list of emails.
 * @param  {String} value typically a single character input from the keyboard.
 *                        If input was pasted, might be a semicolon-separated list
 *                        of emails that we need to spread to new input fields.
 */
export function handleEmailInput(fields, index, event, value) {
    if (value.length > 6 && value.includes(';')) {
        event.preventDefault()
        const emails = value.split(';')
            .filter(email => !!email)
            .map(email => email.trim())
        fields.remove(index)
        fields.insert(index, emails[0])
        emails.slice(1).forEach(fields.push)
    }
}
