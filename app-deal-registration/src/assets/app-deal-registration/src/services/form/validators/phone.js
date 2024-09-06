const PHONE_EXP = /\s|^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im

export default function phone() {
    return value => {
        const isInvalid = value && !PHONE_EXP.test(value)
        if (isInvalid) {
            return 'Sorry, please enter a valid phone number'
        } 
    }
}
