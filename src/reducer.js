import { createStore, combineReducers, applyMiddleware } from 'redux';
import { newOrderReducer, selectCategorieReducer, categorieItemsReducer, ticketReducer, terminalIdReducer, errorMessageReducer } from './stores/pos/posReducer';
import thunk from 'redux-thunk'
import { sambaUserReducer } from './stores/samba/sambaReducer';
import { composeWithDevTools } from '@redux-devtools/extension';

const reducer = combineReducers({
    newOrder: newOrderReducer,
    selectedCategorie: selectCategorieReducer,
    categorieItems: categorieItemsReducer,
    ticket: ticketReducer,
    sambaUser: sambaUserReducer,
    terminalId: terminalIdReducer,
    errorMessage: errorMessageReducer
});

const args = [reducer, composeWithDevTools(applyMiddleware(thunk))]

export const store = createStore(...args)