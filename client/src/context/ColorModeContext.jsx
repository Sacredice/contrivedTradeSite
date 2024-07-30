import { createContext, useContext, useState } from 'react'
import { createTheme } from '@mui/material/styles';
import { blue, orange } from '@mui/material/colors';

const ColorModeContext = createContext();

const ColorModeProvider = ({ children }) => {
    const [checked, setChecked] = useState(false);

    const mode = checked ? "dark" : "light";

    const theme = createTheme({
        breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536,
        },
        },
        palette: {
        mode,
        primary: blue,
        // secondary: {
        //   light: '#b26500',
        //   main: '#ff9100',
        //   dark: '#ffa733',
        //   contrastText: '#000',
        // },
        secondary: orange
        },
    });



    return (
        <ColorModeContext.Provider value={{
            checked,
            setChecked,
            theme,
        }}>
            {children}
        </ColorModeContext.Provider>
        
    )
}

const useColorMode = () => {
    const context = useContext(ColorModeContext);

    if (context === undefined) {
        throw new Error("useColorMode must be used within TradeModalProvider");
    }
    return context;
}

export { useColorMode, ColorModeProvider };