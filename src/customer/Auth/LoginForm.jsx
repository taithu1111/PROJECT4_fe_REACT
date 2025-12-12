import { Grid, TextField, Button, Typography, IconButton, InputAdornment } from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, getUser } from "../../State/Auth/Action";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginForm = ({ onSwitchMode, onLoginSuccess }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState(null);
  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};

    if (!formData.email) validationErrors.email = "Email is required";
    else if (!emailRegex.test(formData.email)) validationErrors.email = "Invalid email format";

    if (!formData.password) validationErrors.password = "Password is required";
    else if (!passwordRegex.test(formData.password))
      validationErrors.password =
        "Password must be at least 8 characters, include uppercase, lowercase, and a number";

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      const token = await dispatch(login(formData));
      const message = localStorage.getItem("message");
      console.log("Login message:", message);

      if (token) {
        await dispatch(getUser(token));
        console.log("Logged in user:", user);
        toast.success("Login successful! Welcome back.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        onLoginSuccess(); // close modal
        if (message === "Admin") {
          navigate("/admin");
        } else {
          navigate("/"); // user bình thường
        }
      }
    } catch (err) {
      toast.error(err.message || "Login failed. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <ToastContainer />
      <Typography variant="h5" align="center" gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              required
              id="email"
              name="email"
              label="Email"
              fullWidth
              value={formData.email}
              onChange={handleInputChange}
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              label="Password"
              fullWidth
              value={formData.password}
              onChange={handleInputChange}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((prev) => !prev)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} className="flex justify-center">
            <Button type="submit" variant="contained" size="large" sx={{ bgcolor: "#3af04d" }}>
              Login
            </Button>
          </Grid>
        </Grid>
      </form>

      <div className="flex justify-center flex-col items-center mt-3">
        <p>Don't have an account?</p>
        <Button onClick={() => onSwitchMode("register")} size="small">
          Register
        </Button>
        <Button onClick={() => onSwitchMode("forgot")} size="small" variant="text">
          Forgot Password?
        </Button>
      </div>
    </div>
  );
};

export default LoginForm;
