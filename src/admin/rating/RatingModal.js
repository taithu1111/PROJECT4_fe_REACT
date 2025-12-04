// src/admin/rating/RatingModal.js
import React, { useState } from 'react';
import { Star } from 'lucide-react';

const RatingModal = ({ rating, onClose, onUpdate }) => {
    const [ratingValue, setRatingValue] = useState(rating.rating);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (ratingValue === rating.rating) {
            alert('Đánh giá chưa thay đổi');
            return;
        }

        if (ratingValue < 0 || ratingValue > 5) {
            alert('Đánh giá phải từ 0 đến 5 sao');
            return;
        }

        setLoading(true);
        try {
            await onUpdate(rating.id, ratingValue);
            onClose();
        } catch (error) {
            console.error('Error updating rating:', error);
            alert('Không thể cập nhật đánh giá');
        } finally {
            setLoading(false);
        }
    };

    const getRatingColor = (value) => {
        if (value >= 4.5) return 'text-green-600';
        if (value >= 3.5) return 'text-yellow-600';
        return 'text-red-600';
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-xl font-semibold text-[#2d2d2d] mb-4">
                    Chỉnh sửa đánh giá
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Sản phẩm
                        </label>
                        <p className="text-sm text-gray-900">{rating.productName}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Người dùng
                        </label>
                        <p className="text-sm text-gray-900">{rating.userName}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Đánh giá hiện tại
                        </label>
                        <div className="flex items-center gap-2 mb-3">
                            <Star size={20} className={`${getRatingColor(rating.rating)} fill-current`} />
                            <span className={`font-semibold ${getRatingColor(rating.rating)}`}>
                                {rating.rating}
                            </span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Đánh giá mới (0-5 sao)
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="5"
                            step="0.1"
                            value={ratingValue}
                            onChange={(e) => setRatingValue(parseFloat(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d2d2d]"
                        />
                        <div className="mt-2 flex items-center gap-2">
                            <Star size={20} className={`${getRatingColor(ratingValue)} fill-current`} />
                            <span className={`font-semibold ${getRatingColor(ratingValue)}`}>
                                {ratingValue}
                            </span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ngày tạo
                        </label>
                        <p className="text-sm text-gray-900">
                            {new Date(rating.createdAt).toLocaleString('vi-VN')}
                        </p>
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading || ratingValue === rating.rating}
                        className="flex-1 px-4 py-2 bg-[#2d2d2d] text-white rounded-lg hover:bg-[#1a1a1a] transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Đang cập nhật...' : 'Cập nhật'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RatingModal;