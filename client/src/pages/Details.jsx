import React, { useState, useEffect, memo } from 'react'
import Chart from '../components/Chart';
import usePriceHistory from '../hooks/usePriceHistory';
import { useUser } from '../context/UserContext';
import { useColorMode } from '../context/ColorModeContext';
import { useQuery } from "react-query";
import useUserDataReactQuery from '../hooks/useUserDataReactQuery';
import LoadingSpinner from '../components/LoadingSpinner';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';
import { handleCamelCase } from '../helper/ModalFunctions';
import { useTradeModal } from "../context/TradeModalContext"
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import TransactionConfirmModal from '../components/TransactionConfirmModal';


function Details({ tradeGoods }) {
    const [ filteredHistory, setFilteredHistory] = useState(null);
    const [ lastHours, setLastHours] = useState("24");
    const { historyData, error: historyError } = usePriceHistory(handleCamelCase(tradeGoods)); 
    const { checked } = useColorMode();
    const { getUserProfile } = useUserDataReactQuery();
    const { userAuthData } = useUser();
    const { 
        openModal, 
        setOpenModal, 
        investmentType, 
        setInvestmentType,  
        setTransactionType, 
        setQty,
      } = useTradeModal();

    const price = historyData?.history.slice(-1)[0].price
    const lightMode = checked ? "dark2" : "light1"

    const {
        isLoading,
        isError,
        error,
        data
      } = useQuery(["userProfile", userAuthData?.username], () => getUserProfile(userAuthData.username), {
        enabled: !!userAuthData.username,
        refetchOnWindowFocus: false,
        staleTime: 10 * 60 * 1000,
        cacheTime: 15 * 60 * 1000,
        select: (data) => {return { creditBalance: data.creditBalance, investments: data.investments}}
      });


    useEffect(() => {

        const handleChartTime = () => {
            if(lastHours === "24") {
                setFilteredHistory(historyData?.history);
                return
            }

            const now = new Date();
            now.setHours(now.getHours() - Number(lastHours));
            const filteredHistoryArray = historyData?.history.filter(obj => obj.timestamp > now.getTime())
            setFilteredHistory(filteredHistoryArray)
    
        }

        handleChartTime();

    }, [lastHours, historyData])

    const handleOpen = (e, investmentType) => {
        setOpenModal(true);
        setTransactionType(e.target.innerText);
        setInvestmentType(investmentType);
        setQty(0);
    }


    const handleChange = (event, newAlignment) => {
        setLastHours(newAlignment);

      };


    return (
        <div style={{ width: "100%", maxWidth: "1200px", display: "flex", flexDirection: "column", margin: "0 auto" }}>

                <Box sx={{ display: { xs: "flex", sm: "none"}, flexDirection: "column", minHeight: "calc(100vh - 56px - 48px - 40px)" }}>
                    <Box>
                        <h4 style={{ textAlign: "center", margin: "6px 0", color: checked ? "whitesmoke" : "black" }}>Last {lastHours} {lastHours === "1" ? "Hour": "Hours"} of {tradeGoods} Prices</h4>
                        <ToggleButtonGroup
                            size='small'
                            color="primary"
                            value={lastHours}
                            exclusive
                            onChange={handleChange}
                            aria-label="Platform"
                            sx={{ maxHeight: "20px",paddingLeft: "5px" }}
                            >
                            <ToggleButton value="24" disabled={lastHours === "24"}>24H</ToggleButton>
                            <ToggleButton value="12" disabled={lastHours === "12"}>12H</ToggleButton>
                            <ToggleButton value="6" disabled={lastHours === "6"}>6H</ToggleButton>
                            <ToggleButton value="1" disabled={lastHours === "1"}>1H</ToggleButton>
                        </ToggleButtonGroup>
                    </Box>
                    {!historyData && <LoadingSpinner />}
                    {historyError && <p>{historyError.message}</p>}
                    {historyData && !historyError && filteredHistory && <Chart history={filteredHistory} material={tradeGoods} lightMode={lightMode} />}
                    {!isLoading && historyData ? (
                    <AppBar position="sticky" color="primary" sx={{ display: { xs: "flex", sm: "none" },top: "auto", bottom: 0, marginTop: "auto" }}>
                        <Box color="primary" sx={{ fontSize: "1.2rem", textAlign: "center", borderBottom: "1px solid whitesmoke" }}>{tradeGoods}</Box>
                        <Toolbar sx={{ justifyContent: "space-around"}}>
                            <Button variant="contained" color='secondary'  disabled={data?.creditBalance < price} onClick={(e) => handleOpen(e, tradeGoods)}>Buy</Button>
                            <Button variant="contained" color='secondary' disabled={data?.investments[handleCamelCase(tradeGoods)] === 0} onClick={(e) => handleOpen(e, tradeGoods)}>Sell</Button>
                        </Toolbar>
                    </AppBar>) : <LoadingSpinner />}
                    {!isLoading && isError && <p>{error.message}</p>}
                </Box>
                {historyData && data && filteredHistory ? (
                    <Box sx={{ display: { xs: "none", sm: "flex" }, flexDirection: "column" }}>
                        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", margin: "8px auto", padding: "4px", width: "98%" }}>
                            <Box>
                                <h2 style={{ textAlign: "center", marginBottom: "8px" ,color: checked ? "whitesmoke" : "black" }}>Last {lastHours} {lastHours === "1" ? "Hour": "Hours"} of {tradeGoods} Prices</h2>
                                <ToggleButtonGroup
                                    size='small'
                                    color="primary"
                                    value={lastHours}
                                    exclusive
                                    onChange={handleChange}
                                    aria-label="Platform"
                                    sx={{ maxHeight: "20px" }}
                                    >
                                    <ToggleButton value="24" disabled={lastHours === "24"}>24H</ToggleButton>
                                    <ToggleButton value="12" disabled={lastHours === "12"}>12H</ToggleButton>
                                    <ToggleButton value="6" disabled={lastHours === "6"}>6H</ToggleButton>
                                    <ToggleButton value="1" disabled={lastHours === "1"}>1H</ToggleButton>
                                </ToggleButtonGroup>
                            </Box>
                            {historyError && <p>{historyError.message}</p>}
                            {!historyError && <Chart history={filteredHistory} material={tradeGoods} lightMode={lightMode} />}

                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-evenly",  marginTop: "42px"}}>
                            <Box sx={{ display: "flex", flexDirection: "column" }}>
                                <h3 style={{ color: checked ? "whitesmoke" : "black" }}>Current {tradeGoods} Price: {price}</h3>
                                <Button size='large' variant="contained" onClick={(e) => handleOpen(e, tradeGoods)} sx={{ justifyContent: "center", margin: "8px auto"}}>Buy</Button>
                            </Box>
                            <Box sx={{ display: "flex", flexDirection: "column" }}>
                                <h3 style={{ color: checked ? "whitesmoke" : "black" }}>Owned {tradeGoods} Quantity: {data?.investments[handleCamelCase(tradeGoods)]}</h3>
                                <Button size='large' variant="contained" onClick={(e) => handleOpen(e, tradeGoods)} sx={{ justifyContent: "center", margin: "8px auto"}}>Sell</Button>
                            </Box>
                        </Box>
                    </Box>) : <LoadingSpinner />}
            {isLoading && !isError && <LoadingSpinner />}
            {!isLoading && !isError && <TransactionConfirmModal />}
            {!isLoading && isError && <p>{error.message}</p>}

        </div>
    )
}

export default memo(Details);
