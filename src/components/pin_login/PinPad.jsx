import React from 'react'

const PinPad = ({ handlePinPadClick }) => {

    const values = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'X', '0', 'enter']

    return (
        <div className='grid grid-cols-3 rounded-[2rem] gap-2 m-6 aspect-[3/4]'>
            {values.map((value) => {
                return <button
                    key={value}
                    className={`active:bg-indigo-100 text-lg font-bold text-gray-600 aspect-square border rounded-xl`}
                    onClick={() => handlePinPadClick(value)}
                >
                    {value}
                </button>
            })}
        </div>
    )
}

export default PinPad