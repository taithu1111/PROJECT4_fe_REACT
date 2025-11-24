import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button, TextField, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { API_BASE_URL } from "../../config/ApiConfig";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // 🔹 visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/reset-password`, {
        token,
        newPassword: password,
      });

      setMessage(response.data);
    } catch (err) {
      setError(err.response?.data || "Error resetting password");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Reset Password
        </h2>

        <form onSubmit={handleReset} className="flex flex-col space-y-4">
          
          {/* 🔹 New Password */}
          <TextField
            label="New Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

          {/* 🔹 Confirm Password */}
          <TextField
            label="Confirm Password"
            type={showConfirm ? "text" : "password"}
            fullWidth
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirm((prev) => !prev)}>
                    {showConfirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button type="submit" variant="contained" className="bg-blue-600">
            Reset Password
          </Button>
        </form>

        {message && (
          <p className="text-green-600 text-center mt-3 text-sm">{message}</p>
        )}
        {error && (
          <p className="text-red-600 text-center mt-3 text-sm">{error}</p>
        )}
      </div>
    </div>
  );
}
