import React from 'react'
import '../../styles/styles.css'
import { useDispatch, useSelector } from 'react-redux'
import round from '../../functions/round'
import { gqlQuery } from '../../functions/gqlSambaMethods'
import { addOrderToTerminalTicket, changeEntity, closeTerminalTicket, createTerminalTicket, loadTerminalTicket, refreshTicket, updateOrder } from '../../functions/gqlSambaQueries'
import { clearTicketOrders } from '../../stores/pos/posAction'
import toast from 'react-hot-toast'

const FooterPos = () => {

    const ticket = useSelector(state => state.ticket)
    const terminalId = useSelector(state => state.terminalId)
    const dispatch = useDispatch()

    const closingTicket = async () => {
        const orders = ticket.orders
        let newOrderIndex = 0
        const newOrders = orders.filter(order => order.date === undefined)
        const oldOrders = orders.filter(order => order.date !== undefined)
        let loadingClosingTicket = null;
        if (newOrders.length > 0) {

            loadingClosingTicket = toast.loading('Enviando órdenes...')

            for (let order of newOrders) {
                // setLoader(true)
                try {
                    if (newOrderIndex === 0 && oldOrders.length === 0) {
                        await gqlQuery(createTerminalTicket(terminalId))
                        let entities = ticket.entities
                        for (let entity of entities) {
                            await gqlQuery(changeEntity(terminalId, entity.type, entity.name))
                        }
                    }

                    if (newOrderIndex === 0 && oldOrders.length > 0) {
                        await gqlQuery(loadTerminalTicket(terminalId, ticket.id))
                    }

                    let addOrderResponse = await gqlQuery(addOrderToTerminalTicket(terminalId, order))
                    let orderUid = addOrderResponse.data.addOrderToTerminalTicket.orders
                    let orderUidLength = orderUid.length
                    if (order.tags.length > 0) {
                        await gqlQuery(updateOrder(terminalId,
                            orderUid[orderUidLength - 1]['uid'],
                            JSON.stringify(order.tags).replace(/"(\w+)":/g, '$1:')))
                    }

                    newOrderIndex++
                    if (newOrderIndex === newOrders.length) {
                        let closeTicketResponse = await gqlQuery(closeTerminalTicket(terminalId))
                        await gqlQuery(refreshTicket())
                        if (closeTicketResponse?.errors === null) {
                            // setSuccess(true)
                            // setLoader(false)
                            // await onPosCloseClick()
                            dispatch(clearTicketOrders())
                        }
                    }
                    toast.dismiss(loadingClosingTicket)
                    toast.success('Órdenes enviadas')
                }
                catch (e) {
                    toast.dismiss(loadingClosingTicket)
                    toast.error('Error al enviar órdenes')
                    throw ('Error al enviar órdenes')
                    // setLoader(false)
                    // setFail(true)
                }
            }

        }

        if (newOrders.length === 0); dispatch(clearTicketOrders())//onPosCloseClick()
        // toast.dismiss();
    }

    const getTotal = () => {
        let totalTicket = 0

        for (let order of ticket.orders) {
            let totalOrder = parseFloat(order.price)
            for (let tag of order.tags) {
                if (tag.rate !== 0) {
                    totalOrder = parseFloat(totalOrder) * (1 + tag.rate / 100 * tag.quantity)
                } else {
                    totalOrder = parseFloat(totalOrder) + ((tag.price * tag.quantity))
                }
                // total = total + (tag.price * tag.quantity)
            }
            totalOrder = parseFloat(totalOrder) * parseFloat(order.quantity)
            totalTicket = totalTicket + totalOrder
            // total = parseFloat(total) + (parseFloat(order.price) * parseFloat(order.quantity))
        }
        for (let calculation of ticket.calculations) {
            totalTicket = totalTicket + parseFloat(calculation.calculationAmount)

        }
        return round(totalTicket, 2)

    }

    return (
        <div className='flex flex-row'>
            <button className='closebutton'
                onClick={() => closingTicket()}>Cerrar</button>
            <p className='showtotal'>Total: ${getTotal()}</p>
        </div>
    )
}

export default FooterPos