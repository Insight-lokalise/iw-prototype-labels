const WEBSITE_EXP = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g

export default function website() {
    return value => {
        if (!value.match(WEBSITE_EXP)) {
            return 'Sorry, please enter a valid URL'
        }
    }
}