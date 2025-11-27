import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Grid,
  TextField,
  Typography,
  Box,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  InputAdornment,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import OrderCard from "./OrderCard";
import { getUserOrders } from "../../../State/Order/Action";
import "./Order.css";

const Order = () => {
  const dispatch = useDispatch();
  const { orders, isLoading, error } = useSelector((state) => state.order);
  const jwt = localStorage.getItem("jwt");

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [dateFilter, setDateFilter] = useState("all");

  // Fetch orders on component mount
  useEffect(() => {
    if (jwt) {
      dispatch(getUserOrders());
    }
  }, [dispatch, jwt]);

  // Handle status filter toggle
  const handleStatusToggle = (status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  // Filter and sort orders
  const getFilteredOrders = () => {
    if (!orders || orders.length === 0) return [];

    let filtered = [...orders];

    // Filter by status
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((order) =>
        selectedStatuses.some((status) =>
          order.orderStatus?.toLowerCase().includes(status.toLowerCase())
        )
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.orderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.orderItems?.some((item) =>
            item.product?.title?.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Filter by date
    if (dateFilter !== "all") {
      const now = new Date();
      const filterDate = new Date();

      switch (dateFilter) {
        case "7days":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "30days":
          filterDate.setDate(now.getDate() - 30);
          break;
        case "3months":
          filterDate.setMonth(now.getMonth() - 3);
          break;
        default:
          break;
      }

      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.orderDate);
        return orderDate >= filterDate;
      });
    }

    // Sort orders
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.orderDate) - new Date(a.orderDate);
        case "oldest":
          return new Date(a.orderDate) - new Date(b.orderDate);
        case "highPrice":
          return b.totalPrice - a.totalPrice;
        case "lowPrice":
          return a.totalPrice - b.totalPrice;
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredOrders = getFilteredOrders();

  const handleClearFilters = () => {
    setSelectedStatuses([]);
    setDateFilter("all");
    setSearchQuery("");
    setSortBy("newest");
  };

  const orderStatuses = [
    { label: "Pending", value: "pending", color: "#FFA726" },
    { label: "Processing", value: "processing", color: "#42A5F5" },
    { label: "Shipped", value: "shipped", color: "#9575CD" },
    { label: "On The Way", value: "on_the_way", color: "#7E57C2" },
    { label: "Delivered", value: "delivered", color: "#66BB6A" },
    { label: "Cancelled", value: "cancelled", color: "#EF5350" },
    { label: "Returned", value: "returned", color: "#FF7043" },
  ];

  if (!jwt) {
    return (
      <div className="order-container">
        <Alert severity="warning">Please log in to view your orders.</Alert>
      </div>
    );
  }

  return (
    <div className="order-container">
      <Box className="order-header">
        <Typography variant="h4" className="order-title">
          Order History
        </Typography>
        {orders && orders.length > 0 && (
          <Chip
            label={`${filteredOrders.length} of ${orders.length} Orders`}
            color="primary"
            variant="outlined"
          />
        )}
      </Box>

      {/* Search and Sort Bar */}
      <Box className="order-controls">
        <TextField
          className="search-field"
          placeholder="Search by order ID or product name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <FormControl className="sort-select" size="small">
          <InputLabel>Sort By</InputLabel>
          <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} label="Sort By">
            <MenuItem value="newest">Newest First</MenuItem>
            <MenuItem value="oldest">Oldest First</MenuItem>
            <MenuItem value="highPrice">Highest Price</MenuItem>
            <MenuItem value="lowPrice">Lowest Price</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3} className="order-content">
        {/* Filter Sidebar */}
        <Grid item xs={12} md={3}>
          <Box className="filter-panel">
            <Box className="filter-header">
              <FilterListIcon />
              <Typography variant="h6">Filters</Typography>
            </Box>

            {/* Status Filter */}
            <Box className="filter-section">
              <Typography variant="subtitle1" className="filter-title">
                Order Status
              </Typography>
              <FormGroup>
                {orderStatuses.map((status) => (
                  <FormControlLabel
                    key={status.value}
                    control={
                      <Checkbox
                        checked={selectedStatuses.includes(status.value)}
                        onChange={() => handleStatusToggle(status.value)}
                        sx={{
                          color: status.color,
                          "&.Mui-checked": { color: status.color },
                        }}
                      />
                    }
                    label={status.label}
                  />
                ))}
              </FormGroup>
            </Box>

            {/* Date Filter */}
            <Box className="filter-section">
              <Typography variant="subtitle1" className="filter-title">
                Date Range
              </Typography>
              <FormControl fullWidth size="small">
                <Select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
                  <MenuItem value="all">All Time</MenuItem>
                  <MenuItem value="7days">Last 7 Days</MenuItem>
                  <MenuItem value="30days">Last 30 Days</MenuItem>
                  <MenuItem value="3months">Last 3 Months</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Clear Filters Button */}
            {(selectedStatuses.length > 0 || dateFilter !== "all" || searchQuery) && (
              <Button
                variant="outlined"
                fullWidth
                onClick={handleClearFilters}
                className="clear-filters-btn"
              >
                Clear All Filters
              </Button>
            )}
          </Box>
        </Grid>

        {/* Orders List */}
        <Grid item xs={12} md={9}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {isLoading ? (
            <Box className="loading-container">
              <CircularProgress />
              <Typography variant="body1" sx={{ mt: 2 }}>
                Loading your orders...
              </Typography>
            </Box>
          ) : filteredOrders.length > 0 ? (
            <div className="orders-list">
              {filteredOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          ) : (
            <Box className="empty-state">
              <Typography variant="h6" color="text.secondary">
                {searchQuery || selectedStatuses.length > 0 || dateFilter !== "all"
                  ? "No orders match your filters"
                  : "No orders yet"}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {searchQuery || selectedStatuses.length > 0 || dateFilter !== "all"
                  ? "Try adjusting your filters to see more orders"
                  : "Start shopping to see your orders here"}
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default Order;
