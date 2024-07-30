import React from 'react'
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { TbCoinFilled } from "react-icons/tb";
import { useQuery } from "react-query";
import useUserDataReactQuery from '../hooks/useUserDataReactQuery';
import { useUser } from '../context/UserContext'
import { useColorMode } from '../context/ColorModeContext';

function Balance() {
    const { getUserProfile } = useUserDataReactQuery();
    const { userAuthData } = useUser();
    const { checked } = useColorMode()

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
        select: (data) => {return { creditBalance: data.creditBalance }}
    });

  return (
    <div style={{ backgroundColor: "rgba(255, 255, 255, 0)", color: checked ? "whitesmoke" : "black" }}>
        <Box sx={{ display: { xs: "flex", sm: "none"}, flexDirection: "row", justifyContent: "center", mx: 1, pt: 2 }}>
            <Box sx={{  display: "flex", flexDirection: "row", border: "1px solid", borderColor: checked ? "whitesmoke" : "black", borderRadius: "18px", paddingRight: "6px", paddingLeft: "0"}}>
                <TbCoinFilled style={{ fontSize: "1.7rem", color: "#ff9100" }} />
                <Typography sx={{ fontSize: "1.2rem", marginLeft: "6px" }}><span>Balance:</span>{data?.creditBalance}</Typography>
            </Box>
        </Box>
        <Box sx={{ display: { xs: "none", sm: "flex"}, flexDirection: "row", justifyContent: "end", mx: 2, pt: 2}}>
            <Box sx={{  display: "flex", flexDirection: "row", border: "1px solid", borderColor: checked ? "whitesmoke" : "black", borderRadius: "18px", paddingRight: "8px", paddingLeft: "0"}}>
                <TbCoinFilled style={{ fontSize: "1.7rem", color: "#ff9100" }} />
                <Typography sx={{ fontSize: "1.2rem", marginLeft: "6px" }}><span>Balance:</span>{data?.creditBalance}</Typography>
            </Box>
        </Box>
    </div>
  )
}

export default Balance
