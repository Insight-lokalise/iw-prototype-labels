import ROUTES from './index'

export function navigateToSection(history, sectionName, setActiveIndex){
    const {
        pathname,
        accordionName = null,
        activeIndex = null,
    } = determineRoute(sectionName)

    if(history.location.pathname !== pathname){
        history.push({ pathname })
    }

    if(accordionName && activeIndex !== null){
        setActiveIndex(accordionName, activeIndex)
    }
}

export function determineRoute(sectionName) {
    // @todo remove disable_feature_payment after pack one is merged with develop
    const disable_feature_payment = false
    switch(sectionName){
        case 'HEADERLEVEL':
            return {pathname: ROUTES.LINE_LEVEL, accordionName:'LineLevel', activeIndex: 0}
        case 'LINELEVEL':
            return {pathname: ROUTES.LINE_LEVEL, accordionName:'LineLevel', activeIndex: 1}
        case 'SHIPPING':
            return {pathname: ROUTES.SHIP_BILL_PAY, accordionName:'SBP', activeIndex: 0}
        case 'CARRIER':
            return {pathname: ROUTES.SHIP_BILL_PAY, accordionName:'SBP', activeIndex: 1}
        case 'BILLING':
            return {pathname: ROUTES.SHIP_BILL_PAY, accordionName:'SBP', activeIndex: 2}
        case 'PAYMENT':{
          return disable_feature_payment ? {pathname: ROUTES.SHIP_BILL_PAY, accordionName:'SBP', activeIndex: 3} :
           {pathname: ROUTES.PLACE_ORDER, accordionName:'Review', activeIndex: 9}
        }
        case 'REVIEW':
            return {pathname: ROUTES.PLACE_ORDER, accordionName:'Review', activeIndex: 9}
        default:
            return {pathname: ROUTES.VIEW_CART}
    }
}
