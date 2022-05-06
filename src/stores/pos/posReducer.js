export const newOrderReducer = (state = null, action) => {
    switch (action.type) {
        case 'order/add':
            return { ...state, ...action.payload }
        case 'order/close':
            return null
        default:
            return state
    }
}

export const selectCategorieReducer = (state = '', action) => {

    switch (action.type) {
        case 'categorie/select':
            return action.payload
        default:
            return state
    }
}

export const categorieItemsReducer = (state = [], action) => {

    switch (action.type) {
        case 'categorieItems/set':
            return { ...action.payload }
        default:
            return state
    }
}

export const ticketReducer = (state = null, action) => {
    switch (action.type) {
        case 'ticketOrders/set':
            return { ...state, ...action.payload }
        case 'ticketOrders/clear':
            return null
        case 'ticketOrders/add':
            return { ...state, ...action.payload }
        case 'ticketOrders/remove':
            return { ...state, ...action.payload }

        default:
            return state
    }
}

export const terminalIdReducer = (state = '', action) => {
    switch (action.type) {
        case 'terminalId/set':
            return action.payload
        default:
            return state
    }
}

export const errorMessageReducer = (state = '', action) => {
    switch (action.type) {
        case 'error/set':
            return action.payload
        case 'error/clear':
            return ''
        default:
            return state
    }
}