import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import Slider from "@mui/material/Slider";
import { Checkbox, FormControlLabel } from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import "../Product/Product.css";
import APIProduct from "../../../api/APIProduct";

const sortOptions = [
  { name: "Newest", value: "newest", group: "default" },
  { name: "Price: Low to High", value: "priceLow", group: "price" },
  { name: "Price: High to Low", value: "priceHigh", group: "price" },
  { name: "Name: A - Z", value: "az", group: "name" },
  { name: "Name: Z - A", value: "za", group: "name" },
];

export default function Product({ handleClick }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [minPriceInput, setMinPriceInput] = useState("0");
  const [maxPriceInput, setMaxPriceInput] = useState("10000");
  const [selectedSort, setSelectedSort] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [gridColumns, setGridColumns] = useState(5);
  const [pageInput, setPageInput] = useState("");

  // Configuration for products per page: { productsPerPage: gridColumns }
  const productsPerPageOptions = [
    { value: 6, label: "6 products (2×3)", columns: 3 },
    { value: 15, label: "15 products (3×5)", columns: 5 },
    { value: 24, label: "24 products (4×6)", columns: 6 }
    // ,{ value: 2, label: "Test", columns: 2 }
  ];

  // Get grid columns based on selected products per page
  const getGridColumns = () => {
    const option = productsPerPageOptions.find(opt => opt.value === productsPerPage);
    return option ? option.columns : 5;
  };

  // Update grid columns when products per page changes
  useEffect(() => {
    setGridColumns(getGridColumns());
  }, [productsPerPage]);

  // Handle window resize for responsive grid
  useEffect(() => {
    const handleResize = () => {
      // Grid columns are handled by CSS on smaller screens
      // Only apply custom columns on large screens (>= 1024px)
      if (window.innerWidth >= 1024) {
        setGridColumns(getGridColumns());
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call

    return () => window.removeEventListener('resize', handleResize);
  }, [productsPerPage]);

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

    // Filter by search query (product name)
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      filtered = filtered.filter(p => 
        p.productName?.toLowerCase().includes(query)
      );
    }

    // Filter category - support multiple categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(p => 
        selectedCategories.includes(p.category?.category_name)
      );
    }

    // Filter price
    filtered = filtered.filter(p => p.price >= minPrice && p.price <= maxPrice);

    // Sort
    if (selectedSort === "newest") {
      // Sort by newest - check for date fields or use ID as fallback
      filtered.sort((a, b) => {
        // Try to find date field (common variations)
        const dateA = a.createdAt || a.created_at || a.dateCreated || a.date_created;
        const dateB = b.createdAt || b.created_at || b.dateCreated || b.date_created;
        
        if (dateA && dateB) {
          // If both have dates, sort by date (newest first)
          return new Date(dateB) - new Date(dateA);
        } else if (dateA) {
          return -1; // a has date, b doesn't - a comes first
        } else if (dateB) {
          return 1; // b has date, a doesn't - b comes first
        } else {
          // Fallback: sort by ID descending (assuming higher IDs are newer)
          return (b.id || 0) - (a.id || 0);
        }
      });
    } else if (selectedSort === "priceLow") {
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
  }, [products, selectedCategories, minPrice, maxPrice, selectedSort, currentPage, productsPerPage, searchQuery]);

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
    setPageInput(""); // Clear input when using pagination buttons
    // Scroll to top of product list when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageInputChange = (e) => {
    const value = e.target.value;
    // Only allow numbers
    if (value === "" || /^\d+$/.test(value)) {
      setPageInput(value);
    }
  };

  const handlePageInputSubmit = (e) => {
    e.preventDefault();
    if (pageInput === "") return;
    
    const pageNum = parseInt(pageInput, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      setPageInput("");
      // Scroll to top when navigating to a page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePageInputBlur = () => {
    // Validate and navigate on blur if valid
    if (pageInput !== "") {
      const pageNum = parseInt(pageInput, 10);
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
        setCurrentPage(pageNum);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      setPageInput("");
    }
  };

  const handleCategoryToggle = (categoryName) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryName)) {
        // Remove category if already selected
        return prev.filter(cat => cat !== categoryName);
      } else {
        // Add category if not selected
        return [...prev, categoryName];
      }
    });
    setCurrentPage(1);
  };

  const handleChange = (event, newVal) => {
    const newMin = newVal[0];
    const newMax = newVal[1];
    setMinPrice(newMin);
    setMaxPrice(newMax);
    setMinPriceInput(newMin.toString());
    setMaxPriceInput(newMax.toString());
    setCurrentPage(1);
  };

  const handleMinPriceInputChange = (e) => {
    const value = e.target.value;
    setMinPriceInput(value);
    // Allow empty input while typing
    if (value === "" || value === "-") {
      return;
    }
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 10000) {
      const clampedValue = Math.min(numValue, maxPrice);
      setMinPrice(clampedValue);
      if (clampedValue !== numValue) {
        setMinPriceInput(clampedValue.toString());
      }
      setCurrentPage(1);
    }
  };

  const handleMaxPriceInputChange = (e) => {
    const value = e.target.value;
    setMaxPriceInput(value);
    // Allow empty input while typing
    if (value === "" || value === "-") {
      return;
    }
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 10000) {
      const clampedValue = Math.max(numValue, minPrice);
      setMaxPrice(clampedValue);
      if (clampedValue !== numValue) {
        setMaxPriceInput(clampedValue.toString());
      }
      setCurrentPage(1);
    }
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setMinPrice(0);
    setMaxPrice(10000);
    setMinPriceInput("0");
    setMaxPriceInput("10000");
    setSelectedSort("newest");
    setSearchQuery(""); // Clear search query as well
    setCurrentPage(1);
  };

  const handleSort = value => {
    setSelectedSort(value);
    setCurrentPage(1);
  };

  const handleProductsPerPageChange = (value) => {
    setProductsPerPage(value);
    setCurrentPage(1); // Reset to first page when changing products per page
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    // Filter products in the current component instead of navigating
    setCurrentPage(1); // Reset to first page when searching
  };

  const uniqueCategories = [
    ...new Set(products.map(p => p.category?.category_name))
  ].filter(Boolean);

  return (
    <div className="bg-white">
      <main className="mx-auto px-4 sm:px-6 lg:px-24">
        <div className="flex flex-col sm:flex-row items-baseline justify-between border-b border-gray-200 pb-6 pt-24 gap-4">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Categories</h1>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <label htmlFor="products-per-page" className="text-sm text-gray-600 whitespace-nowrap">
                Products per page:
              </label>
              <select
                id="products-per-page"
                className="px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 bg-white text-gray-600 text-sm flex-1 sm:flex-none"
                value={productsPerPage}
                onChange={(e) => handleProductsPerPageChange(Number(e.target.value))}
              >
                {productsPerPageOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <section aria-labelledby="products-heading" className="pb-24 pt-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Filter Section */}
            <div className="w-full md:w-64 lg:w-72 flex-shrink-0">
              <div className="sticky top-6 space-y-4">
                {/* Filter Box */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="py-3 flex justify-between items-center border-b border-gray-200 mb-4">
                    <h1 className="text-lg opacity-50 font-bold">Filter <FilterAltIcon /></h1>
                    {(selectedCategories.length > 0 || minPrice > 0 || maxPrice < 10000 || (selectedSort && selectedSort !== "newest") || searchQuery.trim()) && (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<ClearIcon />}
                        onClick={handleClearFilters}
                        sx={{
                          color: "#6B7280",
                          borderColor: "#6B7280",
                          "&:hover": {
                            borderColor: "#34D399",
                            color: "#34D399"
                          }
                        }}
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                  <form className="hidden lg:block">
                    <div className="space-y-4">
                      <h2 className="text-sm font-semibold text-gray-500">Category</h2>
                      <div className="space-y-2">
                        {uniqueCategories.map((name, idx) => (
                          <FormControlLabel
                            key={idx}
                            control={
                              <Checkbox
                                checked={selectedCategories.includes(name)}
                                onChange={() => handleCategoryToggle(name)}
                                sx={{
                                  color: "#6B7280",
                                  "&.Mui-checked": {
                                    color: "#34D399"
                                  }
                                }}
                              />
                            }
                            label={name}
                            className="cursor-pointer"
                          />
                        ))}
                      </div>

                      <h2 className="text-sm font-semibold text-gray-500">Sort By</h2>
                      <div className="space-y-2">
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 bg-white text-gray-700 text-sm"
                          value={selectedSort}
                          onChange={(e) => handleSort(e.target.value)}
                        >
                          {sortOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <h2 className="text-sm font-semibold text-gray-500">Price</h2>
                      <div className="items-center space-x-4">
                        <Slider
                          value={[minPrice, maxPrice]}
                          onChange={handleChange}
                          valueLabelDisplay="auto"
                          aria-label="range-slider"
                          min={0} step={50} max={10000}
                          sx={{ maxWidth: "250px", width: "250px", color: "#34D399" }}
                        />
                        <div className="flex items-center space-x-2 mt-4">
                          <div className="flex flex-col">
                            <label className="text-xs text-gray-500 mb-1">Min Price</label>
                            <input
                              type="number"
                              min="0"
                              max="10000"
                              step="50"
                              value={minPriceInput}
                              onChange={handleMinPriceInputChange}
                              onBlur={() => {
                                const numValue = parseFloat(minPriceInput) || 0;
                                if (numValue < 0) {
                                  setMinPriceInput("0");
                                  setMinPrice(0);
                                } else if (numValue > maxPrice) {
                                  setMinPriceInput(maxPrice.toString());
                                  setMinPrice(maxPrice);
                                } else if (numValue > 10000) {
                                  setMinPriceInput("10000");
                                  setMinPrice(10000);
                                } else {
                                  setMinPrice(numValue);
                                }
                                setCurrentPage(1);
                              }}
                              className="px-2 py-1 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 w-24 text-sm"
                            />
                          </div>
                          <span className="text-gray-400 mt-6">-</span>
                          <div className="flex flex-col">
                            <label className="text-xs text-gray-500 mb-1">Max Price</label>
                            <input
                              type="number"
                              min="0"
                              max="10000"
                              step="50"
                              value={maxPriceInput}
                              onChange={handleMaxPriceInputChange}
                              onBlur={() => {
                                const numValue = parseFloat(maxPriceInput) || 10000;
                                if (numValue > 10000) {
                                  setMaxPriceInput("10000");
                                  setMaxPrice(10000);
                                } else if (numValue < minPrice) {
                                  setMaxPriceInput(minPrice.toString());
                                  setMaxPrice(minPrice);
                                } else if (numValue < 0) {
                                  setMaxPriceInput("0");
                                  setMaxPrice(0);
                                } else {
                                  setMaxPrice(numValue);
                                }
                                setCurrentPage(1);
                              }}
                              className="px-2 py-1 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 w-24 text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>

                {/* Search Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="py-3 flex items-center border-b border-gray-200 mb-4">
                    <h1 className="text-lg opacity-50 font-bold">Search <SearchIcon /></h1>
                  </div>
                  <form onSubmit={handleSearchSubmit} className="hidden lg:block">
                    <div className="flex items-center gap-2 w-full">
                      <input
                        type="text"
                        placeholder="Search products..."
                        className="flex-1 min-w-0 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                        value={searchQuery}
                        onChange={handleSearchChange}
                      />
                      {searchQuery.trim() && (
                        <button
                          type="button"
                          onClick={() => {
                            setSearchQuery("");
                            setCurrentPage(1);
                          }}
                          className="flex-shrink-0 px-2 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                          aria-label="Clear search"
                        >
                          <ClearIcon sx={{ fontSize: "20px" }} />
                        </button>
                      )}
                      <button
                        type="submit"
                        disabled={!searchQuery.trim()}
                        className={`flex-shrink-0 px-3 py-2 border rounded-md shadow-sm text-white text-sm transition whitespace-nowrap
                          ${
                            searchQuery.trim()
                              ? "bg-blue-500 hover:bg-blue-600 cursor-pointer"
                              : "bg-gray-300 opacity-60 cursor-not-allowed"
                          }`}
                      >
                        Search
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Product List */}
            <div className="flex-1 min-w-0">
              {/* Search Results Header */}
              {searchQuery.trim() && (
                <div className="mb-6 pb-4 border-b border-gray-200">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Search Results for: <span className="text-green-600">"{searchQuery}"</span>
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {(() => {
                      // Calculate total filtered products (before pagination)
                      let filtered = [...products];
                      if (searchQuery.trim()) {
                        const query = searchQuery.trim().toLowerCase();
                        filtered = filtered.filter(p => 
                          p.productName?.toLowerCase().includes(query)
                        );
                      }
                      if (selectedCategories.length > 0) {
                        filtered = filtered.filter(p => 
                          selectedCategories.includes(p.category?.category_name)
                        );
                      }
                      filtered = filtered.filter(p => p.price >= minPrice && p.price <= maxPrice);
                      return filtered.length > 0 
                        ? `Found ${filtered.length} product${filtered.length !== 1 ? 's' : ''}`
                        : 'No products found';
                    })()}
                  </p>
                </div>
              )}
              
              <div 
                className="products-grid gap-4"
                style={{
                  '--grid-cols-lg': gridColumns.toString()
                }}
              >
              {displayedProducts.length === 0 ? (
                <div className="flex items-center justify-center w-max h-full">
                  <p className="custom-message">No products available.</p>
                </div>
              ) : (
                displayedProducts.map((item, index) => (
                  <div key={index} className="flex items-start justify-center">
                    <ProductCard product={item} handleClick={handleClick} />
                  </div>
                ))
              )}
              </div>
              {displayedProducts.length > 0 && (
                <div className="flex flex-col items-center justify-center mt-6 gap-4">
                  {/* Custom Windowed Pagination */}
                  {totalPages > 1 && (() => {
                    const windowSize = 1; // ±2 pages
                    const startPage = Math.max(2, currentPage - windowSize);
                    const endPage = Math.min(totalPages - 1, currentPage + windowSize);
                    const showStartEllipsis = startPage > 2;
                    const showEndEllipsis = endPage < totalPages - 1;

                    return (
                      <div className="flex items-center gap-1">
                        {/* Previous Page Arrow */}
                        <button
                          onClick={() => handlePageChange(null, Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className={`px-2 py-2 min-w-[40px] border rounded-md text-sm font-medium transition-colors flex items-center justify-center ${
                            currentPage === 1
                              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                          }`}
                          aria-label="Previous page"
                        >
                          <ChevronLeftIcon sx={{ fontSize: "20px" }} />
                        </button>

                        {/* First Page */}
                        <button
                          onClick={() => handlePageChange(null, 1)}
                          className={`px-3 py-2 min-w-[40px] border rounded-md text-sm font-medium transition-colors ${
                            currentPage === 1
                              ? "bg-green-500 text-white border-green-500"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          1
                        </button>

                        {/* Ellipsis before window */}
                        {showStartEllipsis && (
                          <span className="px-2 text-gray-500">…</span>
                        )}

                        {/* Window pages (current ± 2) */}
                        {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i)
                          .map(page => (
                            <button
                              key={page}
                              onClick={() => handlePageChange(null, page)}
                              className={`px-3 py-2 min-w-[40px] border rounded-md text-sm font-medium transition-colors ${
                                currentPage === page
                                  ? "bg-green-500 text-white border-green-500"
                                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              {page}
                            </button>
                          ))}

                        {/* Ellipsis after window */}
                        {showEndEllipsis && (
                          <span className="px-2 text-gray-500">…</span>
                        )}

                        {/* Last Page */}
                        {totalPages > 1 && (
                          <button
                            onClick={() => handlePageChange(null, totalPages)}
                            className={`px-3 py-2 min-w-[40px] border rounded-md text-sm font-medium transition-colors ${
                              currentPage === totalPages
                                ? "bg-green-500 text-white border-green-500"
                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            {totalPages}
                          </button>
                        )}

                        {/* Next Page Arrow */}
                        <button
                          onClick={() => handlePageChange(null, Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className={`px-2 py-2 min-w-[40px] border rounded-md text-sm font-medium transition-colors flex items-center justify-center ${
                            currentPage === totalPages
                              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                          }`}
                          aria-label="Next page"
                        >
                          <ChevronRightIcon sx={{ fontSize: "20px" }} />
                        </button>
                      </div>
                    );
                  })()}
                  
                  {/* Quick Page Navigation */}
                  {totalPages > 1 && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>Page</span>
                      <form onSubmit={handlePageInputSubmit} className="flex items-center gap-2">
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={pageInput}
                          onChange={handlePageInputChange}
                          onBlur={handlePageInputBlur}
                          placeholder={currentPage.toString()}
                          className="w-12 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 text-center text-sm"
                          aria-label="Go to page"
                        />
                        <span>of {totalPages}</span>
                        <button
                          type="submit"
                          className="px-3 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
                          aria-label="Go to page"
                        >
                          Go
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      
      {/* Separator line at bottom */}
      <div className="flex justify-center pb-8">
        <div className="w-32 h-px bg-gray-300"></div>
      </div>
    </div>
  );
}
