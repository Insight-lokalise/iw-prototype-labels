const DELIMITER = ' - '

/**
 * Process a product description/title string into two parts (a title and a
 * subtitle) based on the following criteria:
 * 
 * 1. If the description contains no hyphens, then it is the title, and there
 *    is no subtitle.
 * 
 * 2. If the description contains only hyphens within the first ten characters
 *    ignore them.
 * 
 * 3. Split the description into a title and subtitle based on the first hyphen
 *    that is outside of the first ten charcters.
 */
export default function processTitle(title) {
  const pivot = title.indexOf(DELIMITER, 10)
  
  // There is no hyphen, so there is no subtitle.
  if (pivot === -1) {
    return {
      title,
      subtitle: null,
    }

  // There is a hyphen, so we split around it.
  } else {
    return {
      title: title.substring(0, pivot),
      subtitle: title.substring(pivot + DELIMITER.length),
    }
  }
}
