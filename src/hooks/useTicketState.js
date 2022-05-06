import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const useTicketState = () => {

    const ticketStates = useSelector(state => state.ticket.states)
    const [isLocked, setLocked] = useState(false)

    useEffect(() => {
        for (let state of ticketStates) {
            if (state.stateName === 'Status' && state.state === 'Locked') return setLocked(true)
        }
    }, [])

    return [isLocked] 
}

export default useTicketState