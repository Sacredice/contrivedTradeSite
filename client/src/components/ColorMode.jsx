import Switch from '@mui/material/Switch';
import Box from '@mui/material/Box';
import { useColorMode } from '../context/ColorModeContext';
import { Typography } from '@mui/material';

function ColorMode() {
    const { checked, setChecked } = useColorMode();

    return (
        <Box sx={{ display: { xs: "none", sm: "flex"}, flexDirection: "row", justifyContent: "end", mx: 1, pt: 1}}>
            <Box sx={{  display: "flex", flexDirection: "row", paddingRight: "4px", paddingLeft: "0"}}>
                <Typography sx={{ marginTop: "7px", color: checked ? "whitesmoke" : "black" }} >Dark Mode</Typography>
                <Switch
                    checked={checked}
                    onChange={() => setChecked( prev => !prev )}
                    inputProps={{ 'aria-label': 'controlled' }}
                />
          </Box>
        </Box>
    )
}

export default ColorMode
