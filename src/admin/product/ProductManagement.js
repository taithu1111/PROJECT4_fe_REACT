// src/admin/product/ProductManagement.js
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, RefreshCw } from 'lucide-react';
import ProductModal from './ProductModal';
import AdminProductService from '../api/AdminProductService';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [filterBrand, setFilterBrand] = useState('all');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

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

    const brands = [...new Set(products.map(p => p.brand))];

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.brand?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesBrand = filterBrand === 'all' || product.brand === filterBrand;
        return matchesSearch && matchesBrand;
    });

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
                            {filteredProducts.map(product => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-900">{product.id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{product.productName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{product.brand}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">${product.price}</td>
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