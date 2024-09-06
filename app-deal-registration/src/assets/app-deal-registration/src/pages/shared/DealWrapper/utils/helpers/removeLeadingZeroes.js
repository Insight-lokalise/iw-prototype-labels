const removeLeadingZeroes = (value) => {
    return value && value.replace(/\b0+/g, '');
}

export default removeLeadingZeroes;