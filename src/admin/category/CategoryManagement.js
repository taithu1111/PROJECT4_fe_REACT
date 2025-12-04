// src/admin/category/CategoryManagement.js
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, RefreshCw, FolderTree } from 'lucide-react';
import CategoryModal from './CategoryModal';
import AdminCategoryService from '../api/AdminCategoryService';

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await AdminCategoryService.getAllCategories();
            setCategories(data || []);
            setError(null);
        } catch (err) {
            console.error('Error fetching categories:', err);
            setError('Không thể tải danh sách danh mục');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCategory = async (categoryData) => {
        try {
            await AdminCategoryService.createCategory(categoryData);
            await fetchCategories();
            setShowModal(false);
        } catch (err) {
            console.error('Error creating category:', err);
            throw err;
        }
    };

    const handleUpdateCategory = async (categoryId, categoryData) => {
        try {
            await AdminCategoryService.updateCategory(categoryId, categoryData);
            await fetchCategories();
            setShowModal(false);
        } catch (err) {
            console.error('Error updating category:', err);
            throw err;
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) return;

        try {
            await AdminCategoryService.deleteCategory(categoryId);
            await fetchCategories();
        } catch (err) {
            console.error('Error deleting category:', err);
            alert('Không thể xóa danh mục. Có thể danh mục này đang được sử dụng.');
        }
    };

    const getCategoryNameById = (id) => {
        const category = categories.find(cat => cat.id === id);
        return category ? category.name : '-';
    };

    if (loading && categories.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <RefreshCw className="animate-spin text-gray-400" size={32} />
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-[#2d2d2d]">Quản lý danh mục</h2>
                <div className="flex gap-3">
                    <button
                        onClick={fetchCategories}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <RefreshCw size={20} />
                    </button>
                    <button
                        onClick={() => {
                            setEditingCategory(null);
                            setShowModal(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-[#2d2d2d] text-white rounded-lg hover:bg-[#1a1a1a] transition-colors"
                    >
                        <Plus size={20} />
                        Thêm danh mục
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-red-700">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-lg border border-gray-200">
                <div className="overflow-x-auto">
                    {categories.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <FolderTree size={48} className="mx-auto mb-2 text-gray-300" />
                            <p>Chưa có danh mục nào</p>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên danh mục</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cấp độ</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Danh mục cha</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {categories.map(category => (
                                    <tr key={category.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-900">{category.id}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                            {category.name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                                                Cấp {category.level}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {category.parentId
                                                ? getCategoryNameById(category.parentId)
                                                : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        setEditingCategory(category);
                                                        setShowModal(true);
                                                    }}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCategory(category.id)}
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
                    )}
                </div>
            </div>

            {showModal && (
                <CategoryModal
                    category={editingCategory}
                    categories={categories}
                    onClose={() => {
                        setShowModal(false);
                        setEditingCategory(null);
                    }}
                    onCreate={handleCreateCategory}
                    onUpdate={handleUpdateCategory}
                />
            )}
        </div>
    );
};

export default CategoryManagement;