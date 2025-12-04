// src/admin/review/ReviewManagement.js
import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Search, RefreshCw, MessageSquare } from 'lucide-react';
import ReviewModal from './ReviewModal';
import AdminReviewService from '../api/AdminReviewService';

const ReviewManagement = () => {
    const [reviews, setReviews] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedReview, setSelectedReview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize] = useState(10);

    useEffect(() => {
        fetchReviews();
    }, [currentPage]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const data = await AdminReviewService.getAllReviews(null, null, currentPage, pageSize);
            setReviews(data.content || []);
            setTotalPages(data.totalPages || 0);
            setError(null);
        } catch (err) {
            console.error('Error fetching reviews:', err);
            setError('Không thể tải danh sách bình luận');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateReview = async (reviewId, reviewText) => {
        try {
            const updatedReview = await AdminReviewService.updateReview(reviewId, reviewText);
            setReviews(reviews.map(r => r.id === reviewId ? updatedReview : r));
        } catch (err) {
            console.error('Error updating review:', err);
            throw err;
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa bình luận này?')) return;

        try {
            await AdminReviewService.deleteReview(reviewId);
            fetchReviews();
        } catch (err) {
            console.error('Error deleting review:', err);
            alert('Không thể xóa bình luận');
        }
    };

    const filteredReviews = reviews.filter(review =>
        review.review?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.userEmail?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && reviews.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <RefreshCw className="animate-spin text-gray-400" size={32} />
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-[#2d2d2d]">Quản lý bình luận</h2>
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
                                placeholder="Tìm kiếm bình luận..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d2d2d]"
                            />
                        </div>
                        <button
                            onClick={fetchReviews}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            <RefreshCw size={20} />
                        </button>
                    </div>
                </div>

                <div className="divide-y divide-gray-200">
                    {filteredReviews.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <MessageSquare size={48} className="mx-auto mb-2 text-gray-300" />
                            <p>Chưa có bình luận nào</p>
                        </div>
                    ) : (
                        filteredReviews.map(review => (
                            <div key={review.id} className="p-6 hover:bg-gray-50">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium text-gray-900">
                                                {review.userEmail}
                                            </span>
                                            <span className="text-xs text-gray-500">•</span>
                                            <span className="text-xs text-gray-500">
                                                {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">
                                            {review.productName}
                                        </p>
                                        <p className="text-sm text-gray-900">{review.review}</p>
                                    </div>
                                    <div className="flex gap-2 ml-4">
                                        {/* <button
                                            onClick={() => setSelectedReview(review)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <Edit size={16} />
                                        </button> */}
                                        <button
                                            onClick={() => handleDeleteReview(review.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
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

            {selectedReview && (
                <ReviewModal
                    review={selectedReview}
                    onClose={() => setSelectedReview(null)}
                    onUpdate={handleUpdateReview}
                />
            )}
        </div>
    );
};

export default ReviewManagement;