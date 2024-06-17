import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'

export default function PrivateRoutes() {
    let  isAuthenticated = localStorage.getItem("token") == null ? false : true;
    return (
        <>
            {isAuthenticated ? <Outlet  /> : <Navigate to="/login" />}
        </>

    )

}