import React from 'react'
import { useViewport } from '../../context/ViewportContext'

const NumericPad = ({ setPadQty, qtyHelper }) => {

    const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'x']
    const [quantity, setQuantity] = React.useState('')
    const { width, height } = useViewport()


    console.log(qtyHelper)
    React.useEffect(() => {
        console.log('changad qtyHelper')
        if (qtyHelper === 1) setQuantity('')
    }, [qtyHelper])

    const numberButton = {
        background: 'green',
        minWidth: '56px',
        width: width > 807 ? '100%' : '56px',
        color: 'white',
        height: width > 807 ? '100%' : '56px',
        borderRadius: '1px',
        wordWrap: 'break-word',
        fontSize: '1em',
        boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px'
    }

    const productQuantity = (value) => {
        if (value === 'x') {
            setQuantity('')
            setPadQty(1)
        } else {
            setQuantity(quantity + value)
            setPadQty(quantity + value)
        }
    }

    return (
        <div className={`flex flex-row p-1 w-full ${width > 807 ? 'h-full' : ''}`}>
            <div className={`${width > 807 ? 'grid grid-cols-3 w-full' : 'flex flex-row w-4/6'} overflow-y-auto rounded`}>
                {numbers.map((number) => {
                    return <button key={number} onClick={() => productQuantity(number)} style={numberButton}>{number}</button>
                })}
                {width > 807 ?
                    <p className={`w-full h-full border border-gray-400 flex justify-center items-center rounded-br text-truncate`}>
                        {quantity}
                    </p>
                    : null}
            </div >
            {width < 807 ?
                <p className='w-2/6 h-14 ml-1 border border-gray-400 flex justify-center items-center rounded text-truncate'>
                    {quantity}
                </p>
                : null}
        </div>
    )
}

export default NumericPad