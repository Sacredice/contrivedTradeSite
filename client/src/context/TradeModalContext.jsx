import { createContext, useContext, useState } from "react";

const TradeModalContext = createContext();

function TradeModalProvider ({ children }) {
    const [openModal, setOpenModal] = useState(false);
    const [investmentType, setInvestmentType] = useState("");
    const [transactionType, setTransactionType] = useState("");
    const [qty, setQty] = useState(0);

    return (
        <TradeModalContext.Provider value=
            {{
            openModal, 
            setOpenModal,
            investmentType, 
            setInvestmentType, 
            transactionType, 
            setTransactionType, 
            qty, 
            setQty,
            }}
        >
            {children}
        </TradeModalContext.Provider>
    )
}

const useTradeModal = () => {
    const context = useContext(TradeModalContext);

    if (context === undefined) {
        throw new Error("useUser must be used within TradeModalProvider");
    }
    return context;
}

export { TradeModalProvider, useTradeModal };
