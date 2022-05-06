import React from 'react'

const BubbleInfo = ({ name, value }) => {

    return (
        <div className=' border-red-500 text-xs rounded-md border h-6 justify-center items-center'>
            <p className='w-max p-0.5'>
                {name}: {value}
            </p>
        </div>
    )
}

export default BubbleInfo