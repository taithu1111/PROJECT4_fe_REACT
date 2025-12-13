import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Grid,
    TextField,
    Button,
    Typography,
    Paper,
    Box,
    CircularProgress,
    Alert,
    Divider,
    Avatar,
    IconButton,
    InputAdornment,
} from "@mui/material";
import {
    Edit as EditIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    Visibility,
    VisibilityOff,
} from "@mui/icons-material";
import { getUser, updateUser, changePassword } from "../../../State/Auth/Action";
import "./Profile.css";

const Profile = () => {
    const dispatch = useDispatch();
    const { user, isLoading, error } = useSelector((state) => state.auth);
    const jwt = localStorage.getItem("jwt");

    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        mobile: "", // CHANGED from phone → mobile
        address: {
            streetAddress: "",
            city: "",
            zipCode: "",
        },
    });
    const [formErrors, setFormErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");

    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [passwordErrors, setPasswordErrors] = useState({});
    const [passwordSuccess, setPasswordSuccess] = useState("");
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const phoneRegex = /^[0-9]{3,20}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;

    useEffect(() => {
        if (jwt && !user) dispatch(getUser(jwt));
    }, [dispatch, jwt, user]);

    useEffect(() => {
        if (user) {
            // Debug: Check if addresses are being loaded
            console.log("User data:", user);
            console.log("User addresses:", user.addresses);

            // Get the first address if it exists
            const primaryAddress = user.addresses && user.addresses.length > 0 ? user.addresses[0] : null;

            console.log("Primary address:", primaryAddress);

            setFormData({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                mobile: user.mobile || "", // CHANGED: load user.mobile
                address: {
                    streetAddress: primaryAddress?.streetAddress || "",
                    city: primaryAddress?.city || "",
                    zipCode: primaryAddress?.zipCode || "",
                },
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({ ...prev, [name]: value }));
        if (passwordErrors[name]) setPasswordErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            address: { ...prev.address, [name]: value },
        }));
        if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.firstName.trim()) errors.firstName = "First name is required";
        if (!formData.lastName.trim()) errors.lastName = "Last name is required";

        if (!formData.email.trim()) errors.email = "Email is required";
        else if (!emailRegex.test(formData.email)) errors.email = "Invalid email format";

        if (formData.mobile && !phoneRegex.test(formData.mobile)) {
            errors.mobile = "Phone must be 3-20 digits"; // CHANGED key to mobile
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validatePasswordForm = () => {
        const errors = {};

        if (!passwordData.oldPassword) errors.oldPassword = "Old password is required";

        if (!passwordData.newPassword)
            errors.newPassword = "New password is required";
        else if (!passwordRegex.test(passwordData.newPassword))
            errors.newPassword =
                "Password must be at least 8 characters with uppercase, lowercase, and a number";

        if (!passwordData.confirmPassword)
            errors.confirmPassword = "Please confirm your new password";
        else if (passwordData.newPassword !== passwordData.confirmPassword)
            errors.confirmPassword = "Passwords do not match";

        setPasswordErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSave = async () => {
        setSuccessMessage("");

        if (!validateForm()) return;

        try {
            const payload = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                mobile: formData.mobile,
                addresses: [
                    {
                        streetAddress: formData.address.streetAddress,
                        city: formData.address.city,
                        zipCode: formData.address.zipCode,
                    },
                ],
            };

            await dispatch(updateUser(payload));
            setSuccessMessage("Profile updated successfully!");
            setEditMode(false);
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            console.error("Failed to update profile:", err);
        }
    };

    const handleChangePassword = async () => {
        setPasswordSuccess("");

        if (!validatePasswordForm()) return;

        try {
            await dispatch(
                changePassword({
                    oldPassword: passwordData.oldPassword,
                    newPassword: passwordData.newPassword,
                })
            );

            setPasswordSuccess("Password changed successfully!");
            setPasswordData({
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
            });

            setTimeout(() => setPasswordSuccess(""), 3000);
        } catch (err) {
            console.error("Failed to change password:", err);
        }
    };

    const handleCancel = () => {
        if (user) {
            const primaryAddress = user.addresses && user.addresses.length > 0 ? user.addresses[0] : null;

            setFormData({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "", // CHANGED
                mobile: user.mobile || "", // CHANGED
                address: {
                    streetAddress: primaryAddress?.streetAddress || "",
                    city: primaryAddress?.city || "",
                    zipCode: primaryAddress?.zipCode || "",
                },
            });
        }
        setFormErrors({});
        setEditMode(false);
        setSuccessMessage("");
    };

    const handleEdit = () => {
        setEditMode(true);
        setSuccessMessage("");
    };

    if (!jwt)
        return (
            <Box className="profile-container">
                <Paper elevation={3} className="profile-paper">
                    <Alert severity="warning">Please log in to view your profile.</Alert>
                </Paper>
            </Box>
        );

    if (isLoading && !user)
        return (
            <Box className="profile-container" sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <CircularProgress />
            </Box>
        );

    return (
        <Box className="profile-container">
            <Paper elevation={3} className="profile-paper">
                <Box className="profile-header">
                    <Avatar
                        sx={{
                            width: 80,
                            height: 80,
                            bgcolor: "#3af04d",
                            fontSize: "2rem",
                            fontWeight: "bold",
                        }}
                    >
                        {user?.firstName?.[0]}
                        {user?.lastName?.[0]}
                    </Avatar>
                    <Typography variant="h4" className="profile-title">
                        My Profile
                    </Typography>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Personal Information
                </Typography>

                {successMessage && <Alert severity="success">{successMessage}</Alert>}
                {error && !passwordSuccess && <Alert severity="error">{error}</Alert>}

                <div style={{ height: '20px', backgroundColor: 'transparent' }} />

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="First Name"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            error={!!formErrors.firstName}
                            helperText={formErrors.firstName}
                            InputProps={{ readOnly: !editMode }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Last Name"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            error={!!formErrors.lastName}
                            helperText={formErrors.lastName}
                            InputProps={{ readOnly: !editMode }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            error={!!formErrors.email}
                            helperText={formErrors.email}
                            InputProps={{ readOnly: !editMode }}
                        />
                    </Grid>

                    {/* CHANGED phone -> mobile */}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Phone Number"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleInputChange}
                            disabled={!editMode}
                            error={!!formErrors.mobile}
                            helperText={formErrors.mobile || "Optional: 3-20 digits"}
                            InputProps={{ readOnly: !editMode }}
                        />
                    </Grid>

                    {/* Address Fields */}
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 2, mb: 1 }}>
                            Address Information
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Street Address"
                            name="streetAddress"
                            multiline
                            rows={2}
                            value={formData.address.streetAddress}
                            onChange={handleAddressChange}
                            disabled={!editMode}
                            error={!!formErrors.streetAddress}
                            helperText={formErrors.streetAddress}
                            InputProps={{ readOnly: !editMode }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="City"
                            name="city"
                            value={formData.address.city}
                            onChange={handleAddressChange}
                            disabled={!editMode}
                            error={!!formErrors.city}
                            helperText={formErrors.city}
                            InputProps={{ readOnly: !editMode }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Zip Code"
                            name="zipCode"
                            value={formData.address.zipCode}
                            onChange={handleAddressChange}
                            disabled={!editMode}
                            error={!!formErrors.zipCode}
                            helperText={formErrors.zipCode}
                            InputProps={{ readOnly: !editMode }}
                        />
                    </Grid>
                </Grid>

                <Box className="profile-actions">
                    {!editMode ? (
                        <Button
                            variant="contained"
                            startIcon={<EditIcon />}
                            onClick={handleEdit}
                            sx={{ bgcolor: "#3af04d", "&:hover": { bgcolor: "#2ed03d" } }}
                        >
                            Edit Profile
                        </Button>
                    ) : (
                        <Box sx={{ display: "flex", gap: 2 }}>
                            <Button
                                variant="contained"
                                startIcon={<SaveIcon />}
                                onClick={handleSave}
                                disabled={isLoading}
                                sx={{ bgcolor: "#3af04d", "&:hover": { bgcolor: "#2ed03d" } }}
                            >
                                {isLoading ? <CircularProgress size={24} /> : "Save Changes"}
                            </Button>
                            <Button variant="outlined" startIcon={<CancelIcon />} onClick={handleCancel} disabled={isLoading}>
                                Cancel
                            </Button>
                        </Box>
                    )}
                </Box>

                <Divider sx={{ my: 4 }} />

                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Change Password
                </Typography>

                {passwordSuccess && <Alert severity="success">{passwordSuccess}</Alert>}
                {error && passwordSuccess === "" && passwordData.oldPassword && <Alert severity="error">{error}</Alert>}

                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Old Password"
                            name="oldPassword"
                            type={showOldPassword ? "text" : "password"}
                            value={passwordData.oldPassword}
                            onChange={handlePasswordChange}
                            error={!!passwordErrors.oldPassword}
                            helperText={passwordErrors.oldPassword}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowOldPassword(!showOldPassword)}>
                                            {showOldPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="New Password"
                            name="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            error={!!passwordErrors.newPassword}
                            helperText={
                                passwordErrors.newPassword ||
                                "At least 8 characters with uppercase, lowercase, and number"
                            }
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowNewPassword(!showNewPassword)}>
                                            {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Confirm New Password"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            error={!!passwordErrors.confirmPassword}
                            helperText={passwordErrors.confirmPassword}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                </Grid>

                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                    <Button
                        variant="contained"
                        onClick={handleChangePassword}
                        disabled={isLoading}
                        sx={{ bgcolor: "#ff9800", "&:hover": { bgcolor: "#f57c00" } }}
                    >
                        {isLoading ? <CircularProgress size={24} /> : "Change Password"}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default Profile;
