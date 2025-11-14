import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import Slider from "@mui/material/Slider";
import { Radio, RadioGroup } from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { useLocation, useNavigate } from "react-router-dom";
import { Stack, Pagination } from "@mui/material";
import "../Product/Product.css";
import APIProduct from "../../../api/APIProduct";

const sortOptions = [
  { name: "Sort", value: null },
  { name: "Price: Low to High", value: "priceLow" },
  { name: "Price: High to Low", value: "priceHigh" },
  { name: "A - Z", value: "az" },
  { name: "Z - A", value: "za" },
];

export default function Product({ handleClick }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;
  const [totalPages, setTotalPages] = useState(1);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [selectedSort, setSelectedSort] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Lấy tất cả sản phẩm
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const data = await APIProduct.getAllProducts();
        console.log("All products:", data);
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    fetchAllProducts();
  }, []);

  // Lọc + sort + phân trang tự động khi state thay đổi
  useEffect(() => {
    let filtered = [...products];

    // Filter category
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category?.category_name === selectedCategory);
    }

    // Filter price
    filtered = filtered.filter(p => p.price >= minPrice && p.price <= maxPrice);

    // Sort
    if (selectedSort === "priceLow") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (selectedSort === "priceHigh") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (selectedSort === "az") {
      filtered.sort((a, b) => a.productName.localeCompare(b.productName));
    } else if (selectedSort === "za") {
      filtered.sort((a, b) => b.productName.localeCompare(a.productName));
    }

    const pages = Math.ceil(filtered.length / productsPerPage) || 1;
    setTotalPages(pages);

    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    setDisplayedProducts(filtered.slice(startIndex, endIndex));
  }, [products, selectedCategory, minPrice, maxPrice, selectedSort, currentPage]);

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleFilter = value => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  const handleChange = (event, newVal) => {
    setMinPrice(newVal[0]);
    setMaxPrice(newVal[1]);
    setCurrentPage(1);
  };

  const handleSort = value => {
    setSelectedSort(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    navigate(`/search/${searchQuery}`);
  };

  const uniqueCategories = [
    ...new Set(products.map(p => p.category?.category_name))
  ].filter(Boolean);

  return (
    <div className="bg-white">
      <main className="mx-auto px-4 sm:px-6 lg:px-24">
        <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Categories</h1>
          <form className="hidden lg:block">
            <div className="space-y-4">
              <select
                className="px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 bg-white text-gray-600"
                value={selectedSort || ""}
                onChange={(e) => handleSort(e.target.value)}
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value || ""} className="hover:bg-green-500 hover:text-white">
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          </form>
        </div>

        <section aria-labelledby="products-heading" className="pb-24 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Filter Section */}
            <div className="col-span-1">
              <div className="py-5 flex justify-between items-center">
                <h1 className="text-lg opacity-50 font-bold">Filter <FilterAltIcon /></h1>
              </div>
              <form className="hidden lg:block">
                <div className="space-y-4">
                  <h2 className="text-sm font-semibold text-gray-500">Category</h2>
                  <div className="space-y-2">
                    <RadioGroup value={selectedCategory || ""}>
                      {uniqueCategories.map((name, idx) => (
                        <label key={idx} className="flex items-center cursor-pointer">
                          <Radio
                            className="mr-2"
                            value={name}
                            onChange={() => handleFilter(name)}
                            sx={{
                              color: selectedCategory === name ? "#34D399" : "#6B7280",
                              "&.Mui-checked": {
                                color: "#34D399"
                              }
                            }}
                          />
                          <span>{name}</span>
                        </label>
                      ))}
                    </RadioGroup>
                  </div>

                  <h2 className="text-sm font-semibold text-gray-500">Price</h2>
                  <div className="flex items-center space-x-4">
                    <Slider
                      value={[minPrice, maxPrice]}
                      onChange={handleChange}
                      valueLabelDisplay="auto"
                      aria-label="range-slider"
                      min={0} step={50} max={10000}
                      sx={{ maxWidth: "250px", width: "250px", color: "#34D399" }}
                    />
                    <div className="text-sm text-gray-600 mt-2">
                      <span className="block">Min Price: ${minPrice}</span>
                      <span className="block">Max Price: ${maxPrice}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 mt-10">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 border rounded-md shadow-sm bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    onClick={handleSearchSubmit}
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>

            {/* Product List */}
            <div className="col-span-2 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {displayedProducts.length === 0 ? (
                <div className="flex items-center justify-center w-max h-full">
                  <p className="custom-message">No products available.</p>
                </div>
              ) : (
                displayedProducts.map((item, index) => (
                  <div key={index} className="w-full md:w-[calc(100%/4)] lg:w-[calc(100%/3)] xl:w-[calc(100%/3)] flex items-center justify-center">
                    <ProductCard product={item} handleClick={handleClick} />
                  </div>
                ))
              )}

              {displayedProducts.length > 0 && (
                <div className="col-span-2 flex items-center justify-center mt-6">
                  <Stack spacing={2} direction="row">
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={handlePageChange}
                      variant="outlined"
                      shape="rounded"
                      sx={{ "& button.Mui-selected": { backgroundColor: "#34D399" } }}
                    />
                  </Stack>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
