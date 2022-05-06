import React from 'react'
import settingsLogo from '../assets/settings.png'
const Onboarding = () => {

    return (
        <div className='w-full h-screen flex flex-col content-center items-center'>
            <div className='relative top-1/2 -translate-y-1/2'>
                <div className='m-2 max-w-4xl flex flex-col content-center items-center'>
                    <img src={settingsLogo} />
                    <h2 className='text-center'>Benvenido, necesitas configurar tu aplicación para continuar</h2>
                    <button className='button'>Continuar</button>
                </div>
            </div>
        </div>
    )
}

export default Onboarding