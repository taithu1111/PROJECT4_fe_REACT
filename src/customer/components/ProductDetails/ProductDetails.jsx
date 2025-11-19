import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactImageMagnify from "react-image-magnify";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import StarOutlinedIcon from "@mui/icons-material/StarOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import "../ProductDetails/ProductDetails.css";
import { TextareaAutosize } from "@mui/base";
import axios from "axios";
import { Button } from "@mui/material";
import { getAuthHeaders } from "../../../api/GetAuthHeaders";
export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [dataProduct, setDataProduct] = useState(null);
  const [toggle, setToggle] = useState(1);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/product/${id}`, {
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
      quantity: 1,
      price: dataProduct.price
    };

    console.log("AddItemRequest:", addItemData);

    try {
      const res = await axios.put(
        "http://localhost:8080/api/cart/add",
        addItemData,
        { headers: getAuthHeaders() }
      );
      console.log("Add to cart response:", res.data);

      const resp = res.data;

      // Hỗ trợ cả 2 kiểu: backend trả về object {status: true, message: "..."}
      // hoặc trả về plain string "Item add to Cart"
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



  return (
    <div className="bg-white mx-50 lg:px-20">
      <div className="pt-6">

        {/* Breadcrumbs giữ nguyên */}
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
                    alt: dataProduct.title,
                    isFluidWidth: true,
                    src: dataProduct.images[0],
                  },
                  largeImage: {
                    src: dataProduct.images[0],
                    width: 500,
                    height: 500,
                  },
                  isHintEnabled: true,
                }}
              />
            </div>
            {/* giữ nguyên thumbnails */}
            <div className="flex flex-wrap space-x-5 justify-center">
              <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg max-w-[5rem] max-h-[5rem] mt-4">
                <img
                  src={dataProduct.imageUrl}
                  className="h-full w-full object-cover object-center"
                />
              </div>
            </div>
          </div>

          {/* PRODUCT INFO */}
          <div className="lg:col-span-1 maxt-auto max-w-2x1 px-4 pb-16 sm:px-6 lg:max-w-7x1 lg:px-8 lg:pb-24">

            <h1 className="text-[62px] font-marsf lg:text-x1 ">
              {dataProduct.title}
            </h1>

            <div className="pt-1">
              {[...Array(5)].map((_, i) => (
                <StarOutlinedIcon key={i} className="text-[#cc723f] text-xs" />
              ))}
              <span className="ml-[10px] font-san text-[#797979] text-[15px]">
                (customer reviews)
              </span>
            </div>

            <div className="mt-4 lg:row-span-3 lg:mt-0">
              <div className="flex space-x-5 items-center text-lg lg:text-xl text-gray-900 mt-6">
                <p className="font-semibold text-2xl">${dataProduct.price}</p>
                <p className="font-san text-[15px] ">
                  Availability:
                  <span className="font-san text-[15px] text-[#797979]">
                    {" "}
                    {dataProduct.quantity} in stock
                  </span>
                </p>
              </div>

              <p className="mt-6 text-[15px] text-[#797979]">
                {dataProduct.description}
              </p>

              {/* Quantity + Add to cart giữ nguyên */}
              <form className="mt-10 flex">
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleAddToCart}
                >
                  <AddShoppingCartIcon className="text-xs" />
                  <span className="text-xs ml-2">Add to Cart</span>
                </Button>
              </form>
            </div>

            {/* Category */}
            <div className="product_meta my-3 space-y-2 ">
              <span className="sku_wrapper block space-x-2">
                <span className="text-[15px] font-semibold font-san ">
                  SKU:
                </span>
                <span className="text-[15px] font-normal">
                  {dataProduct.id}
                </span>
              </span>

              <span className="posted_in block space-x-2">
                <span className="text-[15px] font-semibold font-san ">
                  Category:
                </span>
                <span className="text-[15px] font-normal">
                  {dataProduct.category?.category_name || "Uncategorized"}
                </span>
              </span>
            </div>

            {/* SOCIAL */}
            <div className="mt-10 space-x-2 flex ">
              <span className=" text-[15px] text-san text-[#797979] ">
                Share:
              </span>
              <div className="flex text-gray-600 space-x-2">
                <FacebookRoundedIcon className="hover:text-blue-600" />
                <InstagramIcon className="hover:text-red-500" />
                <PinterestIcon className="hover:text-red-500" />
              </div>
            </div>

          </div>
        </section>

        {/* DESCRIPTION & REVIEWS */}
        <section className="col-6 tab p-5">
          <ul className="flex space-x-4 ml-[165px]">
            <li className="p-4 cursor-pointer" onClick={() => setToggle(1)}>
              Description
            </li>
            <li className="p-4 cursor-pointer" onClick={() => setToggle(2)}>
              Reviews
            </li>
          </ul>

          <div
            className="w-full ml-44"
            style={{
              backgroundColor: "#CDB866",
              width: "1500px",
              height: "1px",
            }}
          ></div>

          {/* DESCRIPTION */}
          {toggle === 1 && (
            <div className="max-w-full ml-[180px]">
              <p>{dataProduct.description}</p>
            </div>
          )}

          {/* REVIEWS giữ nguyên */}
          {toggle === 2 && (
            <div className="max-w-full ml-[180px]">
              <h1 className="font-mar text-[28px] mb-8">Reviews</h1>

              <div> {dataProduct.reviews.length > 0 ? (
                dataProduct.reviews.map((item, index) => (
                  <p className="text-gray-600" key={index}>
                    {item.comment}
                  </p>
                ))
              ) : (
                <p>No Review</p>
              )}</div>


              <div className="mt-[60px]">
                <h1 className="font-marsf text-[28px] my-2 ">Add a review</h1>
                <TextareaAutosize
                  minRows={6}
                  className="outline-none w-full border border-gray-300 rounded-md p-2"
                />
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
