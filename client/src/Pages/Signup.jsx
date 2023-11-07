import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import axios from "../utils/axios";
import {useNavigate} from "react-router-dom"

function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (!formData.username || !formData.email || !formData.password) {
        setError("Please provide all required fields.");
        return;
      }
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        setError("Please provide a valid email address.");
        return;
      }
      if (formData.password.length < 6) {
        setError("Password should be at least 6 characters long.");
        return;
      }
      setLoading(true);

      const res = await axios.post("/auth/signup", formData,{
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(res);
     
      setFormData({
        username: "",
        email: "",
        password: "",
      });
      if (res.data.success === false) {
        setError(res.data.message);
        setLoading(false);
      
        return;
      }
   
      setLoading(false);
      setError(null);
     
      navigate('/login')
    } catch (error) {
      setLoading(false);
      if (error.response) {
        setError(error.response.data.message); 
      } else {
        setError("An unexpected error occurred. Please try again."); 
      }
      
    }
  };
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            value={formData.username}
            onChange={handleChange}
            margin="normal"
            required
            fullWidth
            id="username"
            label="user name"
            name="username"
            autoComplete="username"
            autoFocus
          />
          <TextField
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          {error && (
            <Typography variant="h6" gutterBottom sx={{ color: 'red' }} >
              {error}
            </Typography>
          )}
          <Button
            disabled={loading}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? "loading" : "Sign up"}
          </Button>
          <Grid container>
            <Grid item>
              <Link href="/login" variant="body2">
                {"Have an account? Login"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default Signup;
