import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { registerTerminal } from '../functions/gqlSambaQueries'

export const useTerminalId = () => {

    const dispatch = useDispatch()

    useEffect(() => {
        gqlQuery((registerTerminal(settingsResponse, currentUser)))
    }, [])

}