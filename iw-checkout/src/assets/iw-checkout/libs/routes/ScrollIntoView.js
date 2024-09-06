function ScrollIntoView(element, headerHeightCorrection = -10) {
    element.scrollIntoView()
    window.scrollBy(0, headerHeightCorrection)
}

export default ScrollIntoView
