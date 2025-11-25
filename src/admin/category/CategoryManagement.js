import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import CategoryModal from './CategoryModal';
const CategoryManagement = () => {
    const [categories, setCategories] = useState([
        { id: 1, categoryName: 'Đồ điện tử', level: 1, parentCategoryId: null },
    ]);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-[#2d2d2d]">Quản lý danh mục</h2>
                <button
                    onClick={() => { setEditingCategory(null); setShowModal(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-[#2d2d2d] text-white rounded-lg hover:bg-[#1a1a1a] transition-colors"
                >
                    <Plus size={20} />
                    Thêm danh mục
                </button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200">
                <div className="overflow-x-auto">
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
                                    <td className="px-6 py-4 text-sm text-gray-900">{category.categoryName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{category.level}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {category.parentCategoryId || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => { setEditingCategory(category); setShowModal(true); }}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && <CategoryModal category={editingCategory} onClose={() => setShowModal(false)} categories={categories} />}
        </div>
    );
};
export default CategoryManagement;  