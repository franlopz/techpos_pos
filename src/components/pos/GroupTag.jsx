import React from 'react'

const GroupTag = ({ groupTag, children, countLimits, groupTagCount }) => {

    const getTitle = () => {
        let countMax = countLimits?.max
        let countMin = countLimits?.min
        let quantity = groupTagCount?.quantity ? groupTagCount?.quantity : 0

        if (countMin > 0) {
            return ` ${(countMin - quantity) > 0 ? '(' + (countMin - quantity) + ' disponibles)' : ''} `
        }

        if (countMax > 0) {
            return ` (${countMax} máximos)`
        }

        return ``
    }
    return (
        <div className='my-6'>
            <div className='rounded-md border-2 mt-2 border-gray-300'>
                <p className='z-10 -top-3 ml-2 px-2 bg-white max-w-max text-sm text-gray-500 relative'>{groupTag.name + getTitle()}</p>
                <div className={groupTag.name === 'Notas' ? 'grid grid-cols-1':'grid grid-cols-3'}>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default GroupTag