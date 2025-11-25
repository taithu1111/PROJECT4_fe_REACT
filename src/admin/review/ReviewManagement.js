import React, { useState } from 'react';
import { Edit, Trash2, Search } from 'lucide-react';
import ReviewModal from './ReviewModal';
const ReviewManagement = () => {
    const [reviews, setReviews] = useState([
        { id: 1, review: 'Review sản phẩm 1 của user 1', productId: 1, productName: 'iPhone 15 Pro', userId: 1, userName: 'phuc t', createdAt: '2025-11-15 15:36:37' },
        { id: 2, review: 'Review sản phẩm 2 của user 1', productId: 2, productName: 'Samsung Galaxy S23', userId: 1, userName: 'phuc t', createdAt: '2025-11-15 15:36:37' },
        { id: 3, review: 'Review sản phẩm 3 của user 1', productId: 3, productName: 'Sony WH‑1000XM5 Headphones', userId: 1, userName: 'phuc t', createdAt: '2025-11-15 15:36:37' },
    ]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedReview, setSelectedReview] = useState(null);

    const filteredReviews = reviews.filter(review =>
        review.review.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.userName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-[#2d2d2d]">Quản lý bình luận</h2>
            </div>

            <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm bình luận..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d2d2d]"
                        />
                    </div>
                </div>

                <div className="divide-y divide-gray-200">
                    {filteredReviews.map(review => (
                        <div key={review.id} className="p-6 hover:bg-gray-50">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-gray-900">{review.userName}</span>
                                        <span className="text-xs text-gray-500">•</span>
                                        <span className="text-xs text-gray-500">
                                            {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">{review.productName}</p>
                                    <p className="text-sm text-gray-900">{review.review}</p>
                                </div>
                                <div className="flex gap-2 ml-4">
                                    <button
                                        onClick={() => setSelectedReview(review)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedReview && <ReviewModal review={selectedReview} onClose={() => setSelectedReview(null)} />}
        </div>
    );
};
export default ReviewManagement;