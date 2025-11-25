import React, { useState } from 'react';
const OrderDetailModal = ({ order, onClose, statusOptions }) => {
    const [orderStatus, setOrderStatus] = useState(order.orderStatus);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-semibold text-[#2d2d2d] mb-4">
                    Chi tiết đơn hàng: {order.orderId}
                </h3>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày đặt</label>
                            <p className="text-sm text-gray-900">
                                {new Date(order.orderDate).toLocaleString('vi-VN')}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tổng tiền</label>
                            <p className="text-sm text-gray-900 font-semibold">${order.totalPrice}</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái đơn hàng</label>
                        <select
                            value={orderStatus}
                            onChange={(e) => setOrderStatus(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d2d2d]"
                        >
                            {statusOptions.filter(s => s.value !== 'all').map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Thông tin giao hàng</label>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-900">Địa chỉ giao hàng sẽ hiển thị ở đây</p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Đóng
                    </button>
                    <button
                        className="flex-1 px-4 py-2 bg-[#2d2d2d] text-white rounded-lg hover:bg-[#1a1a1a] transition-colors"
                    >
                        Cập nhật trạng thái
                    </button>
                </div>
            </div>
        </div>
    );
};
export default OrderDetailModal;