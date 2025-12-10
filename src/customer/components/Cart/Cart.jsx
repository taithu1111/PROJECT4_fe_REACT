import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthHeaders } from "../../../api/GetAuthHeaders";
import axios from "axios";
import { Button, Typography, Paper, Box, Alert, CircularProgress, Divider } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CartItem from "./CartItem";
import { formatCurrency } from "../../../comon/formatCurrency";

const Cart = ({ cart, setCart }) => {
  const navigate = useNavigate();
  const [cartData, setCartData] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch cart from backend
  const fetchCart = () => {
    setIsLoading(true);
    setError(null);

    axios
      .get(`http://localhost:8080/api/cart`, {
        headers: getAuthHeaders(),
      })
      .then((res) => {
        console.log("Cart data from backend:", res.data);
        setCartData(res.data);
        setCartItems(res.data.cartItems || []);
      })
      .catch((err) => {
        console.error("Error fetching cart:", err);
        setError("Failed to load cart. Please try again.");
        setCartItems([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    navigate("/checkout?step=2");
  };

  const handleContinueShopping = () => {
    navigate("/products");
  };

  if (isLoading) {
    return (
      <Box className="flex items-center justify-center min-h-screen">
        <CircularProgress />
      </Box>
    );
  }

  const totalPrice = cartData?.totalPrice || 0;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <span className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => navigate("/")}>
            Home
          </span>
          <span className="text-sm text-gray-500 mx-2">/</span>
          <span className="text-sm font-medium text-gray-900">Shopping Cart</span>
        </nav>

        {/* Page Title */}
        <div className="mb-8">
          <Typography variant="h4" className="font-bold text-gray-900 flex items-center gap-2">
            <ShoppingCartIcon fontSize="large" />
            Shopping Cart
          </Typography>
          {cartItems.length > 0 && (
            <Typography variant="body2" className="text-gray-600 mt-1">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
            </Typography>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        {/* Cart Content */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {cartItems.length > 0 ? (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <CartItem key={item.id} item={item} fetchCart={fetchCart} />
                ))}
              </div>
            ) : (
              <Paper className="p-12 text-center">
                <ShoppingCartIcon sx={{ fontSize: 80, color: 'gray', mb: 2 }} />
                <Typography variant="h6" className="text-gray-600 mb-4">
                  Your cart is empty
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleContinueShopping}
                  sx={{
                    bgcolor: "#34D399",
                    "&:hover": { bgcolor: "#10B981" }
                  }}
                >
                  Continue Shopping
                </Button>
              </Paper>
            )}
          </div>

          {/* Price Summary */}
          <div className="lg:col-span-1 mt-8 lg:mt-0">
            <Paper className="p-6 sticky top-8">
              <Typography variant="h6" className="font-bold mb-4 text-gray-900">
                Order Summary
              </Typography>

              <Divider className="mb-4" />

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</span>
                  <span className="font-semibold">
                    {formatCurrency(totalPrice, '$')}
                  </span>
                </div>

                <div className="flex justify-between text-gray-700">
                  <span>Discount</span>
                  <span className="text-green-600 font-semibold">-$0.00</span>
                </div>

                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="text-green-600 font-semibold">FREE</span>
                </div>

                <Divider />

                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2">
                  <span>Total</span>
                  <span className="text-green-600">
                    {formatCurrency(totalPrice, '$')}
                  </span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                variant="contained"
                fullWidth
                disabled={cartItems.length === 0}
                sx={{
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  bgcolor: "#34D399",
                  "&:hover": { bgcolor: "#10B981" },
                  "&:disabled": { bgcolor: "#D1D5DB" }
                }}
              >
                Proceed to Checkout
              </Button>

              <Button
                onClick={handleContinueShopping}
                variant="outlined"
                fullWidth
                sx={{
                  mt: 2,
                  py: 1.5,
                  borderColor: "#34D399",
                  color: "#10B981",
                  "&:hover": {
                    borderColor: "#10B981",
                    bgcolor: "rgba(16, 185, 129, 0.04)"
                  }
                }}
              >
                Continue Shopping
              </Button>
            </Paper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
