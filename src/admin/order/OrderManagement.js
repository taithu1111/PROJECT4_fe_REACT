// src/admin/order/OrderManagement.js
import React, { useState, useEffect } from 'react';
import { Edit, Search, ShoppingCart, RefreshCw } from 'lucide-react';
import OrderDetailModal from './OrderDetailModal';
import AdminOrderService from '../api/AdminOrderService';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize] = useState(10);

    const statusOptions = [
        { value: 'all', label: 'Tất cả' },
        { value: 'PENDING', label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800' },
        { value: 'CONFIRMED', label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800' },
        { value: 'SHIPPED', label: 'Đang giao', color: 'bg-purple-100 text-purple-800' },
        { value: 'DELIVERED', label: 'Đã giao', color: 'bg-green-100 text-green-800' },
        { value: 'CANCELLED', label: 'Đã hủy', color: 'bg-red-100 text-red-800' }
    ];

    useEffect(() => {
        fetchOrders();
    }, [currentPage]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await AdminOrderService.getAllOrders(currentPage, pageSize, 'orderDate');
            setOrders(data.content || []);
            setTotalPages(data.totalPages || 0);
            setError(null);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError('Không thể tải danh sách đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            let updatedOrder;
            switch (newStatus) {
                case 'CONFIRMED':
                    updatedOrder = await AdminOrderService.confirmOrder(orderId);
                    break;
                case 'SHIPPED':
                    updatedOrder = await AdminOrderService.shipOrder(orderId);
                    break;
                case 'DELIVERED':
                    updatedOrder = await AdminOrderService.deliverOrder(orderId);
                    break;
                case 'CANCELLED':
                    updatedOrder = await AdminOrderService.cancelOrder(orderId);
                    break;
                default:
                    return;
            }

            setOrders(orders.map(order =>
                order.id === orderId ? updatedOrder : order
            ));
            setSelectedOrder(null);
        } catch (err) {
            console.error('Error updating order status:', err);
            alert('Không thể cập nhật trạng thái đơn hàng');
        }
    };

    const handleDeleteOrder = async (orderId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) return;

        try {
            await AdminOrderService.deleteOrder(orderId);
            fetchOrders();
        } catch (err) {
            console.error('Error deleting order:', err);
            alert('Không thể xóa đơn hàng');
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.orderId?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || order.orderStatus === filterStatus;
        return matchesSearch && matchesStatus;
    });

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
                <h2 className="text-2xl font-semibold text-[#2d2d2d]">Quản lý đơn hàng</h2>
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
                                placeholder="Tìm kiếm theo mã đơn hàng..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d2d2d]"
                            />
                        </div>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d2d2d]"
                        >
                            {statusOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        <button
                            onClick={fetchOrders}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            <RefreshCw size={20} />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {filteredOrders.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <ShoppingCart size={48} className="mx-auto mb-2 text-gray-300" />
                            <p>Chưa có đơn hàng nào</p>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã đơn</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày đặt</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Khách hàng</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tổng tiền</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredOrders.map(order => {
                                    const status = statusOptions.find(s => s.value === order.orderStatus);
                                    return (
                                        <tr key={order.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.orderId}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {order.orderDate ? new Date(order.orderDate).toLocaleDateString('vi-VN') : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {order.user?.email || `User #${order.userId}`}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">${order.totalPrice}</td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${status?.color}`}>
                                                    {status?.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
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

            {selectedOrder && (
                <OrderDetailModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    statusOptions={statusOptions}
                    onStatusChange={handleStatusChange}
                />
            )}
        </div>
    );
};

export default OrderManagement;