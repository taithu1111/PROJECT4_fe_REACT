import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthHeaders } from "../../../api/GetAuthHeaders";
import axios from "axios";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import InputAdornment from "@mui/material/InputAdornment";
import CartItem from "./CartItem";
import { formatCurrency } from "../../../comon/formatCurrency";
const Cart = ({ cart, setCart }) => {
  const navigate = useNavigate();
  const [cartData, setCartData] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/cart`, {
        headers: getAuthHeaders(),
      })
      .then((res) => {
        console.log("Dữ liệu BE Cart : ", res.data);
        setCartData(res.data);
        setCartItems(res.data.cartItems);
        console.log("Cart Items : ", cartItems);
      })
      .catch((err) => console.log(err));
  }, []);
  const handleCheckout = () => {
    navigate("/checkout?step=2");
  };

  const [price, setPrice] = useState(0);

  return (
    <div className="mx-16 my-14">
      <section className="">
        <span className="text-[14px] text-gray-500 ">Home / </span>
        <span className="text-[15px] text-gray-500">Cart</span>{" "}
      </section>

      {/* <div className="font-mar w-full">
        <table className="w-full">
          <thead className="w-full">
            <tr className="text-3xl my-10 ">
              <th className="p-6">Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="w-full">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <tr key={item.id} className="px-6">
                  <td className="w-auto border">
                    <div className="flex items-center">
                      <img className="w-[4.6rem]" src={item.productImageUrl} alt="" />
                      <p className="text-[1.4rem]">{item.productName}</p>
                    </div>
                  </td>
                  <td className="text-center border text-gray-400 text-[1.4rem]">
                    ${item.price}
                  </td>
                  <td className="text-center border text-[1.4rem]">
                    <input
                      className="outline-none border cursor-pointer px-9 w-[6.6rem] h-[3rem]"
                      type="number"
                      value={item.quantity}
                      readOnly
                    />
                  </td>
                  <td className="text-center border text-gray-400 text-[1.4rem]">
                    ${item.price * item.quantity}
                  </td>
                  <td className="text-center border text-[1.4rem]">
                    <CloseIcon />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-5">
                  Your cart is empty
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div> */}

      <div className="lg:grid grid-cols-3 lg:px-16 relative">
        <div className="col-span-2">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <CartItem key={item.id} item={item} />
            ))
          ) : (
            <p>Your cart is empty</p>
          )}
        </div>
        <div className="px-5 sticky top-0 h-[100vh] mt-5 lg:mt-0">
          <div className=" border">
            <p className="uppercase opacity-60 font-bold pb-4">Price Details</p>
            <hr />
            <div className="space-y-3 font-semibold mb-10">
              <div className="flex justify-between pt-3 text-black">
                <span>Price</span>
                <span className="text-green-600">{formatCurrency(cartData.totalPrice)}</span>
              </div>
              <div className="flex justify-between pt-3 ">
                <span>Discount</span>
                <span className="text-green-600">$0</span> {/* //Phần giảm giá của anh sơn nhé Vocher */}
              </div>
              <div className="flex justify-between pt-3 text-black">
                <span>Delivery</span>
                <span>Free</span>
              </div>
              <div className="transition-transform tran flex justify-between pt-3 text-black font-bold">
                <span>Total Amount</span>
                <span>{formatCurrency(cartData.totalPrice)}</span>{/* //Phần giảm giá của anh sơn nhé tính lại giá sau khi giảm  */}
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
