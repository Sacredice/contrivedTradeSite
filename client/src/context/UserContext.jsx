import { createContext, useContext, useState } from 'react'

const UserContext = createContext({});

function UserProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userAuthData, setUserAuthData] = useState(null);
    const [userProfileData, setUserProfileData] = useState(null);
    const [persist, setPersist] = useState(JSON.parse(localStorage.getItem("persist")) || false);



    return (
        <UserContext.Provider value={
            { 
                isLoggedIn, 
                setIsLoggedIn, 
                userAuthData, 
                setUserAuthData, 
                userProfileData, 
                setUserProfileData,
                persist, 
                setPersist, 
            }}
        >
            {children}
        </UserContext.Provider>
    )
}

const useUser = () => {
    const context = useContext(UserContext);

    if (context === undefined) {
        throw new Error("useUser must be used within UserProvider");
    }
    return context;
}

export { UserProvider, useUser };
