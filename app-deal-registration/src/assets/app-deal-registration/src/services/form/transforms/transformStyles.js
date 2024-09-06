export default function transformStyles(styles, type) {
    return Object.keys(styles).reduce((acc, key) => {
        const style = styles[key]
        return `${acc} c-deal__${type}--${style}`
    }, '')
}