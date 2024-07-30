import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function LoadingSpinner() {
  return (
    <Box sx={{ display: 'flex', position: "absolute", top: "calc(50% - 2rem)", left: "calc(50% - 2rem)"}}>
      <CircularProgress size="4rem" />
    </Box>
  );
}
