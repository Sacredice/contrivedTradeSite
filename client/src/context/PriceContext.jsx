import { createContext, useContext, useState, useEffect } from 'react'
import { db } from "../config/firebaseConfig"
import { onSnapshot, doc } from 'firebase/firestore';

const PriceContext = createContext({});

function PriceProvider({ children }) {
    const [pricesData, setPricesData] = useState(null);
    const [isPriceDataError, setIsPriceDataError] = useState("");


    useEffect(() => {

        const unSubCurrentPrices = onSnapshot(doc(db , "prices", "currentPrices"), (doc) => {
            setPricesData(doc.data());
        },
        (error) => {
            setIsPriceDataError(error.message)
        }
        );
        
        return () => unSubCurrentPrices();
    }, [])

    return (
        <PriceContext.Provider value={{
            pricesData,
            setPricesData,
            isPriceDataError,
        }}>
            {children}
        </PriceContext.Provider>
    )
}

const usePrice = () => {
    const context = useContext(PriceContext)

    if (context === undefined) {
        throw new Error("usePrice must be used within PriceProvider");
    }
    return context;
}

export { PriceProvider, usePrice };