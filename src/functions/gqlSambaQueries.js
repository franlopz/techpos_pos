export const getTasks = (type) => {
    return `query m{getTasks(taskType:"${type}",isCompleted:false) { id, content,startDate, name, customData { name value }, identifier,contentText }}`
}

export const completeTask = (taskid) => {
    return `mutation m{updateTask(id:${taskid},task:{isCompleted:true}){isCompleted}}`
}

export const postBroadcastMessage = (msg) => {
    return `mutation M{postBroadcastMessage(message:"${msg}"){ message }}`
}

export const getUser = (pin) => {
    return `query m{getUser(pin:"${pin}") { name, userRole { name, isAdmin } }}`
}

export const addWaiterTask = (ttype, tname, tcontent, tident, tcustomData) => {
    return `mutation m {addTask (task:{taskType:"${ttype}",name:"${tname}",content:"${tcontent}",isCompleted:false,identifier:"${tident}",customData:${tcustomData}}){id,name,isCompleted,content,identifier,customData{name,value}}}`

}

export const refreshTicket = () => {
    return 'mutation m{postTicketRefreshMessage(id:0){id}}'
}

export const getMenu = (menuName) => {
    return `query m { getMenu(name: "${menuName}") { categories { id name color foreground image header menuId isFastMenu menuItems { id name color foreground image header caption categoryId productId portion quantity defaultOrderTags autoSelect automationCommand product { id name barcode groupCode price portions { id name productId price } tags { name value } } groupTags } } } }`
}

export const getOrderTags = (id, portion) => {
    return `query m1 { getOrderTagGroups(productId: ${id}, portion:"${portion}") { id name color max min hidden tags { id name color description header price rate filter maxQuantity } } }`
}

export const getEntityScreenItems = (entity) => {
    return `query {getEntityScreenItems(name:"${entity}"){name,caption,color,labelColor}}`
}

export const getTickets = (data) => {
    const { type, name } = data
    return `query q{ticket:getTickets(entities:{entityType:"${type}",name:"${name}"},isClosed:false){ id uid type number note date entities { id, name, type, typeId } orders { id, uid, name, productId, quantity, portion, price, priceTag, date, lastUpdateDate, number, user, locked, tags { tagName, tag, price, quantity, rate}, states{ stateName, state, stateValue } } states { stateName state } remainingAmount calculations { name calculationAmount } totalAmount tags { tagName tag } }}`

}

export const registerTerminal = (data, user) => {

    const { Terminal, Department, TicketType } = data

    return `mutation m{terminalId:registerTerminal(terminal:"${Terminal}",department:"${Department}",user:"${user}",ticketType:"${TicketType}")}`
}

export const createTerminalTicket = (terminalId) => {

    return `mutation {createTerminalTicket(terminalId:"${terminalId}"){id}}`
}

export const addOrderToTerminalTicket = (terminalId, order) => {

    const { name, quantity, portion } = order

    return `mutation m {addOrderToTerminalTicket(terminalId:"${terminalId}",productName:"${name}",quantity:${quantity},portion:"${portion}"){orders{uid}}}`
}

export const updateOrder = (terminalId, orderUid, orderTags) => {


    return `mutation m {updateOrderOfTerminalTicket(terminalId:"${terminalId}",orderUid:"${orderUid}",orderTags:${orderTags}){uid}}`
}

export const updateTicket = () => {

    return `mutation m {updateTerminalTicket(terminalId:"",note:"",states:[])}`
}

export const changeEntity = (terminalId, type, name) => {

    return `mutation m {changeEntityOfTerminalTicket (terminalId:"${terminalId}",type:"${type}",name:"${name}"){uid}}`
}

export const closeTerminalTicket = (terminalId) => {

    return `mutation m { closeTerminalTicket(terminalId:"${terminalId}")}`
}

export const loadTerminalTicket = (terminalId, tid) => {

    return `mutation m{ticket:loadTerminalTicket(terminalId:"${terminalId}",ticketId:"${tid}"){id}}`
}