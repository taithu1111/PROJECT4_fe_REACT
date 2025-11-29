import { Grid, TextField, Button, Typography, IconButton, InputAdornment } from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { register } from "../../State/Auth/Action";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Register = ({ onSwitchMode }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    mobile: "",
    address: {
      streetAddress: "",
      city: "",
      zipCode: "",
    },
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // 🔹 Password regex requirement
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;

  // 🔹 Email regex requirement
  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

  // 🔹 Phone regex requirement
  const phoneRegex = /^[0-9]{10,15}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};

    // 🔹 First and Last Name
    if (!formData.firstName) validationErrors.firstName = "First Name is required";
    if (!formData.lastName) validationErrors.lastName = "Last Name is required";

    // 🔹 Email validation
    if (!formData.email) {
      validationErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      validationErrors.email = "Invalid email format";
    }

    // 🔹 Password validation
    if (!formData.password) {
      validationErrors.password = "Password is required";
    } else if (!passwordRegex.test(formData.password)) {
      validationErrors.password =
        "Password must be at least 8 characters and include uppercase, lowercase, and a number";
    }

    // 🔹 Phone validation
    if (!formData.mobile) {
      validationErrors.mobile = "Phone number is required";
    } else if (!phoneRegex.test(formData.mobile)) {
      validationErrors.mobile = "Phone must be 10-15 digits";
    }

    // 🔹 Address validation
    if (!formData.address.streetAddress) {
      validationErrors.streetAddress = "Street address is required";
    }
    if (!formData.address.city) {
      validationErrors.city = "City is required";
    }
    if (!formData.address.zipCode) {
      validationErrors.zipCode = "Zip code is required";
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const message = await dispatch(register(formData));
        alert(message || "Registration successful! Please login.");
        onSwitchMode(); // switch to login inside modal
      } catch (error) {
        alert("Registration failed: " + error.message);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value },
    }));
  };

  return (
    <div>
      <Typography variant="h5" align="center" gutterBottom style={{ marginBottom: "25px" }}>
        Register
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="firstName"
              name="firstName"
              label="First Name"
              fullWidth
              value={formData.firstName}
              onChange={handleInputChange}
              error={!!errors.firstName}
              helperText={errors.firstName}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="lastName"
              name="lastName"
              label="Last Name"
              fullWidth
              value={formData.lastName}
              onChange={handleInputChange}
              error={!!errors.lastName}
              helperText={errors.lastName}
            />
          </Grid>
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
              id="mobile"
              name="mobile"
              label="Phone Number"
              fullWidth
              value={formData.mobile}
              onChange={handleInputChange}
              error={!!errors.mobile}
              helperText={errors.mobile || "10-15 digits"}
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
                    <IconButton onClick={() => setShowPassword(prev => !prev)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          {/* Address Fields */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" className="font-semibold text-gray-700 mb-2">
              Address Information
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField
              required
              id="streetAddress"
              name="streetAddress"
              label="Street Address"
              fullWidth
              multiline
              rows={2}
              value={formData.address.streetAddress}
              onChange={handleAddressChange}
              error={!!errors.streetAddress}
              helperText={errors.streetAddress}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="city"
              name="city"
              label="City"
              fullWidth
              value={formData.address.city}
              onChange={handleAddressChange}
              error={!!errors.city}
              helperText={errors.city}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="zipCode"
              name="zipCode"
              label="Zip Code"
              fullWidth
              value={formData.address.zipCode}
              onChange={handleAddressChange}
              error={!!errors.zipCode}
              helperText={errors.zipCode}
            />
          </Grid>

          <Grid item xs={12} className="flex justify-center">
            <Button type="submit" variant="contained" size="large" sx={{ bgcolor: "#3af04d" }}>
              Register
            </Button>
          </Grid>
        </Grid>
      </form>

      <div className="flex justify-center flex-col items-center mt-3">
        <p>Already have an account?</p>
        <Button onClick={() => onSwitchMode("login")} size="small">
          Login
        </Button>
      </div>
    </div>
  );
};

export default Register;
