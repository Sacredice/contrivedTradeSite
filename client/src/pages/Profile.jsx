import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useUser } from "../context/UserContext"
import { useQuery, useMutation, useQueryClient } from "react-query";
import useUserDataReactQuery from "../hooks/useUserDataReactQuery"
import LoadingSpinner from '../components/LoadingSpinner';


function Profile() {
  const { setUserProfileData } = useUser();
  const { getUserProfile, updateUserProfile } = useUserDataReactQuery();
  const navigate = useNavigate();
  const params = useParams();
  const queryClient = useQueryClient();

  const {
    isLoading,
    isError,
    error,
    data
  } = useQuery(["userProfile", params.username], () => getUserProfile(params.username), {
    enabled: !!params.username,
    refetchOnWindowFocus: false,
    staleTime: 10 * 60 * 1000,
    cacheTime: 15 * 60 * 1000,
  });

  const updateUserProfileMutation = useMutation(updateUserProfile, {
    onSuccess: () => {
      // Invalidates cache and refetch
      queryClient.invalidateQueries("userProfile");
    }
  })

  function createData(name, value) {
    return { name, value };
  }
  
  const userRows = [
    createData("Username", data?.username),
    createData('Email', data?.email),
    createData('Credit Balance:', data?.creditBalance),
  ];

  function createInvestData(name, value) {
    return { name, value };
  }
  const investmentsRows = [
    createInvestData("Gold", data?.investments.gold),
    createInvestData("Uranium", data?.investments.uranium),
    createInvestData("RIPCoin", data?.investments.ripCoin),
    createInvestData("TIBCoin", data?.investments.tibCoin),
    createInvestData("Diamond", data?.investments.diamond),
    createInvestData("Plutonium", data?.investments.plutonium),
  ];

  // useEffect(() => {
  //   let isMounted = true;
  //   const controller = new AbortController();
  //   console.log("effect run");

 
  //   async function getUserProfile() {  
  //     try {
  //       const response = await axiosPrivate.get(`/${params.username}`, {
  //         signal: controller.signal
  //       });
  //       console.log("profile component fetch", response.data);
  //       const { username, email, creditBalance, investments } = response.data;
  //       isMounted && setUserAuthData(prev => {
  //         return { ...prev, username, email, creditBalance, investments };
  //       });
  //     } catch (err) {
  //       console.error(err);
  //     }
      
  //   }

  //   getUserProfile();
    
  //   console.log(userAuthData);      
  //   return () => {
  //     isMounted = false;
  //     isMounted && controller.abort();
  //   }

  // }, [])


  if (isLoading) {
    return (
    <LoadingSpinner />
  )}
  if (isError) return <h2>{error.message}</h2>;


  return (
    <article>
      <div style={{ position: "relative", marginTop: "30px", marginLeft: "4px", marginRight: "4px" }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: "310px" }} size="small" aria-label="a dense table">
            <TableHead>
                <TableRow>
                  <TableCell sx={{ fontSize: "1.5rem", fontWeight: "500" }}>Profile</TableCell>
                  <TableCell></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
              {userRows.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div style={{ position: "relative", marginTop: "15px", marginLeft: "4px", marginRight: "4px" }}>
      <TableContainer component={Paper}>
          <Table sx={{ minWidth: 310 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: "1.5rem", fontWeight: "500" }}>Investments</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {investmentsRows.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </article>
  )
}

export default Profile
