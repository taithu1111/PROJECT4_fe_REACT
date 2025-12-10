import { Grid, Button, TextField, Box } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import AddressCard from "../AddressCard/AddressCard";

const DeliveryAddressForm = ({ onSubmitAddress }) => {
  const { user } = useSelector((store) => store.auth);

  // State for live preview of address
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phoneNumber: "",
  });

  // Populate first and last name from user profile
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phoneNumber: user.mobile || "",
        address: user.addresses?.[0]?.streetAddress || "",
        city: user.addresses?.[0]?.city || "",
        zip: user.addresses?.[0]?.zipCode || "",
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const address = {
      streetAddress: data.get("address"),
      city: data.get("city"),
      zipCode: data.get("zip"),
    };

    console.log("address sent to API:", address);

    // Send data to Checkout.jsx to call API
    if (onSubmitAddress) {
      onSubmitAddress(address);
    }
  };

  return (
    <div>
      <Grid container spacing={4}>
        <Grid
          item
          xs={12}
          lg={5}
          className="border rounded-e-md shadow-md h-[30.5rem] overflow-y-scroll"
        >
          <div className="p-5 py-7 border-b">
            <AddressCard address={formData} />
          </div>
        </Grid>

        <Grid item xs={12} lg={7}>
          <Box className="border rounded-s-md shadow-md p-5">
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    id="firstName"
                    name="firstName"
                    label="First Name"
                    fullWidth
                    autoComplete="given-name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    InputProps={{
                      readOnly: true,
                    }}
                    disabled
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    id="lastName"
                    name="lastName"
                    label="Last Name"
                    fullWidth
                    autoComplete="family-name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    InputProps={{
                      readOnly: true,
                    }}
                    disabled
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    id="address"
                    name="address"
                    label="Address"
                    fullWidth
                    multiline
                    rows={4}
                    autoComplete="street-address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    id="city"
                    name="city"
                    label="City"
                    fullWidth
                    autoComplete="address-level2"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    id="zip"
                    name="zip"
                    label="Zip"
                    fullWidth
                    autoComplete="postal-code"
                    value={formData.zip}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    id="phoneNumber"
                    name="phoneNumber"
                    label="Phone Number"
                    fullWidth
                    autoComplete="tel"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    InputProps={{
                      readOnly: true,
                    }}
                    disabled
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    sx={{ py: 1.5, mt: 2, bgcolor: "#9553fe" }}
                    size="large"
                    variant="contained"
                    type="submit"
                    fullWidth
                  >
                    Deliver to This Address
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default DeliveryAddressForm;
