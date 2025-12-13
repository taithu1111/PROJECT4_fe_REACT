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
import placeholderImage from "../../../assets/images/placeholder.png";
import { formatCurrency } from "../../../comon/formatCurrency";

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

  // --- Fetch cart from backend ---
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

  // When opening Shopping Bag, fetch data
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
    navigate("/");
  };

  const handleOpenAuth = () => {
    setAuthMode("register");
    setOpenAuthModal(true);
  };
  const handleCloseAuth = () => setOpenAuthModal(false);


  const list = (anchor) => (
    <Box sx={{ width: 400, height: '100%', display: 'flex', flexDirection: 'column' }} role="presentation" onKeyDown={toggleDrawer(anchor, false)}>
      <div className="flex-1 overflow-auto p-6">
        <p className="text-3xl font-bold mb-6 text-gray-900">Shopping Bag</p>

        {cart.cartItems && cart.cartItems.length > 0 ? (
          <div className="space-y-4">
            {cart.cartItems.map((item) => (
              <div key={item.id} className="border rounded-lg p-3 hover:shadow-md transition-shadow bg-white">
                <Grid container spacing={2} alignItems="center">
                  {/* Product Image */}
                  <Grid item xs={3}>
                    <img
                      src={item.productImageUrl || placeholderImage}
                      alt={item.productName}
                      className="w-full h-20 object-cover rounded-md border border-gray-200"
                      onError={(e) => { e.target.src = placeholderImage; }}
                    />
                  </Grid>

                  {/* Product Details */}
                  <Grid item xs={7}>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 line-clamp-2">{item.productName}</p>
                      <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                      <p className="text-sm font-bold text-green-600 mt-1">
                        {item.price ? formatCurrency(item.price * item.quantity) : ""}
                      </p>
                    </div>
                  </Grid>

                  {/* Remove Button */}
                  {/* ... */}
                </Grid>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ShoppingCartOutlinedIcon sx={{ fontSize: 60, color: '#9CA3AF' }} />
            <p className="text-gray-500 mt-3">Your cart is empty</p>
          </div>
        )}
      </div>

      {/* Footer with Total and Buttons */}
      <div className="border-t bg-gray-50 p-6 space-y-4">
        <div className="flex justify-between items-center text-lg font-bold">
          <span className="text-gray-700">Total:</span>
          <span className="text-green-600">
            {formatCurrency(cart.cartItems?.reduce((sum, item) => sum + (item.price * item.quantity || 0), 0) || 0)}
          </span>
        </div>

        <button
          onClick={() => {
            setState({ ...state, [anchor]: false });
            navigate("/checkout?step=2");
          }}
          className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-bold uppercase rounded-md transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          disabled={!cart.cartItems || cart.cartItems.length === 0}
        >
          Checkout
        </button>

        <button
          onClick={() => {
            setState({ ...state, [anchor]: false });
            navigate("/cart");
          }}
          className="w-full py-3 px-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold border border-gray-300 rounded-md transition-colors"
        >
          View Cart
        </button>
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
          <div onClick={() => navigate("/")} className="ml-4 flex items-center cursor-pointer">
            <span className="text-2xl font-semibold text-green-500">Plant</span>
            <span className="text-2xl font-semibold text-brown-500">Nest</span>
          </div>
        </div>

        {/* Nav Links */}
        <div className="flex space-x-8 text-lg">
          <NavLink to="/" className="hover:text-orange-500">HOME</NavLink>
          {auth.user?.role === "ROLE_ADMIN" && (
            <NavLink to="/admin" className="hover:text-orange-500">ADMIN</NavLink>
          )}
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
                className="h-8 w-6 cursor-pointer text-gray-400 hover:text-gray-600"
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
