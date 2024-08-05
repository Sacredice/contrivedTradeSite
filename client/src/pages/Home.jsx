import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { usePrice } from '../context/PriceContext';
import { useColorMode } from "../context/ColorModeContext";
import LoadingSpinner from '../components/LoadingSpinner';
import styles from "../ComponentsStyles";


function Home() {
  const { pricesData, isPriceDataError } = usePrice();
  const { checked } = useColorMode();

  const lightMode = checked ? "dark2" : "light1"

  function createData(name, price) {
    return { name, price};
  }
  
  const rows = [
    createData("Gold", pricesData?.gold),
    createData("Diamond", pricesData?.diamond),
    createData("Uranium", pricesData?.uranium),
    createData("Plutonium", pricesData?.plutonium),
    createData("RIPCoin", pricesData?.ripCoin),
    createData("TIBCoin", pricesData?.tibCoin),
  ];
  
  let priceContent = (<TableContainer component={Paper}>
    <Table sx={{ minWidth: 320 }} aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell sx={{ fontSize: "1.2rem", fontWeight: "400" }}>Investment Type</TableCell>
          <TableCell align="right" sx={{ fontSize: "1.2rem", fontWeight: "400" }}>Price (Credit)</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <TableRow
            key={row.name}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
            <TableCell component="th" scope="row">
              {row.name}
            </TableCell>
            <TableCell align="right">{row.price}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>)

  return (
    <div style={{ backgroundColor: "rgba(255, 255, 255, 0)", display: "flex", justifyContent: "center", alignItems: "start", minHeight: "calc(100vh - 68.5px - 48.7px)" }}>
      <div style={{ display: "flex",flexDirection: "column", width: "75%", justifyContent: "center", alignItems: "center", margin: "0", color: checked ? "whitesmoke" : "black" }}>
      <h1 style={{ marginBottom: "16px", fontSize: "1.8rem"}}>Welcome to my personal Trading Website Project</h1>
      <p>You need to login to start buying and selling the 6 type of investments. Prices of investments change by a random amount within a certain limit after a randomly determined period of time between 6 and 2.5 minutes. After signing up, every account will receive 250,000 credits, and there is no transaction fee.</p>
      <br />
      <p>For security concerns, you can use a fake email address and a simple password (not the one you use for other accounts). There is no email confirmation process, and don't worry; only your password hash is stored in the database.</p>
      <div style={{ width: "100%" }}>
        <p>Or you can log in to the test account for testing using the <b>username: test</b>, <b>password: pass</b>.</p>
      </div>
        <div style={styles.chartContainer}>
          <section style={{ position: "relative", flexGrow: "1", margin: "16px" }}>
            {!pricesData && !isPriceDataError && <LoadingSpinner />}
            {pricesData && !isPriceDataError && priceContent}
            {isPriceDataError && <h2>{isPriceDataError.message}</h2>}
          </section>
        </div>
      </div>
    </div>
  )
}

export default Home
