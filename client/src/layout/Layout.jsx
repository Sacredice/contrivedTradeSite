import { Suspense } from 'react'
import Navbar from "../components/Navbar"
import { Outlet } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner'
import { useColorMode } from '../context/ColorModeContext'
import { ThemeProvider } from '@mui/material/styles';
import Footer from '../components/Footer'

function Layout() {
  const { theme, checked } = useColorMode();

  return (
    <div style={{ backgroundColor: checked ? "black" : "white", display: "flex", flexDirection: "column", minHeight: "100vh"}}>
      <ThemeProvider theme={theme}>
        <Navbar />
        <Suspense fallback={<LoadingSpinner />}>
          <Outlet />
        </Suspense>
        <Footer/>
      </ThemeProvider>
    </div>
  )
}

export default Layout
