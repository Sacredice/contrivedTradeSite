import { useState } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Pagination from '@mui/material/Pagination';
import { Container } from '@mui/material';
import Box from '@mui/material/Box';
import { useSearchParams, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import useUserDataReactQuery from "../hooks/useUserDataReactQuery"
import LoadingSpinner from '../components/LoadingSpinner';


function MarketHistory() {
    const [page, setPage] = useState(1);
    const { getUserProfile } = useUserDataReactQuery()
    const params = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const pageParams = searchParams.get("page");

    const {
        isFetching,
        isError,
        error,
        data: historyData,
        isPreviousData,
      } = useQuery(["userProfile", params.username, page], () => getUserProfile(`${params.username}/markethistory?page=${page}`), {
        enabled: !!params.username,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
        keepPreviousData: true
      });
      

    const historyRows = historyData?.pageList;


    const handlePageChange = (e, value) => {
        setPage(value);
        setSearchParams({ page: value });
    }

  return (
    <div style={{ backgroundColor: "rgba(255, 255, 255, 0)" }}>
      {!historyRows && <LoadingSpinner />}
      {historyRows && <div>
        <Container sx={{ display: { xs: "flex", sm: "none", md: "none" }, px: "2px", minHeight: "412px" }}>
          <TableContainer component={Paper} sx={{ marginTop: "16px", marginBottom: "6px", color: "primary" }}>
            <Table sx={{ minWidth: 315 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontSize: "1rem", fontWeight: "400", padding: "8px" }}>Name</TableCell>
                  <TableCell align="right" sx={{ fontSize: "1rem", fontWeight: "400", padding: "8px" }}>Date</TableCell>
                  <TableCell align="right" sx={{ fontSize: "1rem", fontWeight: "400", padding: "8px" }}>Owned</TableCell>
                  <TableCell align="right" sx={{ fontSize: "1rem", fontWeight: "400", padding: "8px" }}>Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {historyRows.map((row) => (
                  <TableRow
                    key={row.date}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, marginBottom: "5px" }}
                  >
                    <TableCell component="th" scope="row" sx={{ padding: "8px" }}>
                      {row.name}
                    </TableCell>
                    <TableCell align="right" sx={{ padding: "8px" }}>{row.date.split("-")[0]}</TableCell>
                    <TableCell align="right" sx={{ padding: "8px" }}>{row.type}</TableCell>
                    <TableCell align="right" sx={{ padding: "8px" }}>{row.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>

        <Container sx={{ display: { xs: "none", sm: "flex", md: "none"}, px: "2px", minHeight: "626px" }}>
          <TableContainer component={Paper} sx={{ margin: "20px 0"  }}>
            <Table sx={{ minWidth: 320 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontSize: "1.2rem", fontWeight: "400", px: "8px" }}>Name</TableCell>
                  <TableCell align="right" sx={{ fontSize: "1.2rem", fontWeight: "400", px: "8px" }}>Date</TableCell>
                  <TableCell align="right" sx={{ fontSize: "1.2rem", fontWeight: "400", px: "8px" }}>Transaction</TableCell>
                  <TableCell align="right" sx={{ fontSize: "1.2rem", fontWeight: "400", px: "8px" }}>Quantity</TableCell>
                  <TableCell align="right" sx={{ fontSize: "1.2rem", fontWeight: "400", px: "8px" }}>Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {historyRows.map((row) => (
                  <TableRow
                    key={row.date}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row"  sx={{ px: "8px" }}>{row.name}</TableCell>
                    <TableCell align="right" sx={{ px: "8px" }}>{row.date}</TableCell>
                    <TableCell align="right" sx={{ px: "8px" }}>{row.type}</TableCell>
                    <TableCell align="right" sx={{ px: "8px" }}>{row.qty}</TableCell>
                    <TableCell align="right" sx={{ px: "8px" }}>{row.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>

        <Container sx={{ display: { xs: "none", sm: "none", md: "flex"}, px: "20px", minHeight: "634px" }}>       
          <TableContainer component={Paper} sx={{ margin: "20px 0"  }}>
            <Table sx={{ minWidth: 320 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                <TableCell sx={{ fontSize: "1.2rem", fontWeight: "400" }}>Name</TableCell>
                  <TableCell align="left" sx={{ fontSize: "1.2rem", fontWeight: "400" }}>Date</TableCell>
                  <TableCell align="left" sx={{ fontSize: "1.2rem", fontWeight: "400" }}>Transaction</TableCell>
                  <TableCell align="left" sx={{ fontSize: "1.2rem", fontWeight: "400" }}>Quantity</TableCell>
                  <TableCell align="left" sx={{ fontSize: "1.2rem", fontWeight: "400" }}>Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {historyRows.map((row) => (
                  <TableRow
                    key={row.date}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row"  sx={{ px: "16px" }}>
                      {row.name}
                    </TableCell>
                    <TableCell align="left" sx={{ px: "16px" }}>{row.date}</TableCell>
                    <TableCell align="left" sx={{ px: "16px" }}>{row.type}</TableCell>
                    <TableCell align="left" sx={{ px: "16px" }}>{row.qty}</TableCell>
                    <TableCell align="left" sx={{ px: "16px" }}>{row.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
        <Box sx={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
          <Pagination count={historyData?.count} page={page} onChange={handlePageChange} color="primary" />
        </Box>

      </div>}
    </div>
  )
}

export default MarketHistory
