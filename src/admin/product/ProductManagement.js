// src/admin/product/ProductManagement.js
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductModal from './ProductModal';
import AdminProductService from '../api/AdminProductService';
import { formatCurrency } from '../../comon/formatCurrency';

const ProductManagement = ({ openCreateProduct, onResetCreateFlag }) => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [filterBrand, setFilterBrand] = useState('all');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageInput, setPageInput] = useState("");
    const itemsPerPage = 10;

    useEffect(() => {
        fetchProducts();
    }, []);
    useEffect(() => {
        if (openCreateProduct) {
            setEditingProduct(null);
            setShowModal(true);
            onResetCreateFlag(); // reset để tránh modal tự mở khi đổi tab
        }
    }, [openCreateProduct]);


    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await AdminProductService.getALlProduct();
            setProducts(data);
            // console.log("Products fetched: ", products[1]);
            setError(null);
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Không thể tải danh sách sản phẩm');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProduct = async (productData) => {
        try {
            await AdminProductService.createProduct(productData);
            fetchProducts();
            setShowModal(false);
        } catch (err) {
            console.error('Error creating product:', err);
            alert('Không thể tạo sản phẩm');
        }
    };

    const handleUpdateProduct = async (productId, productData) => {
        try {
            await AdminProductService.updateProduct(productId, productData);
            fetchProducts();
            setShowModal(false);
        } catch (err) {
            console.error('Error updating product:', err);
            alert('Không thể cập nhật sản phẩm');
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;

        try {
            await AdminProductService.deleteProduct(productId);
            fetchProducts();
        } catch (err) {
            console.error('Error deleting product:', err);
            alert('Không thể xóa sản phẩm > Hãy kiểm tra xem sản phẩm có trong đơn hàng nào không ');
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        setPageInput("");
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePageInputChange = (e) => {
        const value = e.target.value;
        if (value === "" || /^\d+$/.test(value)) {
            setPageInput(value);
        }
    };

    const handlePageInputSubmit = (e, totalPages) => {
        e.preventDefault();
        if (pageInput === "") return;

        const pageNum = parseInt(pageInput, 10);
        if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
            setCurrentPage(pageNum);
            setPageInput("");
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePageInputBlur = (totalPages) => {
        if (pageInput !== "") {
            const pageNum = parseInt(pageInput, 10);
            if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
                setCurrentPage(pageNum);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            setPageInput("");
        }
    };

    const brands = [...new Set(products.map(p => p.brand))];

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.brand?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesBrand = filterBrand === 'all' || product.brand === filterBrand;
        return matchesSearch && matchesBrand;
    });

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterBrand]);

    const startIdx = (currentPage - 1) * itemsPerPage;
    const displayedProducts = filteredProducts.slice(startIdx, startIdx + itemsPerPage);

    if (loading && products.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <RefreshCw className="animate-spin text-gray-400" size={32} />
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-[#2d2d2d]">Quản lý sản phẩm</h2>
                <button
                    onClick={() => { setEditingProduct(null); setShowModal(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-[#2d2d2d] text-white rounded-lg hover:bg-[#1a1a1a] transition-colors"
                >
                    <Plus size={20} />
                    Thêm sản phẩm
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-red-700">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Tìm kiếm sản phẩm..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d2d2d]"
                            />
                        </div>
                        <select
                            value={filterBrand}
                            onChange={(e) => setFilterBrand(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d2d2d]"
                        >
                            <option value="all">Tất cả thương hiệu</option>
                            {brands.map(brand => (
                                <option key={brand} value={brand}>{brand}</option>
                            ))}
                        </select>
                        <button
                            onClick={fetchProducts}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            <RefreshCw size={20} />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên sản phẩm</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thương hiệu</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số lượng</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mô tả</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {displayedProducts.map(product => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-900">{product.id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{product.productName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{product.brand}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(product.price, "$")}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.quantity > 20 ? 'bg-green-100 text-green-800' :
                                            product.quantity > 0 ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                            {product.quantity}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                                        {product.description || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => { setEditingProduct(product); setShowModal(true); }}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProduct(product.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="py-4">
                        <div className="flex flex-col items-center justify-center gap-4">
                            {(() => {
                                const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
                                if (totalPages <= 1) return null;

                                const windowSize = 1;
                                const startPage = Math.max(2, currentPage - windowSize);
                                const endPage = Math.min(totalPages - 1, currentPage + windowSize);
                                const showStartEllipsis = startPage > 2;
                                const showEndEllipsis = endPage < totalPages - 1;

                                return (
                                    <>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                                disabled={currentPage === 1}
                                                className={`px-2 py-2 min-w-[40px] border rounded-md text-sm font-medium transition-colors flex items-center justify-center ${currentPage === 1
                                                    ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                                    }`}
                                                aria-label="Previous page"
                                            >
                                                <ChevronLeft size={20} />
                                            </button>

                                            <button
                                                onClick={() => handlePageChange(1)}
                                                className={`px-3 py-2 min-w-[40px] border rounded-md text-sm font-medium transition-colors ${currentPage === 1
                                                    ? "bg-green-500 text-white border-green-500"
                                                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                                    }`}
                                            >
                                                1
                                            </button>

                                            {showStartEllipsis && (
                                                <span className="px-2 text-gray-500">…</span>
                                            )}

                                            {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i)
                                                .map(page => (
                                                    <button
                                                        key={page}
                                                        onClick={() => handlePageChange(page)}
                                                        className={`px-3 py-2 min-w-[40px] border rounded-md text-sm font-medium transition-colors ${currentPage === page
                                                            ? "bg-green-500 text-white border-green-500"
                                                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                                            }`}
                                                    >
                                                        {page}
                                                    </button>
                                                ))}

                                            {showEndEllipsis && (
                                                <span className="px-2 text-gray-500">…</span>
                                            )}

                                            {totalPages > 1 && (
                                                <button
                                                    onClick={() => handlePageChange(totalPages)}
                                                    className={`px-3 py-2 min-w-[40px] border rounded-md text-sm font-medium transition-colors ${currentPage === totalPages
                                                        ? "bg-green-500 text-white border-green-500"
                                                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                                        }`}
                                                >
                                                    {totalPages}
                                                </button>
                                            )}

                                            <button
                                                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                                disabled={currentPage === totalPages}
                                                className={`px-2 py-2 min-w-[40px] border rounded-md text-sm font-medium transition-colors flex items-center justify-center ${currentPage === totalPages
                                                    ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                                    }`}
                                                aria-label="Next page"
                                            >
                                                <ChevronRight size={20} />
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <span>Page</span>
                                            <form onSubmit={(e) => handlePageInputSubmit(e, totalPages)} className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    pattern="[0-9]*"
                                                    value={pageInput}
                                                    onChange={handlePageInputChange}
                                                    onBlur={() => handlePageInputBlur(totalPages)}
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
                                    </>
                                );
                            })()}
                        </div>
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            Chưa có sản phẩm nào
                        </div>
                    )}
                </div>
            </div>

            {showModal && (
                <ProductModal
                    product={editingProduct}
                    onClose={() => setShowModal(false)}
                    onSave={editingProduct ? handleUpdateProduct : handleCreateProduct}
                />
            )}
        </div>
    );
};

export default ProductManagement;