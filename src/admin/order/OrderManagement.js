// src/admin/order/OrderManagement.js
import React, { useState, useEffect } from 'react';
import { Edit, Search, ShoppingCart, RefreshCw, Trash2, ArrowRight, CheckCircle, Truck, ChevronLeft, ChevronRight } from 'lucide-react';
import OrderDetailModal from './OrderDetailModal';
import AdminOrderService from '../api/AdminOrderService';
import { formatCurrency } from '../../comon/formatCurrency';
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

    const [pageInput, setPageInput] = useState("");

    const pageCount = totalPages; // Rename for clarity if needed, but totalPages is already state.
    // NOTE: currentPage is 0-indexed in API, but we display 1-indexed to user.

    const statusOptions = [
        { value: 'all', label: 'Tất cả' },
        { value: 'PENDING', label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800' },
        { value: 'PLACED', label: 'Đã đặt', color: 'bg-yellow-100 text-yellow-800' },
        { value: 'CONFIRMED', label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800' },
        { value: 'SHIPPED', label: 'Đang giao', color: 'bg-purple-100 text-purple-800' },
        { value: 'DELIVERED', label: 'Đã giao', color: 'bg-green-100 text-green-800' },
        { value: 'CANCELLED', label: 'Đã hủy', color: 'bg-red-100 text-red-800' },
        { value: 'PAID', label: 'Đã thanh toán', color: 'bg-teal-100 text-teal-800' }
    ];

    // Bản đồ trạng thái tiếp theo hợp lệ
    const nextStatusMap = {
        PENDING: 'PLACED',
        PLACED: 'CONFIRMED',
        CONFIRMED: 'SHIPPED',
        SHIPPED: 'DELIVERED',
        DELIVERED: null,
        CANCELLED: null
    };

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
                case 'PLACED':
                    updatedOrder = await AdminOrderService.placedOrder(orderId);
                    break;
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

            setOrders(orders.map(order => order.id === orderId ? updatedOrder : order));
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



    const handlePageChange = (newPage) => {
        // newPage is 0-indexed
        setCurrentPage(newPage);
        setPageInput("");
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePageInputChange = (e) => {
        const value = e.target.value;
        if (value === "" || /^\d+$/.test(value)) {
            setPageInput(value);
        }
    };

    const handlePageInputSubmit = (e) => {
        e.preventDefault();
        if (pageInput === "") return;

        const pageNum = parseInt(pageInput, 10);
        // pageNum is 1-indexed from user
        if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
            handlePageChange(pageNum - 1);
        }
    };

    const handlePageInputBlur = () => {
        if (pageInput !== "") {
            const pageNum = parseInt(pageInput, 10);
            if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
                handlePageChange(pageNum - 1);
            }
            setPageInput("");
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
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái tiếp theo</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredOrders.map(order => {
                                    const status = statusOptions.find(s => s.value === order.orderStatus);
                                    const nextStatus = nextStatusMap[order.orderStatus];

                                    return (
                                        <tr key={order.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.orderId}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {order.orderDate ? new Date(order.orderDate).toLocaleDateString('vi-VN') : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {order.user?.email || `User #${order.userId}`}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(order.totalPrice, "VND")}</td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${status?.color}`}>
                                                    {status?.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm flex gap-2">
                                                {/* Mở modal chi tiết */}
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Edit size={16} />
                                                </button>



                                                {/* Nút hủy */}
                                                {order.orderStatus !== 'DELIVERED' && order.orderStatus !== 'CANCELLED' && (
                                                    <button
                                                        onClick={() => handleStatusChange(order.id, 'CANCELLED')}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </td>
                                            <td>
                                                {/* Nút chuyển trạng thái tiếp theo */}
                                                {nextStatus && (
                                                    <button
                                                        onClick={() => handleStatusChange(order.id, nextStatus)}
                                                        className="flex items-center gap-1 px-2 py-1 text-white text-xs rounded bg-green-500 hover:bg-green-600"
                                                    >
                                                        {/* Icon tương ứng */}
                                                        {nextStatus === 'PLACED' && <ArrowRight size={12} />}
                                                        {nextStatus === 'CONFIRMED' && <CheckCircle size={12} />}
                                                        {nextStatus === 'SHIPPED' && <Truck size={12} />}
                                                        {nextStatus === 'DELIVERED' && <CheckCircle size={12} />}

                                                        {/* Label */}
                                                        {statusOptions.find(s => s.value === nextStatus)?.label}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                <div className="py-4 border-t border-gray-200">
                    <div className="flex flex-col items-center justify-center gap-4">
                        {(() => {
                            if (totalPages <= 1) return null;

                            const uiCurrentPage = currentPage + 1; // Convert 0-indexed to 1-indexed for display
                            const windowSize = 1;
                            const startPage = Math.max(2, uiCurrentPage - windowSize);
                            const endPage = Math.min(totalPages - 1, uiCurrentPage + windowSize);
                            const showStartEllipsis = startPage > 2;
                            const showEndEllipsis = endPage < totalPages - 1;

                            return (
                                <>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
                                            disabled={currentPage === 0}
                                            className={`px-2 py-2 min-w-[40px] border rounded-md text-sm font-medium transition-colors flex items-center justify-center ${currentPage === 0
                                                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                                }`}
                                            aria-label="Previous page"
                                        >
                                            <ChevronLeft size={20} />
                                        </button>

                                        <button
                                            onClick={() => handlePageChange(0)}
                                            className={`px-3 py-2 min-w-[40px] border rounded-md text-sm font-medium transition-colors ${currentPage === 0
                                                ? "bg-green-500 text-white border-green-500"
                                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                                }`}
                                        >
                                            1
                                        </button>

                                        {showStartEllipsis && (
                                            <span className="px-2 text-gray-500">…</span>
                                        )}

                                        {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i)
                                            .map(page => (
                                                <button
                                                    key={page}
                                                    onClick={() => handlePageChange(page - 1)} // Convert 1-indexed page to 0-indexed
                                                    className={`px-3 py-2 min-w-[40px] border rounded-md text-sm font-medium transition-colors ${uiCurrentPage === page
                                                        ? "bg-green-500 text-white border-green-500"
                                                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                                        }`}
                                                >
                                                    {page}
                                                </button>
                                            ))}

                                        {showEndEllipsis && (
                                            <span className="px-2 text-gray-500">…</span>
                                        )}

                                        {totalPages > 1 && (
                                            <button
                                                onClick={() => handlePageChange(totalPages - 1)}
                                                className={`px-3 py-2 min-w-[40px] border rounded-md text-sm font-medium transition-colors ${currentPage === totalPages - 1
                                                    ? "bg-green-500 text-white border-green-500"
                                                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                                    }`}
                                            >
                                                {totalPages}
                                            </button>
                                        )}

                                        <button
                                            onClick={() => handlePageChange(Math.min(totalPages - 1, currentPage + 1))}
                                            disabled={currentPage >= totalPages - 1}
                                            className={`px-2 py-2 min-w-[40px] border rounded-md text-sm font-medium transition-colors flex items-center justify-center ${currentPage >= totalPages - 1
                                                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                                }`}
                                            aria-label="Next page"
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <span>Page</span>
                                        <form onSubmit={handlePageInputSubmit} className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                pattern="[0-9]*"
                                                value={pageInput}
                                                onChange={handlePageInputChange}
                                                onBlur={handlePageInputBlur}
                                                placeholder={uiCurrentPage.toString()}
                                                className="w-12 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 text-center text-sm"
                                                aria-label="Go to page"
                                            />
                                            <span>of {totalPages}</span>
                                            <button
                                                type="submit"
                                                className="px-3 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
                                                aria-label="Go to page"
                                            >
                                                Go
                                            </button>
                                        </form>
                                    </div>
                                </>
                            );
                        })()}
                    </div>
                </div>
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
