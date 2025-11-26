// src/admin/product/ProductModal.js
import React, { useState } from 'react';

const ProductModal = ({ product, onClose, onSave }) => {

    const [formData, setFormData] = useState({
        title: product?.title || '',
        description: product?.description || '',
        brand: product?.brand || '',
        price: product?.price || 0,
        quantity: product?.quantity || 0,
        firstLevelCategory: product?.firstLevelCategory || '',
        secondLevelCategory: product?.secondLevelCategory || '',
        colors: product?.colors || [],      // array string
        images: product?.images || []       // array object: { url }
    });

    const [newColor, setNewColor] = useState('');
    const [newImageUrl, setNewImageUrl] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // build req body đúng CreateProductRequest
        const payload = {
            title: formData.title,
            description: formData.description,
            brand: formData.brand,
            price: parseInt(formData.price),
            quantity: parseInt(formData.quantity),
            firstLevelCategory: formData.firstLevelCategory,
            secondLevelCategory: formData.secondLevelCategory,
            colors: formData.colors.map(c => ({ color: c })),
            images: formData.images.map(url => ({ url }))
        };

        if (product) {
            await onSave(product.id, payload);
        } else {
            await onSave(payload);
        }

        onClose();
    };

    const addColor = () => {
        if (newColor.trim() !== '') {
            setFormData({ ...formData, colors: [...formData.colors, newColor] });
            setNewColor('');
        }
    };

    const removeColor = (c) => {
        setFormData({ ...formData, colors: formData.colors.filter(x => x !== c) });
    };

    const addImage = () => {
        if (newImageUrl.trim() !== '') {
            setFormData({ ...formData, images: [...formData.images, newImageUrl] });
            setNewImageUrl('');
        }
    };

    const removeImage = (url) => {
        setFormData({ ...formData, images: formData.images.filter(x => x !== url) });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={onClose}>
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}>

                <h3 className="text-xl font-semibold mb-4">
                    {product ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Title */}
                    <div>
                        <label className="block font-medium">Tên sản phẩm *</label>
                        <input
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block font-medium">Mô tả *</label>
                        <textarea
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
                    </div>

                    {/* Brand + Price */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block font-medium">Brand *</label>
                            <input
                                value={formData.brand}
                                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                required
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block font-medium">Giá *</label>
                            <input
                                type="number"
                                min={0}
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                required
                                className="w-full px-3 py-2 border rounded"
                            />
                        </div>
                    </div>

                    {/* Qty */}
                    <div>
                        <label className="block font-medium">Số lượng *</label>
                        <input
                            type="number"
                            min={0}
                            value={formData.quantity}
                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                            required
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>

                    {/* Category 1 */}
                    <div>
                        <label className="block font-medium">First Level Category *</label>
                        <input
                            value={formData.firstLevelCategory}
                            onChange={(e) => setFormData({ ...formData, firstLevelCategory: e.target.value })}
                            placeholder="example: Electronics"
                            required
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>

                    {/* Category2 */}
                    <div>
                        <label className="block font-medium">Second Level Category *</label>
                        <input
                            value={formData.secondLevelCategory}
                            onChange={(e) => setFormData({ ...formData, secondLevelCategory: e.target.value })}
                            placeholder="example: Laptop / Phone"
                            required
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>

                    {/* COLORS */}
                    <div>
                        <label className="block font-medium">Màu sắc</label>
                        <div className="flex gap-2 mb-2">
                            <input
                                placeholder="Thêm màu (Red, Blue ...)"
                                value={newColor}
                                onChange={(e) => setNewColor(e.target.value)}
                                className="flex-1 px-3 py-2 border rounded"
                            />
                            <button
                                type="button"
                                onClick={addColor}
                                className="px-3 py-2 bg-gray-800 text-white rounded"
                            >
                                +
                            </button>
                        </div>

                        <div className="flex gap-2 flex-wrap">
                            {formData.colors.map(c => (
                                <span key={c} className="px-2 py-1 bg-gray-200 rounded flex items-center gap-2">
                                    {c}
                                    <button
                                        type="button"
                                        onClick={() => removeColor(c)}
                                        className="text-red-500"
                                    >
                                        ✕
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* IMAGES */}
                    <div>
                        <label className="block font-medium">Hình ảnh sản phẩm</label>
                        <div className="flex gap-2 mb-2">
                            <input
                                placeholder="https://..."
                                value={newImageUrl}
                                onChange={(e) => setNewImageUrl(e.target.value)}
                                className="flex-1 px-3 py-2 border rounded"
                            />
                            <button
                                type="button"
                                onClick={addImage}
                                className="px-3 py-2 bg-gray-800 text-white rounded"
                            >
                                +
                            </button>
                        </div>

                        <ul className="space-y-1">
                            {formData.images.map(url => (
                                <li key={url} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                                    <span className="truncate">{url}</span>
                                    <button
                                        type="button"
                                        className="text-red-600"
                                        onClick={() => removeImage(url)}
                                    >
                                        ✕
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex gap-3 justify-end pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-black text-white rounded"
                        >
                            {product ? "Cập nhật" : "Thêm mới"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductModal;
