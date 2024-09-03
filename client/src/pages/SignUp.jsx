import { useState } from 'react';
import { useNavigate } from "react-router-dom"
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useForm } from "react-hook-form";
import axios from '../api/axios';

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

const defaultTheme = createTheme();

export default function SignUp() {
  const [checked, setChecked] = useState(false);
  const [errSignUp, setErrSignUp] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { register, formState: { errors }, handleSubmit } = useForm();



  const onSubmit = async (d) => {
    // const data = new FormData(event.currentTarget);
    const formData = {
      user: d.userName,
      email: d.email,
      pwd: d.password,
      remember: d.remember,
    };
    try {
      setIsLoading(true);
      const response = await axios.post("/register", formData);
      console.log(response.data);
      navigate("/login");
    } catch(err) {
      console.log(`Error ${err.message}`);
      setErrSignUp(err);
      console.log(err);
    } finally {
      setIsLoading(false);
    }
    
  };

  return (
    <ThemeProvider theme={defaultTheme}>
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
            Sign up
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
              error={Boolean(errors.email)}
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              inputProps={{ maxLength: 30 }}
              {...register("email", {
                required: "Email required",
                pattern: {
                  value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                  message: "Email not valid"
                }
              })}
              helperText={errors.email?.message}
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
            {errSignUp && <Alert variant="filled" severity={errSignUp.code === "ERR_NETWORK" ? "error" : "warning"}>{errSignUp.response?.data.msg || errSignUp.message}</Alert>}
            <FormControlLabel
              control={<Checkbox {...register("remember")} name='remember' checked={checked} onChange={(e) => setChecked(!checked)} value="remember" color="primary" />}
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
                    Sign Up
                </Button>
              }
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}