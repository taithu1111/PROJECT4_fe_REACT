import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AddressCard from "../AddressCard/AddressCard";
import { Button, Paper, Typography, Divider, CircularProgress } from "@mui/material";
import placeholderImage from "../../../assets/images/placeholder.png";
import { formatCurrency } from "../../../comon/formatCurrency";

const OrderSummary = () => {
  const navigate = useNavigate();
  const { order, isLoading, error } = useSelector((store) => store.order);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center">
        <Typography variant="h6" color="error" className="mb-4">
          Error: {error}
        </Typography>
        <Button variant="contained" onClick={() => navigate("/cart")}>
          Return to Cart
        </Button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-10 text-center">
        <Typography variant="h6" className="mb-4">
          No order found. Please complete the delivery address step first.
        </Typography>
        <Button variant="contained" onClick={() => navigate("/checkout?step=2")}>
          Go to Delivery Address
        </Button>
      </div>
    );
  }

  const totalItems = order.totalItem || order.orderItems?.length || 0;
  const subtotal = order.totalPrice || 0;
  const discount = order.discount || 0;
  const totalAmount = order.totalDiscountedPrice || subtotal - discount;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Title */}
      <Typography variant="h5" className="font-bold mb-6 text-gray-900">
        Order Summary
      </Typography>

      {/* Shipping Address */}
      <div className="mb-6">
        <Typography variant="h6" className="font-semibold mb-3 text-gray-800">
          Shipping Address
        </Typography>
        <Paper className="p-5 shadow-md rounded-md border">
          <AddressCard address={order.shippingAddress} />
        </Paper>
      </div>

      <div className="lg:grid lg:grid-cols-3 lg:gap-8">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <Typography variant="h6" className="font-semibold mb-4 text-gray-800">
            Order Items ({totalItems} {totalItems === 1 ? 'item' : 'items'})
          </Typography>

          <div className="space-y-4">
            {order.orderItems && order.orderItems.length > 0 ? (
              order.orderItems.map((item, idx) => (
                <Paper key={idx} className="p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 flex-shrink-0">
                      <img
                        src={item.product?.imageUrl || placeholderImage}
                        alt={item.product?.title || "Product"}
                        className="w-full h-full object-cover rounded-md border"
                        onError={(e) => {
                          e.target.src = placeholderImage;
                        }}
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <Typography variant="subtitle1" className="font-semibold text-gray-900">
                        {item.product?.title || "Product"}
                      </Typography>
                      <Typography variant="body2" className="text-gray-600 mt-1">
                        {item.product?.description || ""}
                      </Typography>
                      <div className="flex gap-4 mt-2 text-sm text-gray-600">
                        <span>Quantity: {item.quantity}</span>
                        <span>•</span>
                        <span className="font-semibold text-green-600">
                          {formatCurrency(item.price || 0, '$')}
                        </span>
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="text-right">
                      <Typography variant="subtitle1" className="font-bold text-gray-900">
                        {formatCurrency((item.price || 0) * (item.quantity || 1), '$')}
                      </Typography>
                    </div>
                  </div>
                </Paper>
              ))
            ) : (
              <Typography className="text-gray-500 text-center py-8">
                No items in this order
              </Typography>
            )}
          </div>
        </div>

        {/* Price Summary */}
        <div className="lg:col-span-1 mt-8 lg:mt-0">
          <Paper className="p-6 sticky top-8 shadow-lg">
            <Typography variant="h6" className="font-bold mb-4 text-gray-900">
              Price Details
            </Typography>

            <Divider className="mb-4" />

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
                <span className="font-semibold">{formatCurrency(subtotal, '$')}</span>
              </div>

              <div className="flex justify-between text-gray-700">
                <span>Discount</span>
                <span className="text-green-600 font-semibold">
                  -{formatCurrency(discount, '$')}
                </span>
              </div>

              <div className="flex justify-between text-gray-700">
                <span>Delivery</span>
                <span className="text-green-600 font-semibold">FREE</span>
              </div>

              <Divider />

              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2">
                <span>Total Amount</span>
                <span className="text-green-600">{formatCurrency(totalAmount, '$')}</span>
              </div>
            </div>

            <Button
              variant="contained"
              fullWidth
              sx={{
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                bgcolor: "#9155fd",
                "&:hover": { bgcolor: "#7c3aed" }
              }}
              onClick={() => {
                // TODO: Implement payment functionality
                alert("Payment functionality will be implemented soon!");
              }}
            >
              Proceed to Payment
            </Button>

            <Typography variant="caption" className="text-gray-500 mt-3 block text-center">
              Order ID: #{order.id}
            </Typography>
          </Paper>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
