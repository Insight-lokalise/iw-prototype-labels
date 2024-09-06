const parseSalesOrg = passedVal => {
    //GNA-8592: Deal Registration link for Smart to pass salesOrg as just the value only
    //If the passedVal is all numeric characters only, then no need to parse. It is already the salesOrg.
    if (/^[\d]+$/.test(passedVal)) {
        return passedVal
    } else {
        const values = passedVal.split(' ')
        const org = values[values.length - 1]
        return org.substring(0, org.length - 1)
    }
}

export default parseSalesOrg