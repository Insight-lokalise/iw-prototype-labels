export default function isDateValid() {
    return date => {
        const dateArray = (date || '').split('/')
        const isInvalid = !(
            dateArray.length === 3 &&
            dateArray[0].length === 2 &&
            dateArray[1].length === 2 &&
            dateArray[2].length === 4
        )

        if (isInvalid) {
            return `Sorry, please enter your date in MM/DD/YYYY format`
        }
    }
}
