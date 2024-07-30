import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { useQuery, useMutation } from "react-query";
import { usePrice } from '../context/PriceContext'
import { useUser } from '../context/UserContext';
import { useTradeModal } from "../context/TradeModalContext"
import useUserDataReactQuery from '../hooks/useUserDataReactQuery';
import LoadingSpinner from '../components/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import { Container } from '@mui/material';
import TransactionConfirmModal from '../components/TransactionConfirmModal';
import { handleCamelCase } from '../helper/ModalFunctions';


function Market() {
  const { userAuthData } = useUser();
  const { getUserProfile, updateUserProfile } = useUserDataReactQuery();
  const { pricesData, isPriceDataError } = usePrice();
  const { 
    openModal, 
    setOpenModal, 
    investmentType, 
    setInvestmentType,  
    setTransactionType, 
    setQty,
  } = useTradeModal();
  const navigate = useNavigate();

  const handleOpen = (e, investmentType) => {
    setOpenModal(true);
    setTransactionType(e.target.innerText);
    setInvestmentType(investmentType);
    setQty(0);
  }

  const {
    isLoading,
    isError,
    error,
    data
  } = useQuery(["userProfile", userAuthData.username], () => getUserProfile(userAuthData.username), {
    enabled: !!userAuthData.username,
    refetchOnWindowFocus: false,
    staleTime: 10 * 60 * 1000,
    cacheTime: 15 * 60 * 1000,
    select: (data) => {return { creditBalance: data.creditBalance, investments: data.investments}},
  });


  const updateUserProfileMutation = useMutation(updateUserProfile, {
    onSuccess: () => {
      // Invalidates cache and refetch
      queryClient.invalidateQueries("userProfile");
    }
  })

  function createData(name, price, owned, sell, details) {
    return { name, price, owned, sell, details};
  }
  
  const mats = [
    createData("Gold", pricesData?.gold, data?.investments?.gold, "sell", "details"),
    createData("Diamond", pricesData?.diamond, data?.investments.diamond, "sell", "details"),
    createData("Uranium", pricesData?.uranium, data?.investments.uranium, "sell", "details"),
    createData("Plutonium", pricesData?.plutonium, data?.investments.plutonium, "sell", "details"),
    createData("RIPCoin", pricesData?.ripCoin, data?.investments.ripCoin, "sell", "details"),
    createData("TIBCoin", pricesData?.tibCoin, data?.investments.tibCoin, "sell", "details"),
  ];

  let priceContent = (
  <Container sx={{ marginTop: "16px", px: "2px", minHeight: "440px" }}>
    <TableContainer component={Paper} sx={{ display: { xs: "flex", sm: "none", md: "none" }}}>
      <Table sx={{ minWidth: 315 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontSize: "1rem", fontWeight: "400", padding: "8px" }}>Investment Type</TableCell>
            <TableCell align="right" sx={{ fontSize: "1rem", fontWeight: "400", padding: "8px" }}>Price (Credit)</TableCell>
            <TableCell align="right" sx={{ fontSize: "1rem", fontWeight: "400", padding: "8px" }}>Owned</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {mats.map((mat) => (
            <TableRow
              key={mat.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row" sx={{ padding: "8px" }}>
                <Button variant="text" onClick={() => setInvestmentType(mat.name)}>{mat.name}</Button>
              </TableCell>
              <TableCell align="right" sx={{ padding: "8px" }}>{mat.price}</TableCell>
              <TableCell align="right" sx={{ padding: "8px" }}>
                {mat.owned}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>



    <TableContainer component={Paper} sx={{ display: { xs: "none", sm: "flex", md: "none"}, margin: "20px 0" }}>
      <Table sx={{ minWidth: 320 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontSize: "1.2rem", fontWeight: "400", px: "8px" }}>Investment Type</TableCell>
            <TableCell align="left" sx={{ fontSize: "1.2rem", fontWeight: "400", px: "8px" }}>Price (Credit)</TableCell>
            <TableCell align="left" sx={{ fontSize: "1.2rem", fontWeight: "400", px: "8px" }}>Owned</TableCell>
            <TableCell align="left" sx={{ fontSize: "1.2rem", fontWeight: "400", px: "8px" }}></TableCell>
            <TableCell align="left" sx={{ fontSize: "1.2rem", fontWeight: "400", px: "8px" }}></TableCell>
            <TableCell align="left" sx={{ fontSize: "1.2rem", fontWeight: "400", px: "8px" }}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {mats.map((mat) => (
            <TableRow
              key={mat.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row"  sx={{ px: "8px" }}>
                {mat.name}
              </TableCell>
              <TableCell align="left" sx={{ px: "8px" }}>{mat.price}</TableCell>
              <TableCell align="left" sx={{ px: "8px" }}>
                {mat.owned}
              </TableCell>
              <TableCell align="left" sx={{ px: "8px" }}>
                <Button variant="contained" disabled={data?.creditBalance < pricesData?.[handleCamelCase(mat.name)]} onClick={(e) => handleOpen(e, mat.name)}>Buy</Button>
              </TableCell>
              <TableCell align="left" sx={{ px: "8px" }}>
                <Button variant="contained" disabled={data?.investments?.[handleCamelCase(mat.name)] === 0} onClick={(e) => handleOpen(e, mat.name)}>Sell</Button>
              </TableCell>
              <TableCell align="left" sx={{ px: "8px" }}>
              <Button variant="contained" onClick={() => navigate(`/${mat.name.toLowerCase()}`)}>Details</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    <TableContainer component={Paper} sx={{ display: { xs: "none", sm: "none", md: "flex"}, marginTop: "20px" }}>
      <Table sx={{ minWidth: 320 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontSize: "1.2rem", fontWeight: "400" }}>Investment Type</TableCell>
            <TableCell align="left" sx={{ fontSize: "1.2rem", fontWeight: "400" }}>Price (Credit)</TableCell>
            <TableCell align="left" sx={{ fontSize: "1.2rem", fontWeight: "400" }}>Owned</TableCell>
            <TableCell align="left" sx={{ fontSize: "1.2rem", fontWeight: "400" }}></TableCell>
            <TableCell align="left" sx={{ fontSize: "1.2rem", fontWeight: "400" }}></TableCell>
            <TableCell align="left" sx={{ fontSize: "1.2rem", fontWeight: "400" }}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {mats.map((mat) => (
            <TableRow
              key={mat.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {mat.name}
              </TableCell>
              <TableCell align="left">{mat.price}</TableCell>
              <TableCell align="left">
                {mat.owned}
              </TableCell>
              <TableCell align="left">
                <Button variant="contained" disabled={data?.creditBalance < pricesData?.[handleCamelCase(mat.name)]} onClick={(e) => handleOpen(e, mat.name)}>Buy</Button>
              </TableCell>
              <TableCell align="left">
                <Button variant="contained" disabled={data?.investments?.[handleCamelCase(mat.name)] === 0} onClick={(e) => handleOpen(e, mat.name)}>Sell</Button>
              </TableCell>
              <TableCell align="left">
              <Button variant="contained" onClick={() => navigate(`/${mat.name.toLowerCase()}`)}>Details</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Container>
  )
  
  return (
    <div style={{ backgroundColor: "rgba(255, 255, 255, 0)" }}>
        <section style={{ position: "relative", flexGrow: "1", margin: "10px 0" }}>
          {!pricesData && !isPriceDataError && !data && <LoadingSpinner />}
          {pricesData && !isPriceDataError && data && priceContent}
          {isPriceDataError && <h2>{isPriceDataError.message}</h2>}
        </section>
        {investmentType && pricesData && data && (
          <AppBar position="fixed" color="primary" sx={{ display: { xs: "flex", sm: "none" }, top: 'auto', bottom: 0 }}>
            <Box color="primary" sx={{ fontSize: "1.2rem", textAlign: "center", borderBottom: "1px solid whitesmoke" }}>{investmentType}</Box>
              <Toolbar sx={{ justifyContent: "space-around"}}>
                <Button variant="contained" color='secondary'  disabled={data?.creditBalance < pricesData[handleCamelCase(investmentType)]} onClick={(e) => handleOpen(e, investmentType)}>Buy</Button>
                <Button variant="contained" color='secondary' disabled={data?.investments?.[handleCamelCase(investmentType)] === 0} onClick={(e) => handleOpen(e, investmentType)}>Sell</Button>
                <Button variant="contained" color='secondary' onClick={() => navigate(`/${investmentType.toLowerCase()}`)}>Details</Button>
              </Toolbar>
          </AppBar>)}
        {isLoading && !isError && <LoadingSpinner />}
        {!isLoading && !isError && <TransactionConfirmModal />}
        {!isLoading && isError && <p>{error.message}</p>}
    </div>
  )
}

export default Market
