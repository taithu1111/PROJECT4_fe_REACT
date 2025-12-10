import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactImageMagnify from "react-image-magnify";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import "../ProductDetails/ProductDetails.css";
import { TextareaAutosize } from "@mui/base";
import axios from "axios";
import { Button } from "@mui/material";
import { getAuthHeaders } from "../../../api/GetAuthHeaders";
import { API_BASE_URL } from "../../../api/APIProduct";
import StarRating from "../Product/StarRating";
import placeholderImage from "../../../assets/images/placeholder.png";
import { formatCurrency } from "../../../comon/formatCurrency";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [dataProduct, setDataProduct] = useState(null);
  const [toggle, setToggle] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/product/${id}`, {
        headers: getAuthHeaders(),
      })
      .then((res) => {
        setDataProduct(res.data);
        console.log("Product detail:", res.data);
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (!dataProduct) {
    return (
      <div className="text-center text-xl py-10">
        Loading product...
      </div>
    );
  }

  const handleAddToCart = async () => {
    const addItemData = {
      productId: dataProduct.id,
      quantity: quantity,
      price: dataProduct.price
    };

    console.log("AddItemRequest:", addItemData);

    try {
      const res = await axios.put(
        `${API_BASE_URL}/api/cart/add`,
        addItemData,
        { headers: getAuthHeaders() }
      );
      console.log("Add to cart response:", res.data);

      const resp = res.data;

      const isSuccess =
        (resp && typeof resp === "object" && resp.status === true) ||
        (typeof resp === "string" && resp.toLowerCase().includes("item"));

      if (isSuccess) {
        navigate("/cart");
        return;
      }

      if (resp && typeof resp === "object" && resp.message) {
        alert(resp.message);
      } else if (typeof resp === "string") {
        alert(resp);
      } else {
        alert("Add to cart failed!");
      }
    } catch (error) {
      console.error(error);
      alert("Add to cart failed!");
    }
  };

  // Get product images or use placeholder
  const productImages = dataProduct.images && dataProduct.images.length > 0
    ? dataProduct.images
    : [placeholderImage];

  const currentImage = productImages[selectedImageIndex] || placeholderImage;

  return (
    <div className="bg-white mx-50 lg:px-20">
      <div className="pt-6">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb">
          <ol
            role="list"
            className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8"
          >
            <li className="text-sm">
              <span className="font-medium text-gray-500 hover:text-gray-600">
                {dataProduct.productName}
              </span>
            </li>
          </ol>
        </nav>

        {/* PRODUCT CONTENT */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-10 px-4 pt-10">

          {/* IMAGE */}
          <div className="flex flex-col items-center">
            <div className="imageMagniyer overflow-hidden rounded-lg max-w-[30rem] max-h-[35rem]">
              <ReactImageMagnify
                {...{
                  smallImage: {
                    alt: dataProduct.productName,
                    isFluidWidth: true,
                    src: currentImage,
                  },
                  largeImage: {
                    src: currentImage,
                    width: 500,
                    height: 500,
                  },
                  isHintEnabled: true,
                }}
              />
            </div>

            {/* Image Thumbnails */}
            {productImages.length > 1 && (
              <div className="flex flex-wrap gap-3 justify-center mt-4">
                {productImages.map((image, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`cursor-pointer overflow-hidden rounded-lg w-20 h-20 border-2 transition-all ${selectedImageIndex === index
                      ? 'border-green-500 shadow-md'
                      : 'border-gray-200 hover:border-gray-400'
                      }`}
                  >
                    <img
                      src={image}
                      alt={`${dataProduct.productName} ${index + 1}`}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* PRODUCT INFO */}
          <div className="lg:col-span-1 maxt-auto max-w-2x1 px-4 pb-16 sm:px-6 lg:max-w-7x1 lg:px-8 lg:pb-24">

            <h1 className="text-[42px] font-marsf lg:text-x1 font-bold text-gray-900">
              {dataProduct.productName}
            </h1>

            {/* Star Rating */}
            <div className="pt-3 pb-2">
              <StarRating
                rating={dataProduct.rating || 0}
                reviewCount={dataProduct.reviews?.length || 0}
                size="medium"
                showNumber={true}
              />
            </div>

            <div className="mt-4 lg:row-span-3 lg:mt-0">
              <div className="flex space-x-5 items-center text-lg lg:text-xl text-gray-900 mt-6">
                <p className="font-semibold text-3xl text-green-600">{formatCurrency(dataProduct.price)}</p>
                <p className="font-san text-[15px]">
                  Availability:
                  <span className="font-san text-[15px] text-[#797979]">
                    {" "}
                    {dataProduct.quantity} in stock
                  </span>
                </p>
              </div>

              <p className="mt-6 text-[15px] text-[#797979] leading-relaxed">
                {dataProduct.description}
              </p>

              {/* Brand if available */}
              {dataProduct.brand && (
                <p className="mt-4 text-sm text-gray-600">
                  <span className="font-semibold">Brand:</span> {dataProduct.brand}
                </p>
              )}

              {/* Product Colors */}
              {dataProduct.productColors && dataProduct.productColors.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Available Colors:</p>
                  <div className="flex gap-2 flex-wrap">
                    {Array.from(dataProduct.productColors).map((color, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm border border-gray-300"
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector and Add to cart */}
              <div className="mt-10 space-y-4">
                {/* Quantity Selector */}
                <div className="flex items-center gap-4">
                  <label className="text-base font-semibold text-gray-700">Quantity:</label>
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max="99"
                      value={quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1;
                        setQuantity(Math.min(Math.max(1, val), 99));
                      }}
                      className="w-16 text-center border-x border-gray-300 py-2 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(99, quantity + 1))}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    ({dataProduct.quantity} available)
                  </span>
                </div>

                {/* Add to Cart Button */}
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleAddToCart}
                  disabled={quantity > dataProduct.quantity}
                  className="transition-transform hover:scale-105"
                  sx={{
                    backgroundColor: "#34D399",
                    "&:hover": {
                      backgroundColor: "#10B981"
                    },
                    "&:disabled": {
                      backgroundColor: "#D1D5DB"
                    }
                  }}
                >
                  <AddShoppingCartIcon className="text-xs" />
                  <span className="text-xs ml-2">
                    Add {quantity} {quantity === 1 ? 'item' : 'items'} to Cart
                  </span>
                </Button>
              </div>
            </div>

            {/* Category */}
            <div className="product_meta my-3 space-y-2">
              {/* <span className="sku_wrapper block space-x-2">
                <span className="text-[15px] font-semibold font-san">
                  SKU:
                </span>
                <span className="text-[15px] font-normal">
                  {dataProduct.id}
                </span>
              </span> */}

              <span className="posted_in block space-x-2">
                <span className="text-[15px] font-semibold font-san">
                  Category:
                </span>
                <span className="text-[15px] font-normal">
                  {dataProduct.category?.category_name || "Uncategorized"}
                </span>
              </span>
            </div>

            {/* SOCIAL */}
            <div className="mt-10 space-x-2 flex">
              <span className="text-[15px] text-san text-[#797979]">
                Share:
              </span>
              <div className="flex text-gray-600 space-x-2">
                <FacebookRoundedIcon className="hover:text-blue-600 cursor-pointer" />
                <InstagramIcon className="hover:text-red-500 cursor-pointer" />
                <PinterestIcon className="hover:text-red-500 cursor-pointer" />
              </div>
            </div>

          </div>
        </section>

        {/* DESCRIPTION & REVIEWS */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <ul className="flex space-x-4 mb-4 border-b border-gray-200">
            <li
              className={`p-4 cursor-pointer transition-all duration-200 ${toggle === 1
                ? "font-semibold text-green-600 border-b-2 border-green-600"
                : "text-gray-600 hover:text-gray-900"
                }`}
              onClick={() => setToggle(1)}
            >
              Description
            </li>
            <li
              className={`p-4 cursor-pointer transition-all duration-200 ${toggle === 2
                ? "font-semibold text-green-600 border-b-2 border-green-600"
                : "text-gray-600 hover:text-gray-900"
                }`}
              onClick={() => setToggle(2)}
            >
              Reviews ({dataProduct.reviews?.length || 0})
            </li>
          </ul>

          {/* DESCRIPTION */}
          {toggle === 1 && (
            <div className="max-w-full mt-6 animate-fadeIn">
              <p className="text-gray-700 leading-relaxed text-base">
                {dataProduct.description}
              </p>
            </div>
          )}

          {/* REVIEWS */}
          {toggle === 2 && (
            <div className="max-w-full mt-6 animate-fadeIn">
              <h2 className="font-mar text-2xl mb-6 font-semibold">Customer Reviews</h2>

              <div className="space-y-4 mb-8">
                {dataProduct.reviews && dataProduct.reviews.length > 0 ? (
                  dataProduct.reviews.map((review, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      {/* Review header with rating if available */}
                      {review.rating && (
                        <div className="mb-2">
                          <StarRating
                            rating={review.rating}
                            size="small"
                            showNumber={false}
                          />
                        </div>
                      )}

                      {/* Reviewer name if available */}
                      {review.userName && (
                        <p className="font-semibold text-gray-900 mb-1">
                          {review.userName}
                        </p>
                      )}

                      {/* Review comment */}
                      <p className="text-gray-700 leading-relaxed">
                        {review.comment || review.review}
                      </p>

                      {/* Review date if available */}
                      {review.createdAt && (
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">
                    No reviews yet. Be the first to review this product!
                  </p>
                )}
              </div>

              <div className="mt-8 bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-marsf text-xl mb-4 font-semibold">Write a Review</h3>
                <TextareaAutosize
                  minRows={6}
                  placeholder="Share your thoughts about this product..."
                  className="outline-none w-full border border-gray-300 rounded-md p-4 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                />
                <Button
                  variant="contained"
                  sx={{
                    mt: 2,
                    backgroundColor: "#34D399",
                    "&:hover": {
                      backgroundColor: "#10B981"
                    }
                  }}
                >
                  Submit Review
                </Button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
