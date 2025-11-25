import { useState } from "react";
import { Button, TextField } from "@mui/material";
import axios from "axios";
import { API_BASE_URL } from "../../config/ApiConfig";

export default function ForgotPasswordForm({ onSwitchMode }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/forgot-password`, {
        email,
      });

      setMessage(response.data);
    } catch (err) {
      setError("Error sending reset request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 w-full">
      <h2 className="text-xl font-semibold mb-4 text-center">Forgot Password</h2>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <TextField
          label="Email Address"
          type="email"
          fullWidth
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          className="bg-blue-600"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>

      {message && (
        <p className="text-green-600 text-center mt-3 text-sm">{message}</p>
      )}
      {error && (
        <p className="text-red-600 text-center mt-3 text-sm">{error}</p>
      )}

      <p className="text-center text-sm mt-3">
        Remembered your password?{" "}
        <Button variant="text" size="small" onClick={() => onSwitchMode("login")}>
          Login
        </Button>
      </p>
    </div>
  );
}
