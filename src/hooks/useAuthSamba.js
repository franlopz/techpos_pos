import { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import auth, { testConnection } from "../functions/gqlSambaMethods";
import { isSambaTokenValid } from "../helpers/isSambaTokenValid";

const useAuthSamba = () => {


    const authSamba = async () => {
        const testResponse = await testConnection({ origin: 'CustomHook' });
        if (testResponse === 'OK') {
            let isTokenValid = await isSambaTokenValid()
            if (!isTokenValid) {
                try {
                    await auth({},3)
                } catch (e) {
                    toast.error(e)
                    throw(e)
                }

            }
        } else {
            toast.error('Servidor no encontrado')
            throw ('Servidor no encontrado')

        }
    }

    return [authSamba]

}

export default useAuthSamba