import { useEffect, useState } from 'react'
import localForage from 'localforage'
import { gqlQuery } from '../functions/gqlSambaMethods'
import { getEntityScreenItems, registerTerminal } from '../functions/gqlSambaQueries'
import { useDispatch, useSelector } from 'react-redux'
import { setTerminalId } from '../stores/pos/posAction'
import { toast } from 'react-hot-toast'
// import { hubConnection } from 'signalr-no-jquery'
import { hubConnection } from '@cojam/signalr-no-jquery';

const useScreenEntities = () => {


    const dispatch = useDispatch()
    const [screenEntities, setScreenEntities] = useState([])
    const [selectedScreenEntity, setSelectedScreenEntity] = useState('')
    const sambaUser = useSelector(state => state.sambaUser)
    const terminalId = useSelector(state => state.terminalId)

    const posSettings = localForage.createInstance({
        name: "POS",
        storeName: "Settings"
    })
    console.log({ terminalId, sambaUser })


    const getTerminalId = async () => {
        let settingsResponse = await posSettings.getItem('savedSettings')
        const terminalIdResponse = await gqlQuery((registerTerminal(settingsResponse, sambaUser.name)))
        dispatch(setTerminalId(terminalIdResponse.data.terminalId))
    }
    const getScreenEntities = async () => {
        let screens = {}
        let settingsResponse = await posSettings.getItem('savedSettings')
        const loadingEntScreen = toast.loading('Cargando pantalla...', { id: 'loadingEntScreen' })
        try {
            if (settingsResponse) {
                for (let entity of settingsResponse.EntityType) {
                    const response = await gqlQuery(getEntityScreenItems(entity));
                    if (response !== 'Unauthorized' && response !== 'Bad Request') {
                        screens[entity] = response.data.getEntityScreenItems
                    }
                }
            }
            setScreenEntities(screens)
            toast.dismiss(loadingEntScreen)
            return screens

        } catch (e) {
            toast.dismiss(loadingEntScreen)
            toast.error('Error al obtener pantallas')
        }
    }

    useEffect(() => {
        getScreenEntities().then((value) => {
            setSelectedScreenEntity(Object.keys(value)[0])

        })
        getTerminalId()
    }, [])

    useEffect(() => {
        let stopped = false
        const initialConnectionData = JSON.parse(window.localStorage.getItem('connectionData')) ?? { ipaddress: '', port: '', identifier: '', key: '' }
        let connection = hubConnection(`http://${initialConnectionData.ipaddress}:${initialConnectionData.port}`);
        let contosoChatHubProxy = connection.createHubProxy('default');
        contosoChatHubProxy.on('update', function (name, message) {
            console.log(name + ' ' + message);
            getScreenEntities()
            if (name.includes('TaskEditorCreator') || name.includes('orderCompleted') || name.includes('OrderSent')) {
                console.log(name + ' ' + message);
                setTimeout(() => {
                    if (name.includes('OrderSent'));
                }, 1000);
            }
        });

        connection.start({ transport: 'serverSentEvents' })
            .done()
            .fail(function () { console.log('Could not connect'); });

        connection.error(function (error) {
            console.log('SignalR error: ' + error)
        });

        connection.reconnecting(function () {
            console.log('reconnecting') // Your function to notify user.
        });

        connection.disconnected(function () {
            console.log('disconnected', connection, stopped);
            if (stopped === false) {
                setTimeout(function () {
                    connection.start({ transport: 'serverSentEvents' });
                }, 5000)
            }
        })

        return function cleanup() {
            console.log('stopping')
            stopped = true
            connection.stop()
            connection = null;
        }


    }, [])

    return [screenEntities, selectedScreenEntity, setSelectedScreenEntity, getScreenEntities]
}

export default useScreenEntities