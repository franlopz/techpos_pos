import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'


const RequiredAuth = ({ children, redirectTo, reducer }) => {
    const isAuth = useSelector(state => state[reducer])

    return isAuth ? children : <Navigate to={redirectTo} />
}

export default RequiredAuth