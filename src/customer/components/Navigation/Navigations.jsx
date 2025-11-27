import { Fragment, useEffect, useState } from "react";
import { Dialog, Tab, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Drawer,
  Grid,
  Menu,
  MenuItem,
} from "@mui/material";
import { deepOrange } from "@mui/material/colors";
import AuthModal from "../../Auth/AuthModal";
import { getUser, logout } from "../../../State/Auth/Action";
import { useDispatch, useSelector } from "react-redux";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import axios from "axios";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { auth } = useSelector((store) => store);

  const [cart, setCart] = useState({ cartItems: [], totalPrice: 0 });
  const [state, setState] = useState({ right: false });
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("register");
  const [anchorEl, setAnchorEl] = useState(null);
  const openUserMenu = Boolean(anchorEl);
  const jwt = localStorage.getItem("jwt");

  // --- Fetch cart từ BE ---
  const fetchCart = async () => {
    if (!jwt) return;
    try {
      const response = await axios.get("http://localhost:8080/api/cart", {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      setCart(response.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  // Khi mở Shopping Bag, fetch lại dữ liệu
  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    )
      return;

    setState({ ...state, [anchor]: open });
    if (open) fetchCart();
  };

  useEffect(() => {
    if (jwt) {
      dispatch(getUser(jwt));
      handleCloseAuth();
      fetchCart();
    }
  }, [jwt]);


  const handleUserClick = (event) => setAnchorEl(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorEl(null);
  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    handleCloseUserMenu();
  };

  const handleOpenAuth = () => {
    setAuthMode("register");
    setOpenAuthModal(true);
  };
  const handleCloseAuth = () => setOpenAuthModal(false);


  const list = (anchor) => (
    <Box sx={{ width: 400 }} role="presentation" onKeyDown={toggleDrawer(anchor, false)}>
      <div className="font-mar m-14">
        <p className="text-3xl mb-4">Shopping Bag</p>
        {cart.cartItems.length > 0 ? (
          cart.cartItems.map((item) => (
            <Grid key={item.id} container className="w-40 group mb-4">
              <Grid item xs={3}>
                <img
                  src={item.productImageUrl}
                  alt={item.productName}
                  className="w-full h-auto object-cover"
                />
              </Grid>
              <Grid item xs={7} sx={{ display: "flex", alignItems: "center" }}>
                <div>
                  <p className="text-black font-medium">{item.productName}</p>
                  <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                  <p className="text-green-600 font-semibold">
                    {item.price ? item.price.toLocaleString("vi-VN") + " VND" : ""}
                  </p>
                </div>
              </Grid>
              <Grid item xs={2} sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                <button
                  onClick={async () => {
                    try {
                      // Gọi API xóa item
                      await axios.delete(`http://localhost:8080/api/cartItem/${item.id}`, {
                        headers: { Authorization: `Bearer ${jwt}` },
                      });
                      // Sau khi xóa, fetch lại cart để cập nhật giao diện
                      fetchCart();
                    } catch (error) {
                      console.error("Error deleting cart item:", error);
                    }
                  }}
                >
                  <XMarkIcon className="w-5 h-5 text-gray-600 hover:text-red-500" />
                </button>
              </Grid>

            </Grid>
          ))
        ) : (
          <p>Your cart is empty</p>
        )}

        <div className="flex justify-between mt-5 text-lg font-semibold">
          <span>Total:</span>
          <span>{cart.totalPrice?.toLocaleString("vi-VN") || 0} VND</span>
        </div>

        <div className="mt-5 space-y-3">
          <button
            onClick={() => navigate("/checkout?step=2")}
            className="w-full py-2 px-4 bg-purple-600 text-white font-bold uppercase"
          >
            Checkout
          </button>
          <button
            onClick={() => navigate("/cart")}
            className="w-full py-2 px-4 border border-gray-800 text-black font-bold uppercase"
          >
            View Cart
          </button>
        </div>
      </div>
    </Box>
  );

  return (
    <div className="bg-white">
      {/* Mobile menu & Drawer */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>
        </Dialog>
      </Transition.Root>

      <header className="relative flex px-20 h-[6rem] bg-[#F8F2ED] items-center justify-between">
        <div>
          <button
            type="button"
            className="relative rounded-md bg-white p-2 text-gray-400 lg:hidden"
            onClick={() => setOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div onClick={() => navigate("/")} className="ml-4 flex items-center">
            <span className="text-2xl font-semibold text-green-500">Plant</span>
            <span className="text-2xl font-semibold text-brown-500">Nest</span>
          </div>
        </div>

        {/* Nav Links */}
        <div className="flex space-x-8 text-lg">
          <NavLink to="/" className="hover:text-orange-500">HOME</NavLink>
          <NavLink to="/products" className="hover:text-orange-500">SHOPS</NavLink>
          <NavLink to="/about" className="hover:text-orange-500">ABOUT US</NavLink>
          <NavLink to="/contact" className="hover:text-orange-500">CONTACT US</NavLink>
        </div>

        {/* User & Cart */}
        <div className="flex items-center space-x-6">
          {auth.user?.firstName ? (
            <Button onClick={handleUserClick}>
              <Avatar sx={{ bgcolor: deepOrange[500] }}>
                {auth.user.firstName[0]}
              </Avatar>
            </Button>
          ) : (
            <Button onClick={handleOpenAuth}>
              <AccountCircleIcon className="text-gray-600 text-7xl" />
            </Button>
          )}
          <Menu
            anchorEl={anchorEl}
            open={openUserMenu}
            onClose={handleCloseUserMenu}
          >
            <MenuItem onClick={() => { navigate("/account/profile"); handleCloseUserMenu(); }}>Profile</MenuItem>
            <MenuItem onClick={() => { navigate("/account/order"); handleCloseUserMenu(); }}>Order History</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>

          {/* Shopping Bag */}
          {["right"].map((anchor) => (
            <div key={anchor}>
              <ShoppingCartOutlinedIcon
                onClick={toggleDrawer(anchor, true)}
                className="h-8 w-6 cursor-pointer text-gray-400"
              />
              <Drawer
                anchor={anchor}
                open={state[anchor]}
                onClose={toggleDrawer(anchor, false)}
              >
                {list(anchor)}
              </Drawer>
            </div>
          ))}
        </div>
      </header>

      <AuthModal handleClose={handleCloseAuth} open={openAuthModal} mode={authMode}
        setAuthMode={setAuthMode}
        setOpen={setOpenAuthModal}
      />
    </div>
  );
}
