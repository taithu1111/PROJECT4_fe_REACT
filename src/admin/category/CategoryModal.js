// src/admin/category/CategoryModal.js
import React, { useState } from 'react';

const CategoryModal = ({ category, categories, onClose, onCreate, onUpdate }) => {
    const [formData, setFormData] = useState({
        name: category?.name || '',
        level: category?.level || 1,
        parentId: category?.parentCategoryId || null
    });
    const [loading, setLoading] = useState(false);

    // Filter out current category and its children to prevent circular reference
    const availableParentCategories = categories.filter(cat => {
        if (category) {
            // Can't be parent of itself
            if (cat.id === category.id) return false;
            // Can't select a child as parent
            if (cat.parentCategoryId === category.id) return false;
        }
        return true;
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.name.trim()) {
            alert('Vui lòng nhập tên danh mục');
            return;
        }

        if (formData.level < 1) {
            alert('Cấp độ phải lớn hơn 0');
            return;
        }
        // **Validation danh mục cha**
        if (formData.level > 1 && !formData.parentCategoryId) {
            alert('Vui lòng chọn danh mục cha cho danh mục cấp 2 trở lên');
            return;
        }

        setLoading(true);
        try {
            // Prepare data for API
            const categoryData = {
                name: formData.name.trim(),
                level: parseInt(formData.level),
                parentId: formData.parentCategoryId || null
            };

            if (category) {
                // Update existing category
                await onUpdate(category.id, categoryData);
            } else {
                // Create new category
                await onCreate(categoryData);
            }
        } catch (error) {
            console.error('Error saving category:', error);
            alert('Không thể lưu danh mục. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleLevelChange = (newLevel) => {
        const level = parseInt(newLevel);
        setFormData({
            ...formData,
            level,
            // Reset parent if level is 1 (top level)
            parentCategoryId: level === 1 ? null : formData.parentCategoryId
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-xl font-semibold text-[#2d2d2d] mb-4">
                    {category ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên danh mục <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d2d2d]"
                            placeholder="Nhập tên danh mục"
                            disabled={loading}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Cấp độ <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="5"
                            value={formData.level}
                            onChange={(e) => handleLevelChange(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d2d2d]"
                            disabled={loading}
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Cấp 1: Danh mục gốc, Cấp 2+: Danh mục con
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Danh mục cha
                        </label>
                        <select
                            value={formData.parentCategoryId || ''}
                            onChange={(e) => setFormData({
                                ...formData,
                                parentCategoryId: e.target.value ? parseInt(e.target.value) : null
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d2d2d]"
                            disabled={loading || formData.level === 1}
                        >
                            <option value="">Không có (Danh mục gốc)</option>
                            {availableParentCategories
                                .filter(cat => cat.level < formData.level)
                                .map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name} (Cấp {cat.level})
                                    </option>
                                ))}
                        </select>
                        {formData.level === 1 && (
                            <p className="text-xs text-gray-500 mt-1">
                                Danh mục cấp 1 không có danh mục cha
                            </p>
                        )}
                    </div>

                    {category && (
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <p className="text-xs text-blue-800">
                                <strong>Lưu ý:</strong> Thay đổi danh mục có thể ảnh hưởng đến các sản phẩm liên quan
                            </p>
                        </div>
                    )}

                    <div className="flex gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-[#2d2d2d] text-white rounded-lg hover:bg-[#1a1a1a] transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Đang xử lý...' : (category ? 'Cập nhật' : 'Thêm mới')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryModal;