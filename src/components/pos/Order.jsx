import React from 'react'
import round from '../../functions/round'
import IconButton from '@mui/material/IconButton'
import RemoveIcon from '@mui/icons-material/Remove'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { addOrder, setTicket } from '../../stores/pos/posAction'
import { useDispatch, useSelector } from 'react-redux'

const Order = ({ order, index, padQty }) => {

    const { quantity, name, price, tags } = order
    const dispatch = useDispatch()
    const ticket = useSelector(state => state.ticket)

    const showPopUp = () => {

        if (order?.date === undefined) {
            const orderToModify = {
                id: order.productId,
                name: order.name,
                savedSelectedPortion: order.selectedPortion,
                savedOrderTags: order.selectedOrderTags,
                savedGroupTagCount: order.groupTagCount,
                arrayIndex: index,
                quantity: order.quantity ? order.quantity : padQty
            }
            dispatch(addOrder(orderToModify))
        }
    }

    const getTotal = () => {
        let total = price
        for (let tag of tags) {

            if (tag.rate !== 0) {
                total = parseFloat(total)*(1+tag.rate/100*tag.quantity)
            } else {
                total = parseFloat(total) + ((tag.price * tag.quantity))
            }
        }
        return total = round(quantity * (total), 2)
    }

    const modifyQuantity = ({ action, value }) => {

        let modifiedOrder = { ...order }
        let quantity = order.quantity
        let modifiedTicket = { ...ticket }

        if (quantity === 1 && action === 'remove') {
            let ordersList = [...ticket.orders]
            ordersList.splice(index, 1)
            modifiedTicket['orders'] = ordersList
            dispatch(setTicket(modifiedTicket))
        }

        if (quantity > 1 && action === 'remove') {
            modifiedOrder['quantity'] = quantity - 1
            modifiedTicket['orders'][index] = modifiedOrder
            dispatch(setTicket(modifiedTicket))
        }

        if (quantity >= 1 && action === 'add') {
            modifiedOrder['quantity'] = parseInt(quantity) + 1
            modifiedTicket['orders'][index] = modifiedOrder
            console.log({ modifiedOrder, index, quantity })
            dispatch(setTicket(modifiedTicket))
        }

        if (action === 'input') {
            console.log(value)
            if (value === '' || value === '0') value = 1
            modifiedOrder['quantity'] = parseInt(value)
            modifiedTicket['orders'][index] = modifiedOrder
            dispatch(setTicket(modifiedTicket))
        }
    }

    return (
        <div className='border-b'>
            <div className='flex flex-col'>
                <div className='flex flex-row mx-2 justify-center items-center'>
                    {order?.date === undefined ?
                        <div className='flex flex-row mx-2 justify-center items-center'>
                            <IconButton onClick={() => modifyQuantity({ action: 'remove' })} color="primary" aria-label="remove" variant="outlined">
                                {quantity === 1 ? <DeleteOutlineIcon /> : <RemoveIcon />}
                            </IconButton>
                            <input className='max-w-xs m w-10 h-8 m flex justify-center text-center' type="number" min='0' step='1' onChange={(e) => { modifyQuantity({ action: 'input', value: e.target.value }) }} value={quantity} />
                            {/* <p onClick={() => { }} className='max-w-xs m  w-8 h-8 m flex justify-center items-center'>{quantity}</p> */}
                            <IconButton onClick={() => modifyQuantity({ action: 'add' })} color="primary" aria-label="add">
                                <AddIcon />
                            </IconButton>
                        </div> :
                        <p className='max-w-xs m  w-8 h-8 m flex justify-center items-center'>{quantity}</p>
                    }
                    <p className='flex-1 m-1 flex justify-start items-center' onClick={() => showPopUp()}>{name}</p>
                    <p className='flex m-1 w-min justify-center items-center' onClick={() => showPopUp()}>{getTotal()}</p>
                </div>
                <div className='flex flex-wrap'>
                    {tags.map((tag) => {

                        return <p key={tag.tag}
                            style={{ borderColor: '#ff7e77' }}
                            className='max-w-xs text-xs mx-1 mb-2 px-2 rounded-md border h-6 flex justify-center items-center'>
                            {(tag.quantity === 1 ? '' : tag.quantity + ' x ') + tag.tag + (tag.price > 0 ? ' $' + tag.price * tag.quantity : '')
                                + (tag.rate !== 0 ? ' ' + tag.rate + '%' : '')}
                        </p>
                    })}
                </div>
            </div>
        </div>
    )
}

export default Order