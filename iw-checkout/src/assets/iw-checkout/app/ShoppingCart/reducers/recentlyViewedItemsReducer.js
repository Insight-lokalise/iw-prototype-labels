import InitialState from '../../libs/initialState'
import { selectRecentlyViewedItems } from './../../../libs/Cart/selectors'

const FETCH_RECENTLY_VIEWED_ITEMS = 'FETCH_RECENTLY_VIEWED_ITEMS'

export default function recentlyViewedItems(state = selectRecentlyViewedItems(InitialState), { type, payload }) {
    switch (type) {
        default: return state
        case `${FETCH_RECENTLY_VIEWED_ITEMS}_PENDING`:
            return {
                ...state,
                isPending: true,
            }
        case `${FETCH_RECENTLY_VIEWED_ITEMS}_FULFILLED`:
            return {
                ...state,
                isPending: false,
                itemsByMaterialId: payload.products && payload.products.reduce((acc, product) => {
                    acc[product.materialId] = Object.assign({}, acc[product.materialId], product)
                    return acc
                }, Object.assign({}, state.itemsByMaterialId)),
                recentlyViewedItems: payload,
            }
    }
}
