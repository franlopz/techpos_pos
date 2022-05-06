import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { gqlQuery } from '../../functions/gqlSambaMethods'
import { getTickets } from '../../functions/gqlSambaQueries'
import ScreenButton from '../entity_screen/ScreenButton'
import EntityButton from '../entity_screen/EntityButton'
import Dialog from '../Dialog'
import TicketSummary from '../entity_screen/TicketSummary'
import Pos from '../../pages/Pos'
import Spinner from '../spinner/Spinner'
import { clearTicketOrders, setTicket } from '../../stores/pos/posAction'
import { MSidebar } from '../Sidebar'
import useScreenEntities from '../../hooks/useScreenEntities'
import toast from 'react-hot-toast'
import openFullscreen from '../../functions/activateFullScreen'
import { useViewport } from '../../context/ViewportContext'

const EntityScreens = () => {

    const dispatch = useDispatch()
    const [loader, setLoader] = React.useState(false)
    const [currentTickets, setCurrentTickets] = React.useState(null)
    const ticket = useSelector(state => state.ticket)
    const { width, height } = useViewport()
    const [
        screenEntities,
        selectedScreenEntity,
        setSelectedScreenEntity,
        getScreenEntities
    ] = useScreenEntities()

    const onClickScreen = async (e) => {
        setSelectedScreenEntity(e)
    }

    const onEntityClick = async (e) => {

        setLoader(true)
        try {
            const response = await gqlQuery(getTickets(e))

            if (response.data.ticket.length === 0) {
                let array = {}
                array['entities'] = [{ name: e.name, type: e.type }]
                array['orders'] = []
                array['calculations'] = []
                array['states'] = []
                dispatch(setTicket(array))
            }
            if (response.data.ticket.length === 1) {
                if (response.data.ticket.length === 0) {
                    dispatch(clearTicketOrders())
                }
                dispatch(setTicket(response.data.ticket[0]))
            }

            if (response.data.ticket.length > 1) {
                setCurrentTickets({ type: e.type, name: e.name, tickets: response.data.ticket })
            }
        } catch (e) {
            toast.error(`Error al obtener ticket: ${e}`)
            setLoader(false)
        }
        setLoader(false)

    }

    const handleCloseDialog = () => {
        setCurrentTickets(null)
    }

    const onTicketClick = (ticket) => {
        dispatch(setTicket(ticket))
        handleCloseDialog()
    }

    const onPosCloseClick = () => {
        dispatch(clearTicketOrders())
    }


    return (
        <div onClick={() => openFullscreen()} style={{ height: height, display: 'flex', flexDirection: 'column' }}>
            {currentTickets && (
                <Dialog
                    title={currentTickets.name}
                    handleCloseDialog={handleCloseDialog}
                    size={'w-full'}>
                    {currentTickets.tickets.map((ticket) => {
                        return <TicketSummary
                            key={ticket.uid}
                            ticket={ticket}
                            onTicketClick={onTicketClick} />
                    })}
                </Dialog>)}

            {ticket !== null ? <Pos
                submittedOrders={ticket}
                onPosCloseClick={onPosCloseClick}
            /> :
                <div className='h-full'>
                    <MSidebar />
                    {loader ? <Spinner /> : null}
                    <div className='overflow-y-auto'>
                        <div className='flex'>
                            {Object.keys(screenEntities).map((entity) =>
                                <ScreenButton
                                    key={entity}
                                    screen={entity}
                                    onClickScreen={onClickScreen}
                                />)}
                        </div>
                        <div className='p-2 h-full grid gap-1.5 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
                            {screenEntities[selectedScreenEntity]?.map((entity) =>
                                <EntityButton
                                    key={entity.name}
                                    entity={{
                                        type: selectedScreenEntity,
                                        name: entity.name,
                                        color: entity.color,
                                        labelColor: entity.labelColor
                                    }}
                                    onEntityClick={onEntityClick} />)}
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default EntityScreens