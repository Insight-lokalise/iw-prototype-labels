import ROUTES from './../../../libs/routes'

export function handleSectionAndPageRedirect(history, setActiveIndex, route, activeIndex) {
    const accordionName = route === ROUTES.LINE_LEVEL ? 'LineLevel' : 'SBP'
    history.push({ pathname: route })
    setActiveIndex(accordionName, activeIndex)
}
