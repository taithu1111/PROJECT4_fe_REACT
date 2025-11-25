// src/admin/order/OrderDetailModal.js
import React, { useState } from 'react';

const OrderDetailModal = ({ order, onClose, statusOptions, onStatusChange }) => {
    const [orderStatus, setOrderStatus] = useState(order.orderStatus);
    const [loading, setLoading] = useState(false);

    const handleUpdateStatus = async () => {
        if (orderStatus === order.orderStatus) {
            alert('Trạng thái chưa thay đổi');
            return;
        }

        setLoading(true);
        try {
            await onStatusChange(order.id, orderStatus);
            onClose();
        } catch (error) {
            console.error('Error updating order status:', error);
        } finally {
            setLoading(false);
        }
    };

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
                                {order.orderDate ? new Date(order.orderDate).toLocaleString('vi-VN') : '-'}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tổng tiền</label>
                            <p className="text-sm text-gray-900 font-semibold">${order.totalPrice}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Khách hàng</label>
                            <p className="text-sm text-gray-900">
                                {order.user?.email || `User #${order.userId}`}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                            <p className="text-sm text-gray-900">
                                {order.user?.mobile || '-'}
                            </p>
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

                    {/* Order Items */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sản phẩm</label>
                        <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
                            {order.orderItems && order.orderItems.length > 0 ? (
                                order.orderItems.map((item, index) => (
                                    <div key={index} className="p-4 flex justify-between items-center">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">
                                                {item.product?.productName || 'Product'}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Số lượng: {item.quantity}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-gray-900">
                                                ${item.price}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Tổng: ${(item.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 text-center text-gray-500 text-sm">
                                    Không có sản phẩm
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Thông tin giao hàng</label>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            {order.shippingAddress ? (
                                <div className="space-y-1 text-sm">
                                    <p className="font-medium text-gray-900">
                                        {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                                    </p>
                                    <p className="text-gray-700">{order.shippingAddress.streetAddress}</p>
                                    <p className="text-gray-700">
                                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                                    </p>
                                    <p className="text-gray-700">SĐT: {order.shippingAddress.mobile}</p>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">Chưa có thông tin giao hàng</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        Đóng
                    </button>
                    <button
                        onClick={handleUpdateStatus}
                        disabled={loading || orderStatus === order.orderStatus}
                        className="flex-1 px-4 py-2 bg-[#2d2d2d] text-white rounded-lg hover:bg-[#1a1a1a] transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Đang cập nhật...' : 'Cập nhật trạng thái'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailModal;