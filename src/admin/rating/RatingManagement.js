import React, { useState } from 'react';
import { Star, Trash2, Search } from 'lucide-react';
const RatingManagement = () => {
    const [ratings, setRatings] = useState([
        { id: 1, rating: 5, productId: 1, productName: 'iPhone 15 Pro', userId: 1, userName: 'phuc t', createdAt: '2025-11-15 15:36:37' },
        { id: 2, rating: 4.9, productId: 2, productName: 'Samsung Galaxy S23', userId: 1, userName: 'phuc t', createdAt: '2025-11-15 15:36:37' },
        { id: 3, rating: 4.8, productId: 3, productName: 'Sony WH‑1000XM5 Headphones', userId: 1, userName: 'phuc t', createdAt: '2025-11-15 15:36:37' },
    ]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRating, setFilterRating] = useState('all');

    const filteredRatings = ratings.filter(rating => {
        const matchesSearch = rating.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rating.userName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRating = filterRating === 'all' ||
            (filterRating === '5' && rating.rating === 5) ||
            (filterRating === '4+' && rating.rating >= 4 && rating.rating < 5) ||
            (filterRating === '3+' && rating.rating >= 3 && rating.rating < 4) ||
            (filterRating === 'low' && rating.rating < 3);
        return matchesSearch && matchesRating;
    });

    const getRatingColor = (rating) => {
        if (rating >= 4.5) return 'text-green-600';
        if (rating >= 3.5) return 'text-yellow-600';
        return 'text-red-600';
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-[#2d2d2d]">Quản lý đánh giá</h2>
            </div>

            <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo sản phẩm hoặc người dùng..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d2d2d]"
                            />
                        </div>
                        <select
                            value={filterRating}
                            onChange={(e) => setFilterRating(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d2d2d]"
                        >
                            <option value="all">Tất cả đánh giá</option>
                            <option value="5">5 sao</option>
                            <option value="4+">4+ sao</option>
                            <option value="3+">3+ sao</option>
                            <option value="low">Dưới 3 sao</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sản phẩm</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Người dùng</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Đánh giá</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày tạo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredRatings.map(rating => (
                                <tr key={rating.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-900">{rating.id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{rating.productName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{rating.userName}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <div className="flex items-center gap-1">
                                            <Star size={16} className={`${getRatingColor(rating.rating)} fill-current`} />
                                            <span className={`font-semibold ${getRatingColor(rating.rating)}`}>
                                                {rating.rating}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {new Date(rating.createdAt).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
export default RatingManagement;