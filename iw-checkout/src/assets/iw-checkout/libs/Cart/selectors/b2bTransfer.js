import { createSelector } from 'reselect'
import get from 'lodash-es/get'
import reduce from 'lodash-es/reduce'

export const selector_cartTransfer = state => get(state, 'cartTransfer', {})

export const parseCommoditiesMap = cartTransfer => {
    const commodities = get(cartTransfer, 'commodities', [])
    return reduce(commodities, (items, commodity) =>{
        items[commodity.meterialId] = commodity
        return items
    }, {})
}

export const selector_commoditiesMap = createSelector(selector_cartTransfer, parseCommoditiesMap)
