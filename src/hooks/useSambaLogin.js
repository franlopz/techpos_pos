import { gqlQuery, sambaHelper } from '../functions/gqlSambaMethods'
import { getUser } from '../functions/gqlSambaQueries'
import { useDispatch } from 'react-redux'
import { sambaUserLogin } from '../stores/samba/sambaAction'
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast'

const useSambaLogin = () => {

    const dispatch = useDispatch()
    let navigate = useNavigate();

    const authSambaUser = async ({ pin, setPin }) => {
        try {
            const isWPOpen = await sambaHelper('wp')
            const start = isWPOpen[0]['WorkPeriods'][0]['StartDate']
            const end = isWPOpen[0]['WorkPeriods'][0]['EndDate']
            if (start === end) {
                const response = await gqlQuery(getUser(pin))
                const user = response.data.getUser
                if (user.name !== '*') {
                    toast.success(`${user.name} ha iniciado sesión`)
                    dispatch(sambaUserLogin(user))
                    return navigate('/')
                }
                setPin('')
                return toast.error('Pin incorrecto', { id: 'WrongPin' })
            }else{
                toast.error('Periodo no iniciado')
                throw('Periodo no iniciado')
            }
        } catch (e) {
            throw (e)
        }
    }

    return [authSambaUser]
}

export default useSambaLogin