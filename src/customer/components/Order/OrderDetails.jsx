import React, { useEffect } from "react";
import { formatCurrency } from "../../../comon/formatCurrency";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import AddressCard from "../AddressCard/AddressCard";
import OrderTracker from "./OrderTracker";
import Grid from "@mui/material/Grid";
import { Box, Button, CircularProgress, Typography, Alert } from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { getOrderById, confirmedOrder } from "../../../State/Order/Action";

const OrderDetails = () => {
  const dispatch = useDispatch();
  const { orderId } = useParams();
  const { order, isLoading, error } = useSelector((store) => store.order);

  useEffect(() => {
    dispatch(getOrderById(orderId));
  }, [dispatch, orderId]);

  const handleConfirmOrder = () => {
    dispatch(confirmedOrder(orderId));
  };

  const getActiveStep = (status) => {
    switch (status) {
      case "PLACED":
      case "PENDING":
        return 0;
      case "CONFIRMED":
        return 1;
      case "SHIPPED":
        return 2;
      case "OUT_FOR_DELIVERY":
        return 3;
      case "DELIVERED":
        return 4;
      default:
        return 0;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-5 lg:px-24">
        <Alert severity="error">{error}</Alert>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="px-5 lg:px-24">
      <div>
        <h1 className="font-bold py-7 text-lg">Delivery Address</h1>
        <AddressCard address={order.shippingAddress} />
      </div>

      <div className="py-20">
        <OrderTracker activeStep={getActiveStep(order.orderStatus)} />
      </div>

      {/* Admin or user action to confirm order - strictly for demo purposes or if user can confirm receipt */}
      {(order.orderStatus === "PLACED" || order.orderStatus === "PENDING") && (
        <div className="flex justify-end mb-5">
          <Button
            variant="contained"
            sx={{ bgcolor: deepPurple[500], "&:hover": { bgcolor: deepPurple[700] } }}
            onClick={handleConfirmOrder}
          >
            Confirm Order
          </Button>
        </div>
      )}

      <Grid container className="space-y-5 " >
        {order.orderItems?.map((item) => (
          <Grid
            item
            container
            className="shadow-xl rounded-md p-5 border "
            sx={{ alignItems: "center", justifyContent: "space-between" }}
            key={item.id}
          >
            <Grid item xs={6}>
              <div className=" flex items-center space-x-4">
                <img
                  className="w-[5rem] h-[5rem] object-cover object-top"
                  src={item.product?.imageUrl || item.imageUrl || ""}
                  alt={item.product?.title || item.productName || "Product"}
                />
                <div className="space-y-2 ml-5">
                  <p className="font-semibold">{item.product?.title || item.productName}</p>
                  <p className="space-x-5 opacity-60 text-xs font-semibold">
                    <span>Color: {item.product?.color || item.color}</span>
                    <span>Size: {item.size}</span>
                  </p>
                  <p>Seller: {item.product?.brand || item.brand}</p>
                  <p>{formatCurrency(item.price)}</p>
                </div>
              </div>
            </Grid>

            <Grid>
              <Box sx={{ color: deepPurple[500] }}>
                <StarBorderIcon sx={{ fontSize: "2rem" }} className="px-2" />
                <span>Rate & Review</span>
              </Box>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default OrderDetails;
