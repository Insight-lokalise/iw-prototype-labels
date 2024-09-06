import InitialState from '../../libs/initialState'
import { selectRecommendedItems } from './../../../libs/Cart/selectors'

const FETCH_RECOMMENDED_ITEMS = 'FETCH_RECOMMENDED_ITEMS'
const FETCH_RECOMMENDED_ITEMS_ON_CART = 'FETCH_RECOMMENDED_ITEMS_ON_CART'


export default function recommendedItems(state = selectRecommendedItems(InitialState), { type, payload }) {
    switch (type) {
        default: return state
        case `${FETCH_RECOMMENDED_ITEMS}_PENDING`:
            return {
                ...state,
                isPending: true,
            }
        case FETCH_RECOMMENDED_ITEMS_ON_CART: {
            const { placementId } = payload || {}
            return {
                ...state,
                isPending: false,
                [placementId]: payload,
            }
        }

    }
}
