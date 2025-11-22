import React, { useEffect, useState } from "react";
import "./ProductCard.css";
import { useNavigate } from "react-router-dom";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { Rating } from "@mui/material"; // Chỉ import Rating từ @mui/material
import axios from "axios";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { getAuthHeaders } from "../../../api/GetAuthHeaders";
import { formatCurrency } from "../../../comon/formatCurrency";
import { API_BASE_URL } from "../../../api/APIProduct";
import placeholderImage from "../../../assets/images/placeholder.png";

const ProductCard = ({ product, handleClick }) => {
  const navigate = useNavigate();
  const [averageRating, setAverageRating] = useState(0);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/ratings/average-rating/${product.id}`, {
        headers: getAuthHeaders(),
      })
      .then((res) => {
        // console.log(res.data);
        setAverageRating(res.data);
      })
      .catch((err) => console.log(err));
  }, [product.id]);

  return (
    <div className="group relative cursor-pointer transition-all w-full">
      <div
        onClick={() => navigate(`/product/${product.id}`)}
        className="relative overflow-hidden hover:shadow-md rounded-lg bg-white"
      >
        <div className="relative w-full aspect-square bg-gray-50 flex items-center justify-center">
          <img
            src={
              imageError || !product.images || !product.images[0]
                ? placeholderImage
                : product.images[0]
            }
            alt={product.productName || "Product image"}
            className="object-cover border border-gray-200 rounded-lg w-full h-full"
            onError={() => setImageError(true)}
          />

          <div
            className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 hover:bg-gray-100 flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              handleClick(product);
            }}
          >
            <ShoppingCartOutlinedIcon sx={{ fontSize: "18px" }} className="text-gray-600" />
          </div>
        </div>
      </div>

      <div className="relative flex flex-col items-start justify-start mt-2 px-1">
        <h2 className="title font-mar text-sm font-medium text-gray-900 line-clamp-2 mb-1 min-h-[2.5rem] product-title">
          <a href="#" className="group text-gray-900 hover:text-green-600 transition-colors">
            {product.productName}
          </a>
        </h2>
        <div className="flex items-center mb-1">
          <Rating
            name="read-only"
            value={averageRating}
            precision={0.5}
            readOnly
            size="small"
            sx={{ fontSize: "14px" }}
          />
        </div>
        <p className="text-base font-semibold font-san text-gray-900">
          {formatCurrency(product.price, "$")}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
