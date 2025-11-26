// src/admin/rating/RatingManagement.js
import React, { useState, useEffect } from 'react';
import { Star, Trash2, Search, Edit, RefreshCw } from 'lucide-react';
import RatingModal from './RatingModal';
import AdminRatingService from '../api/AdminRatingService';

const RatingManagement = () => {
    const [ratings, setRatings] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRating, setFilterRating] = useState('all');
    const [selectedRating, setSelectedRating] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize] = useState(10);

    useEffect(() => {
        fetchRatings();
    }, [currentPage]);

    const fetchRatings = async () => {
        try {
            setLoading(true);
            const data = await AdminRatingService.getAllRatings(null, null, currentPage, pageSize);
            setRatings(data.content || []);
            setTotalPages(data.totalPages || 0);
            setError(null);
        } catch (err) {
            console.error('Error fetching ratings:', err);
            setError('Không thể tải danh sách đánh giá');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateRating = async (ratingId, newRating) => {
        try {
            const updatedRating = await AdminRatingService.updateRating(ratingId, newRating);
            setRatings(ratings.map(r => r.id === ratingId ? updatedRating : r));
        } catch (err) {
            console.error('Error updating rating:', err);
            throw err;
        }
    };

    const handleDeleteRating = async (ratingId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) return;

        try {
            await AdminRatingService.deleteRating(ratingId);
            fetchRatings();
        } catch (err) {
            console.error('Error deleting rating:', err);
            alert('Không thể xóa đánh giá');
        }
    };

    const filteredRatings = ratings.filter(rating => {
        const matchesSearch =
            rating.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rating.userEmail?.toLowerCase().includes(searchTerm.toLowerCase());

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

    if (loading && ratings.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <RefreshCw className="animate-spin text-gray-400" size={32} />
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-[#2d2d2d]">Quản lý đánh giá</h2>
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
                        <button
                            onClick={fetchRatings}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            <RefreshCw size={20} />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {filteredRatings.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <Star size={48} className="mx-auto mb-2 text-gray-300" />
                            <p>Chưa có đánh giá nào</p>
                        </div>
                    ) : (
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
                                        <td className="px-6 py-4 text-sm text-gray-900">{rating.userEmail}</td>
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
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setSelectedRating(rating)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteRating(rating.id)}
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

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="p-4 border-t border-gray-200 flex justify-between items-center">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                            disabled={currentPage === 0}
                            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
                        >
                            Trước
                        </button>
                        <span className="text-sm text-gray-600">
                            Trang {currentPage + 1} / {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                            disabled={currentPage >= totalPages - 1}
                            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
                        >
                            Sau
                        </button>
                    </div>
                )}
            </div>

            {selectedRating && (
                <RatingModal
                    rating={selectedRating}
                    onClose={() => setSelectedRating(null)}
                    onUpdate={handleUpdateRating}
                />
            )}
        </div>
    );
};

export default RatingManagement;