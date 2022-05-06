import React from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import useTicketState from '../../hooks/useTicketState'
import { addOrder } from '../../stores/pos/posAction'

const ProductButton = ({ productName, productId, qtyHelper = 1, setPadQty }) => {

    const dispatch = useDispatch()
    const [isLocked] = useTicketState()


    const onProductClick = () => {
        console.log(isLocked)
        if (isLocked) return toast.error('Ticket impreso')
        
        const newOrder = {
            id: productId,
            name: productName,
            savedSelectedPortion: null,
            savedOrderTags: null,
            savedGroupTagCount: null,
            arrayIndex: null,
            quantity: qtyHelper
        }
        dispatch(addOrder(newOrder))
        setPadQty(1)
    }

    const productStyle = {
        background: '#2196f3',
        width: '100%',
        color: 'white',
        height: '100%',
        lineHeight: '1.4em',
        // border: '1px solid  #ccc',
        borderRadius: '8px',
        wordWrap: 'break-word',
        minHeight: '45px',
        padding: '5px 5px 5px 5 px',
        fontSize: '1em',
        boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px'

    }
    return (
        <div style={{ margin: '4px 4px 4px 4px' }}>
            <button onClick={() => { onProductClick() }} style={productStyle}>{productName}</button>
        </div>
    )
}

export default ProductButton
