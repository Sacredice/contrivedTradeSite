import { useState, useEffect, memo } from 'react';
import { useUser } from "../context/UserContext"
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import useLogout from '../hooks/useLogout';
import SvgIcon from '@mui/material/SvgIcon';
import Balance from './Balance';
import ColorMode from './ColorMode';
import { useColorMode } from '../context/ColorModeContext';


function Navbar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const { isLoggedIn, setIsLoggedIn, userAuthData } = useUser();
  const { checked, setChecked } = useColorMode();
  const logout = useLogout();
  const navigate = useNavigate();

  function HomeIcon(props) {
    return (
      <SvgIcon {...props}>
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </SvgIcon>
    );
  }

  useEffect(() => {
    // console.log("isLoggedIn", isLoggedIn);
  }, [isLoggedIn])

  const pages = [
    {
      name: 'Market', onClick: () => {
        handleCloseNavMenu();
        navigate("/market");
      }
    },
    {
      name: 'Market History', onClick: () => {
        handleCloseNavMenu();
        navigate(`/${userAuthData?.username}/markethistory?page=1`);
      }
    },
  ];

  const settings = [
    {
      name: 'Profile', onClick: () => {
        handleCloseUserMenu();
        navigate(`/${userAuthData.username}`);
      }
    },
    { name: checked ? "Light Mode" : "Dark Mode", onClick: () => setChecked(prev => !prev) },
    {
      name: 'Logout', onClick: async function () {
        handleCloseUserMenu();
        await logout();
        setIsLoggedIn(false);
        localStorage.setItem("persist", false);
        navigate("/")
      }
    }
  ];

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };



  return (
    <>
      <AppBar position="static">
        <Container maxWidth="99%">
          <Toolbar disableGutters>
            <HomeIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              onClick={() => navigate("/")}
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 600,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
                cursor: "pointer",
              }}
            >
              Home
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page.name} onClick={page.onClick}>
                    <Typography textAlign="center">{page.name}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <HomeIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
            <Typography
              variant="h5"
              noWrap
              component="a"
              onClick={() => navigate("/")}
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 600,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
                cursor: "pointer",
              }}
            >
              Home
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Button
                  key={page.name}
                  onClick={page.onClick}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  {page.name}
                </Button>
              ))}
            </Box>
            <Box>
              {!isLoggedIn &&
                <Box sx={{ flexGrow: 0 }}>
                  <Button sx={{ my: 2, color: 'white', display: 'block' }} onClick={() => navigate("/login")}>Login</Button>
                </Box>}

              {isLoggedIn &&
                <Box sx={{ flexGrow: 0 }}>
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    {settings.map((setting) => (
                      <MenuItem key={setting.name} onClick={setting.onClick}>
                        <Typography textAlign="center">{setting.name}</Typography>
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
              }
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      {isLoggedIn && <Balance />}
      {!isLoggedIn && <ColorMode />}
    </>
  );
}
export default memo(Navbar);