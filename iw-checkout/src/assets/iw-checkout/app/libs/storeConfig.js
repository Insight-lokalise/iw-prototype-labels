import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import promise from 'redux-promise-middleware'
import ReduxThunk from 'redux-thunk'

import form from '../../libs/businessContainerApps/cart/reducers/lineLevelFormReducerPlugin'
import initialState from './initialState'
import user from '../../libs/User/reducers'
import insight from '../../libs/Insight/reducers'
import flags from '../../libs/flags/reducers'
import insightApplicationData from '../../libs/InsightApplicationData/reducers'
import { messageBoxes } from './../../libs/iw-components/iw-messageBox/reducer'
import { DEP, cart, cartViewReducer as cartView } from './../../libs/Cart/reducers'
import { shoppingCartView } from './../ShoppingCart/reducers/shoppingCartViewReducer'
import { shipBillPayView } from './../ShipBillPay/reducers/shipBillPayReducer'
import { accordions } from './../../libs/iw-components/iw-accordion/reducer'
import { lineLevelView } from './../LineLevel/reducers'
import { orderMetaData } from './../../libs/OrderMetaData/Reducers'
import { shoppingRequest } from './../../libs/ShoppingRequest/reducers'
import { cartTransfer } from './../B2BReview/reducers/cartTransferReducer'

const reducers = combineReducers({
    user,
    insight,
    insightApplicationData,
    flags,
    cart,
    DEP,
    shoppingRequest,
    shoppingCartView,
    lineLevelView,
    orderMetaData,
    shipBillPayView,
    messageBoxes,
    cartView,
    form,
    accordions,
    cartTransfer,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(
    reducers,
    initialState,
    composeEnhancers(
        applyMiddleware(
            ReduxThunk,
            promise,
        )
    )
);
