import React from 'react'
import BubbleInfo from './BubbleInfo'

const TicketHeader = ({ entities, ticketTags, calculations }) => {

    const style = {
        borderColor: '#ff7e77'

    }

    return (
        <div className='flex gap-x-1.5 border p-2.5 rounded-lg overflow-x-auto'>
                {entities.map((entity) => {
                    return <BubbleInfo key={entity.name} name={entity.type} value={entity.name} />
                })}
                {ticketTags?.map((ticketTag) => {
                    return <BubbleInfo key={ticketTag.tag} name={ticketTag.tagName} value={ticketTag.tag} />
                })}
                {calculations?.map((calculation) => {
                    return <BubbleInfo key={calculation.name} name={calculation.name} value={calculation.calculationAmount} />
                })}
        </div>
    )
}

export default TicketHeader