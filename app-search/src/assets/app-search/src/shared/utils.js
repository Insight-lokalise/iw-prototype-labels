export const noOp = () => {};

export const scrollToTop = () => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })
}

export const splitFacets = (facets) => {
    //Only splits on commas not between double quotes.
    return facets.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
}

// check whether space or double quotation marks are present
export const containsSpaceOrDoubleQuote = (val) => val && (/\s/g.test(val) || val?.toString()?.includes('"'));
 
// escape double quotation marks
export const escapeDoubleQuotes = (optionValue) => optionValue?.toString()?.replace(/"/g, '\\"');
