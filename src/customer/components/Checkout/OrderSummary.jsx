import React, { useEffect, useState } from "react";
import AddressCard from "../AddressCard/AddressCard";
import { Button } from "@mui/material";
import CartItem from "../Cart/CartItem";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { getAuthHeaders } from "../../../api/GetAuthHeaders";

const OrderSummary = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const orderId = query.get("orderId");

  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (orderId) {
      axios
        .get(`http://localhost:8080/api/orders/${orderId}`, {
          headers: getAuthHeaders(),
        })
        .then((res) => {
          setOrder(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, [orderId]);

  if (!order) return <p className="p-10">Loading...</p>;

  return (
    <div>
      {/* Địa chỉ giao hàng */}
      <div className="p-5 shadow-lg rounded-s-md border">
        <AddressCard address={order.shippingAddress} />
      </div>

      <div>
        <div className="lg:grid grid-cols-3  relative">
          {/* Cart Items */}
          <div className="col-span-2">
            {order.orderItems.map((item, idx) => (
              <CartItem key={idx} item={item} />
            ))}
          </div>

          {/* Tổng tiền */}
          <div className="px-5 sticky top-0 h-[100vh] mt-5 lg:mt-0">
            <div className=" border">
              <p className="uppercase opacity-60 font-bold pb-4">
                Price Details
              </p>
              <hr />

              <div className="space-y-3 font-semibold mb-10">
                <div className="flex justify-between pt-3 text-black">
                  <span>Price</span>
                  <span className="text-green-600">${order.totalPrice}</span>
                </div>

                <div className="flex justify-between pt-3">
                  <span>Discount</span>
                  <span className="text-green-600">${order.discount}</span>
                </div>

                <div className="flex justify-between pt-3 text-black">
                  <span>Delivery</span>
                  <span>Free</span>
                </div>

                <div className="flex justify-between pt-3 text-black font-bold">
                  <span>Total Amount</span>
                  <span>${order.totalAmount}</span>
                </div>
              </div>

              <Button
                variant="contained"
                className="w-full mt-5"
                sx={{ px: "2rem", py: ".7rem", bgcolor: "#9155fd" }}
              >
                Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
