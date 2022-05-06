export const sambaUserReducer = (state = null, action) => {
    switch (action.type) {
        case 'sambaUser/login':
            return { ...state, ...action.payload }
        case 'sambaUser/logout':
            return null
        default:
            return state
    }
}