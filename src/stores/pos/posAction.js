export const addOrder = payload => ({ type: 'order/add', payload })

export const closeOrder = () => ({ type: 'order/close' })

export const selectCategorie = (payload) => ({ type: 'categorie/select', payload })

export const setCategorieItems = (payload) => ({ type: 'categorieItems/set', payload })

export const setTicket = (payload) => ({ type: 'ticketOrders/set', payload })

export const clearTicketOrders = () => ({ type: 'ticketOrders/clear' })

export const addTicketOrder = (payload) => ({ type: 'ticketOrders/add', payload })

export const removeTicketOrder = (payload) => ({ type: 'ticketOrders/remove', payload })

export const setTerminalId = (payload) => ({ type: 'terminalId/set', payload })

export const setErrorMessage = (payload) => ({ type: 'error/set', payload })

export const clearErrorMessage = () => ({ type: 'error/clear' })