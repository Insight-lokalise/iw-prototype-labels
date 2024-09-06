const EMAIL_EXP = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function email() {
    return value => {
        const isInvalid = value && !EMAIL_EXP.test(value)
        if (isInvalid) {
            return `Sorry, please enter a valid email address`
        }
    }
}