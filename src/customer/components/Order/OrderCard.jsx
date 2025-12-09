import React from "react";
import { Grid, Box, Typography, Chip, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import { useDispatch } from "react-redux";
import { deleteOrder } from "../../../State/Order/Action";

const OrderCard = ({ order }) => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const canDelete =
    order.orderStatus === "PENDING" ||
    order.orderStatus === "CANCELLED";

  const handleDelete = () => {
    if (!window.confirm("Delete this order?")) return;
    dispatch(deleteOrder(order.id));
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format price in VND
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Get status color and icon
  const getStatusConfig = (status) => {
    const statusLower = status?.toLowerCase() || "";

    if (statusLower.includes("delivered")) {
      return {
        color: "#4caf50",
        bgColor: "#e8f5e9",
        icon: <CheckCircleOutlineIcon fontSize="small" />,
        label: "Delivered",
      };
    }
    if (statusLower.includes("shipped") || statusLower.includes("on_the_way") || statusLower.includes("on the way")) {
      return {
        color: "#9c27b0",
        bgColor: "#f3e5f5",
        icon: <LocalShippingOutlinedIcon fontSize="small" />,
        label: "Shipped",
      };
    }
    if (statusLower.includes("returned")) {
      return {
        color: "#ff5722",
        bgColor: "#fbe9e7",
        icon: <KeyboardReturnIcon fontSize="small" />,
        label: "Returned",
      };
    }
    if (statusLower.includes("cancelled") || statusLower.includes("canceled")) {
      return {
        color: "#f44336",
        bgColor: "#ffebee",
        icon: <CancelOutlinedIcon fontSize="small" />,
        label: "Cancelled",
      };
    }
    if (statusLower.includes("processing") || statusLower.includes("placed")) {
      return {
        color: "#2196f3",
        bgColor: "#e3f2fd",
        icon: <HourglassEmptyIcon fontSize="small" />,
        label: "Placed",
      };
    }
    if (statusLower.includes("confirmed")) {
      return {
        color: "#4caf50",
        bgColor: "#e8f5e9",
        icon: <CheckCircleOutlineIcon fontSize="small" />,
        label: "Confirmed",
      };
    }
    // Default: Pending
    return {
      color: "#ff9800",
      bgColor: "#fff3e0",
      icon: <HourglassEmptyIcon fontSize="small" />,
      label: "Pending",
    };
  };

  const statusConfig = getStatusConfig(order.orderStatus);

  return (
    <Box
      className="order-card"
      onClick={() => navigate(`/account/order/${order.id}`)}
    >
      {/* Order Header */}
      <Box className="order-card-header">
        <Box>
          <Typography variant="body2" color="text.secondary">
            Order ID: <strong>{order.orderId}</strong>
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Placed on {formatDate(order.orderDate)}
          </Typography>
        </Box>
        <Chip
          icon={statusConfig.icon}
          label={statusConfig.label}
          size="small"
          sx={{
            backgroundColor: statusConfig.bgColor,
            color: statusConfig.color,
            fontWeight: 600,
          }}
        />
      </Box>

      {/* Order Items */}
      <Box className="order-items">
        {order.orderItems && order.orderItems.length > 0 ? (
          order.orderItems.slice(0, 2).map((item, index) => (
            <Grid container spacing={2} key={index} className="order-item">
              <Grid item xs={3}>
                <img
                  src={item.product?.imageUrl || item.imageUrl || "/placeholder-image.png"}
                  alt={item.product?.title || item.productName || "Product"}
                  className="order-item-image"
                />
              </Grid>
              <Grid item xs={9}>
                <Typography variant="body2" className="order-item-name">
                  {item.product?.title || item.productName || "Product"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Quantity: {item.quantity}
                </Typography>
                <Typography variant="body2" color="primary" fontWeight={600}>
                  {formatPrice(item.price)}
                </Typography>
              </Grid>
            </Grid>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            No items
          </Typography>
        )}

        {order.orderItems && order.orderItems.length > 2 && (
          <Typography variant="caption" color="text.secondary">
            +{order.orderItems.length - 2} more item(s)
          </Typography>
        )}
      </Box>

      {/* Order Footer */}
      <Box className="order-card-footer">
        <Box>
          <Typography variant="caption" color="text.secondary">
            Total Amount
          </Typography>
          <Typography variant="h6" color="primary">
            {formatPrice(order.totalPrice)}
          </Typography>
        </Box>
        <Button variant="outlined" size="small">
          View Details
        </Button>
        {canDelete && (
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={handleDelete}
            sx={{ mt: 2 }}
          >
            Delete Order
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default OrderCard;
