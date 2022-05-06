import React from 'react'

const PinBox = ({ pin }) => {

    const hidePin = () =>{
        if(pin.length === 0) return ''
        return pin.replace(/./g, '*');
    }
    return (
        <div className='rounded-lg border p-4 max-w-xl h-16 text-4xl text-center truncate tracking-widest m-6'>
            <p>{hidePin()}</p>
        </div>
    )
}

export default PinBox