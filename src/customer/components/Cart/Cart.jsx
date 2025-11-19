import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthHeaders } from "../../../api/GetAuthHeaders";
import axios from "axios";
import Button from "@mui/material/Button";
import CartItem from "./CartItem";
import { formatCurrency } from "../../../comon/formatCurrency";

const Cart = ({ cart, setCart }) => {
  const navigate = useNavigate();
  const [cartData, setCartData] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  // Hàm fetch lại cart từ BE
  const fetchCart = () => {
    axios
      .get(`http://localhost:8080/api/cart`, {
        headers: getAuthHeaders(),
      })
      .then((res) => {
        console.log("Dữ liệu BE Cart : ", res.data);
        setCartData(res.data);
        setCartItems(res.data.cartItems);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    console.log("Cart Items Updated : ", cartItems);
  }, [cartItems]);

  const handleCheckout = () => {
    navigate("/checkout?step=2");
  };

  return (
    <div className="mx-16 my-14">
      <section>
        <span className="text-[14px] text-gray-500 ">Home / </span>
        <span className="text-[15px] text-gray-500">Cart</span>
      </section>

      <div className="lg:grid grid-cols-3 lg:px-16 relative">
        <div className="col-span-2">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <CartItem key={item.id} item={item} fetchCart={fetchCart} />
            ))
          ) : (
            <p>Your cart is empty</p>
          )}
        </div>
        <div className="px-5 sticky top-0 h-[100vh] mt-5 lg:mt-0">
          <div className="border">
            <p className="uppercase opacity-60 font-bold pb-4">Price Details</p>
            <hr />
            <div className="space-y-3 font-semibold mb-10">
              <div className="flex justify-between pt-3 text-black">
                <span>Price</span>
                <span className="text-green-600">{formatCurrency(cartData.totalPrice)}</span>
              </div>
              <div className="flex justify-between pt-3">
                <span>Discount</span>
                <span className="text-green-600">$0</span>
              </div>
              <div className="flex justify-between pt-3 text-black">
                <span>Delivery</span>
                <span>Free</span>
              </div>
              <div className="transition-transform tran flex justify-between pt-3 text-black font-bold">
                <span>Total Amount</span>
                <span>{formatCurrency(cartData.totalPrice)}</span>
              </div>
            </div>
            <Button
              onClick={handleCheckout}
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
  );
};

export default Cart;
