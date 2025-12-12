// src/admin/payment/PaymentManagement.js
import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, DollarSign, CheckCircle, Eye } from 'lucide-react';
import PaymentDetailModal from './PaymentDetailModal';
import AdminOrderService from '../api/AdminOrderService';

const PaymentManagement = () => {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDeliveredOrders();
    }, []);

    const fetchDeliveredOrders = async () => {
        try {
            setLoading(true);
            // Gọi API lấy tất cả đơn hàng đã giao
            const data = await AdminOrderService.getDeliveredOrders();
            setOrders(data || []);
            setError(null);
        } catch (err) {
            console.error('Error fetching delivered orders:', err);
            setError('Không thể tải danh sách đơn hàng đã giao');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmPayment = async (orderId) => {
        if (!window.confirm('Xác nhận đơn hàng này đã được thanh toán?')) return;

        try {
            setLoading(true);
            // Gọi API xác nhận thanh toán
            await AdminOrderService.confirmOrderPayment(orderId);

            // Loại bỏ đơn hàng đã thanh toán khỏi danh sách
            setOrders(orders.filter(order => order.id !== orderId));

            alert('Đã xác nhận thanh toán thành công');
        } catch (err) {
            console.error('Error confirming payment:', err);
            alert('Không thể xác nhận thanh toán');
        } finally {
            setLoading(false);
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    // Tính tổng doanh thu chưa thanh toán
    const totalUnpaidRevenue = filteredOrders.reduce((sum, order) => sum + order.totalPrice, 0);

    if (loading && orders.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <RefreshCw className="animate-spin text-gray-400" size={32} />
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-semibold text-[#2d2d2d]">Quản lý thanh toán</h2>
                    <p className="text-sm text-gray-500 mt-1">Đơn hàng đã giao chưa thanh toán</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500">Tổng chưa thanh toán</p>
                    <p className="text-2xl font-bold text-red-600">${totalUnpaidRevenue.toFixed(2)}</p>
                </div>
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
                                placeholder="Tìm kiếm theo mã đơn hàng hoặc email khách hàng..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d2d2d]"
                            />
                        </div>
                        <button
                            onClick={fetchDeliveredOrders}
                            disabled={loading}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                        >
                            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {filteredOrders.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <DollarSign size={48} className="mx-auto mb-2 text-gray-300" />
                            <p>Không có đơn hàng nào cần thanh toán</p>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã đơn</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày đặt</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày giao</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Khách hàng</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tổng tiền</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredOrders.map(order => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            {order.orderId}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {order.orderDate ? new Date(order.orderDate).toLocaleDateString('vi-VN') : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString('vi-VN') : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            <div>
                                                <p className="font-medium">{order.user?.email || `User #${order.userId}`}</p>
                                                {order.user?.mobile && (
                                                    <p className="text-xs text-gray-500">{order.user.mobile}</p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className="font-semibold text-green-600">
                                                ${order.totalPrice.toFixed(2)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Đã giao
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Xem chi tiết"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleConfirmPayment(order.id)}
                                                    disabled={loading}
                                                    className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                                                    title="Xác nhận thanh toán"
                                                >
                                                    <CheckCircle size={14} />
                                                    <span>Xác nhận TT</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {selectedOrder && selectedOrder.id && (
                <PaymentDetailModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onConfirmPayment={handleConfirmPayment}
                />
            )}
        </div>
    );
};

export default PaymentManagement;