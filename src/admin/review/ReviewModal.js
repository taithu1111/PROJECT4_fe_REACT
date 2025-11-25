import React, { useState } from 'react';
const ReviewModal = ({ review, onClose }) => {
    const [reviewText, setReviewText] = useState(review.review);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
                <h3 className="text-xl font-semibold text-[#2d2d2d] mb-4">
                    Chỉnh sửa bình luận
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sản phẩm</label>
                        <p className="text-sm text-gray-900">{review.productName}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Người dùng</label>
                        <p className="text-sm text-gray-900">{review.userName}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung bình luận</label>
                        <textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d2d2d]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ngày tạo</label>
                        <p className="text-sm text-gray-900">
                            {new Date(review.createdAt).toLocaleString('vi-VN')}
                        </p>
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Hủy
                    </button>
                    <button
                        className="flex-1 px-4 py-2 bg-[#2d2d2d] text-white rounded-lg hover:bg-[#1a1a1a] transition-colors"
                    >
                        Cập nhật
                    </button>
                </div>
            </div>
        </div>
    );
};
export default ReviewModal; 