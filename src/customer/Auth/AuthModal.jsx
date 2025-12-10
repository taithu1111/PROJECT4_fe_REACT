import { Box, Modal } from "@mui/material";
import React, { useState } from "react";
import Register from "./Register";
import LoginForm from "./LoginForm";
import ForgotPasswordForm from "./ForgotPasswordForm";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  p: 4,
};

export default function AuthModal({ handleClose, open, initialMode = "register" }) {
  const [mode, setMode] = useState(initialMode);

  const handleLoginSuccess = () => {
    handleClose(); // close modal after login
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          ...style,
          backgroundColor: "white",
          boxShadow: "lg",
          border: "2px solid",
          borderColor: "purple.600",
          borderRadius: "md",
          padding: "40px",
        }}
      >
        {mode === "login" && <LoginForm onSwitchMode={setMode} onLoginSuccess={handleLoginSuccess} />}
        {mode === "register" && <Register onSwitchMode={setMode} />}
        {mode === "forgot" && <ForgotPasswordForm onSwitchMode={setMode} />}
      </Box>
    </Modal>
  );
}
