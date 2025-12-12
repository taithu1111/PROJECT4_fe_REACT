// src/admin/payment/PaymentDetailModal.js
import React from 'react';
import { X, CheckCircle, Package } from 'lucide-react';

const PaymentDetailModal = ({ order, onClose, onConfirmPayment }) => {
    // Kiểm tra nếu order không tồn tại
    if (!order) {
        return null;
    }

    const handleConfirmPayment = () => {
        if (window.confirm('Xác nhận đơn hàng này đã được thanh toán?')) {
            onConfirmPayment(order.id);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-[#2d2d2d]">
                        Chi tiết thanh toán: {order.orderId}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Thông tin đơn hàng */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-[#2d2d2d] mb-3 flex items-center gap-2">
                            <Package size={18} />
                            Thông tin đơn hàng
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Mã đơn hàng
                                </label>
                                <p className="text-sm text-gray-900 font-semibold">{order.orderId}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Trạng thái
                                </label>
                                <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Đã giao
                                </span>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Ngày đặt hàng
                                </label>
                                <p className="text-sm text-gray-900">
                                    {order.orderDate ? new Date(order.orderDate).toLocaleString('vi-VN') : '-'}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Ngày giao hàng
                                </label>
                                <p className="text-sm text-gray-900">
                                    {order.deliveryDate ? new Date(order.deliveryDate).toLocaleString('vi-VN') : '-'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Thông tin khách hàng */}
                    <div>
                        <h4 className="font-semibold text-[#2d2d2d] mb-3">Thông tin khách hàng</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <p className="text-sm text-gray-900">
                                    {order.user?.email || `User #${order.userId}`}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Số điện thoại
                                </label>
                                <p className="text-sm text-gray-900">
                                    {order.user?.mobile || '-'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Địa chỉ giao hàng */}
                    <div>
                        <h4 className="font-semibold text-[#2d2d2d] mb-3">Địa chỉ giao hàng</h4>
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

                    {/* Danh sách sản phẩm */}
                    <div>
                        <h4 className="font-semibold text-[#2d2d2d] mb-3">Sản phẩm đã đặt</h4>
                        <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
                            {order.orderItems && order.orderItems.length > 0 ? (
                                order.orderItems.map((item, index) => (
                                    <div key={index} className="p-4 flex justify-between items-center">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">
                                                {item.product?.productName || 'Product'}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Số lượng: {item.quantity} × ${item.price}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-gray-900">
                                                ${(item.price * item.quantity).toFixed(2)}
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

                    {/* Tổng thanh toán */}
                    <div className="border-t border-gray-300 pt-4">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-[#2d2d2d]">Tổng cộng:</span>
                            <span className="text-2xl font-bold text-green-600">
                                ${order.totalPrice.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Đóng
                    </button>
                    <button
                        onClick={handleConfirmPayment}
                        className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <CheckCircle size={18} />
                        <span className="font-medium">Xác nhận thanh toán</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentDetailModal;