import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from "../context/UserContext"
import { useColorMode } from '../context/ColorModeContext';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import { useForm } from "react-hook-form";
import axios from '../api/axios';
import LoadingButton from '@mui/lab/LoadingButton';


function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="#">
        FakeTradeGame
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

export default function SignUp() {
  const { isLoggedIn, setIsLoggedIn, userAuthData, setUserAuthData, persist, setPersist } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [remember, setRemember] = useState(persist);
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";

  const { register, formState: { errors }, handleSubmit } = useForm();

  //changing persist with checkbox rerender form and other inputs reset to empty string
  // instead 

  // useEffect(() => {
  //   localStorage.setItem("persist", persist)
  // }, [persist])

  const onSubmit = async (d) => {
    localStorage.setItem("persist", !!d.remember);
    // const data = new FormData(event.currentTarget);
    const formData = {
      user: d.userName,
      pwd: d.password,
      remember: d.remember,
    };
    console.log(formData);
    // setPersist(formData.remember);

    try {
      setIsLoading(true);
      const response = await axios.post("/login", formData, {
        headers: { "Content-Type": 'application/json'},
        withCredentials: true
      });
      const { accessToken, creditBalance, roles } = response.data;
      setIsLoggedIn(true);
      setUserAuthData({ accessToken, creditBalance, username: formData.user });
      setError(null);
      navigate(from, { replace: true });
    } catch(err) {
      console.log(`Error ${err.message}`);
      setError(err);
    } finally {
      setIsLoading(false);
    }
    
  };

  return (
    <div style={{ backgroundColor: "rgba(255, 255, 255, 0)"}}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center', 
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
              <TextField
                error={Boolean(errors.userName)}
                margin="normal"
                required
                fullWidth
                id="userName"
                label="User Name"
                name="userName"
                maxLength="20"
                autoComplete="userName"
                autoFocus
                inputProps={{ maxLength: 20 }}
                {...register("userName", {
                  minLength: {
                    value: 4,
                    message: "Username must be greater than 3 characters"
                  },
                  required: "Username is required"
                })}
                helperText={errors.userName?.message}
              />
              <TextField
                error={Boolean(errors.password)}
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                inputProps={{ maxLength: 20 }}
                {...register("password", {
                  required: "Password required",
                  minLength: {
                    value: 4,
                    message: "Password must be greater than 3 characters"
                  },
                })}
              />
              {error && <Alert variant="filled" severity={error.code === "ERR_NETWORK" ? "error" : "warning"}>{error.response?.data.msg || error.message}</Alert>}
              <FormControlLabel
                control={<Checkbox {...register("remember")} name='remember' checked={remember} onChange={(e) => setRemember(!remember)} value="remember" color="primary" />}
                label="Remember me"
              />
              {isLoading 
              ? <LoadingButton loading variant='contained' fullWidth sx={{ mt: 3, mb: 2}}>Sign In</LoadingButton>
              : <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  >
                    Sign In
                </Button>
              }
              
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link onClick={() => navigate("/register")} variant="body2" sx={{ cursor: "pointer"}}>
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
    </div>
  );
}