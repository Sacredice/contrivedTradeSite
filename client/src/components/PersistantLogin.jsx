import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect, Suspense } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import { useUser } from "../context/UserContext";
import LoadingSpinner from "./LoadingSpinner";


import React from 'react'

function PersistantLogin() {
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const refresh = useRefreshToken();
    const { userAuthData, setIsLoggedIn, persist, isLoggedIn } = useUser();

    useEffect(() => {
        let isMounted = true;

        async function verifyRefreshToken() {
            try {
                await refresh();
                // setIsLoggedIn(true);
                console.log("refresh with persistLogin");
            } catch (err) {
                console.error(err);
            } finally {
                isMounted && setIsLoading(false);
                
            }
        }

        !userAuthData?.accessToken && persist ? verifyRefreshToken() : setIsLoading(false);

        return () => isMounted = false;

    }, [])


  return (
    <>
      {!persist
        ? <Suspense fallback={<LoadingSpinner />}><Outlet /></Suspense>
            : isLoading
                ? <LoadingSpinner />
                : <Outlet />}
    </>
  )
}

export default PersistantLogin
