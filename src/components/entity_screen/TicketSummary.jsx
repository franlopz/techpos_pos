import React from 'react'

const TicketSummary = ({ ticket, onTicketClick }) => {

    const getTicketState = () => {
        const states = ticket?.states
        for (let state of states) {

            if (state?.stateName === 'Status' && state?.state === 'Submitted') {
                return 'Submitted'
            }
            if (state?.stateName === 'Status' && state?.state === 'Unpaid') {
                return 'Abierta'
            }
            
            if (state?.stateName === 'Status' && state?.state === 'Locked') {
                return 'Impresa'
            }
        }
    }

    const onClick = (ticket) =>{
        onTicketClick(ticket)

    }
    return (
        <div className='border rounded-md my-1' onClick={() => onClick(ticket)}>
            <div className='flex flex-col'>
                <div className='flex flex-row mx-2 justify-center items-center'>
                    <p className='max-w-xs m-1 p-1 rounded-md border w-fit h-fit m flex justify-center items-center'>{ticket.id}</p>
                    <p className='flex-1 m-1 flex justify-start items-center'>${ticket.totalAmount}</p>
                    <p className='flex m-1 w-min flex justify-center items-center'>{getTicketState()}</p>
                </div>
            </div>
            <div className='flex flex-wrap'>
                {ticket.tags.map((tag) => {
                    console.log(tag)
                    return <p key={tag.tag}
                        style={{ borderColor: '#ff7e77' }}
                        className='max-w-xs text-xs mx-1 mb-2 px-2 rounded-md border h-6 flex justify-center items-center'>
                        {tag.tagName + ': ' + tag.tag}
                    </p>
                })}
            </div>

        </div>
    )
}

export default TicketSummary