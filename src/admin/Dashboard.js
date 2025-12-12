// src/admin/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Users, Package, ShoppingCart, Star, TrendingUp, AlertCircle, FolderTree, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import AdminStatisticsService from './api/AdminStatisticsService';
import AdminOrderService from './api/AdminOrderService';

const Dashboard = ({ onAddProduct, onShowOrders, onAddCategory }) => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalRatings: 0
    });
    const [paidOrders, setPaidOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [error, setError] = useState(null);

    // Pagination for paid orders
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize] = useState(5);

    useEffect(() => {
        fetchDashboardStats();
        fetchPaidOrders();
    }, [currentPage]);

    const fetchDashboardStats = async () => {
        try {
            setLoading(true);
            const data = await AdminStatisticsService.getDashboardStats();
            setStats(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching dashboard stats:', err);
            setError('Không thể tải thống kê');
        } finally {
            setLoading(false);
        }
    };

    const fetchPaidOrders = async () => {
        try {
            setOrdersLoading(true);
            const data = await AdminOrderService.getPaidOrders(currentPage, pageSize, 'deliveryDate');
            setPaidOrders(data.content || []);
            setTotalPages(data.totalPages || 0);
        } catch (err) {
            console.error('Error fetching paid orders:', err);
        } finally {
            setOrdersLoading(false);
        }
    };

    const statsCards = [
        { label: 'Tổng người dùng', value: stats.totalUsers || '0', icon: Users, color: 'bg-blue-100 text-blue-600' },
        { label: 'Tổng sản phẩm', value: stats.totalProducts || '0', icon: Package, color: 'bg-green-100 text-green-600' },
        { label: 'Tổng đơn hàng', value: stats.totalOrders || '0', icon: ShoppingCart, color: 'bg-purple-100 text-purple-600' },
        { label: 'Tổng đánh giá', value: stats.totalRatings || '0', icon: Star, color: 'bg-yellow-100 text-yellow-600' },
    ];

    const getStatusBadge = (status) => {
        const statusConfig = {
            'PAID': { label: 'Đã thanh toán', color: 'bg-green-100 text-green-800' },
            'DELIVERED': { label: 'Đã giao', color: 'bg-blue-100 text-blue-800' },
            'SHIPPED': { label: 'Đang giao', color: 'bg-purple-100 text-purple-800' },
        };
        const config = statusConfig[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                {config.label}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Đang tải dữ liệu...</div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-semibold text-[#2d2d2d]">Dashboard</h2>
                <p className="text-sm text-gray-600 mt-1">Tổng quan hệ thống E-commerce</p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                    <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                        <h4 className="font-medium text-red-800 mb-1">Lỗi</h4>
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {statsCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-lg ${stat.color}`}>
                                    <Icon size={24} />
                                </div>
                                {stat.trend && (
                                    <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                                        <TrendingUp size={14} />
                                        {stat.trend}
                                    </span>
                                )}
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                                <p className="text-3xl font-semibold text-[#2d2d2d]">{stat.value}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Alert - Empty Database */}
            {stats.totalUsers === 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                    <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                        <h4 className="font-medium text-yellow-800 mb-1">Database đang trống</h4>
                        <p className="text-sm text-yellow-700">
                            Hệ thống chưa có dữ liệu. Hãy bắt đầu bằng cách thêm danh mục, sản phẩm và người dùng.
                        </p>
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <h3 className="text-lg font-semibold text-[#2d2d2d] mb-4">Thao tác nhanh</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button onClick={onAddCategory} className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <FolderTree size={20} />
                        </div>
                        <div className="text-left">
                            <p className="font-medium text-gray-900">Thêm danh mục</p>
                            <p className="text-xs text-gray-500">Tạo danh mục mới</p>
                        </div>
                    </button>

                    <button onClick={onAddProduct} className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                            <Package size={20} />
                        </div>
                        <div className="text-left">
                            <p className="font-medium text-gray-900">Thêm sản phẩm</p>
                            <p className="text-xs text-gray-500">Tạo sản phẩm mới</p>
                        </div>
                    </button>

                    <button onClick={onShowOrders} className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                            <ShoppingCart size={20} />
                        </div>
                        <div className="text-left">
                            <p className="font-medium text-gray-900">Xem đơn hàng</p>
                            <p className="text-xs text-gray-500">Quản lý đơn hàng</p>
                        </div>
                    </button>
                </div>
            </div>

            {/* Paid Orders List */}
            <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-semibold text-[#2d2d2d]">Đơn hàng đã thanh toán</h3>
                            <p className="text-sm text-gray-500 mt-1">Danh sách các đơn hàng đã hoàn thành thanh toán</p>
                        </div>
                        {paidOrders.length > 0 && (
                            <div className="text-sm text-gray-600">
                                Tổng: <span className="font-semibold">{paidOrders.length}</span> đơn hàng
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-6">
                    {ordersLoading ? (
                        <div className="text-center py-8 text-gray-500">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                            <p className="text-sm mt-2">Đang tải...</p>
                        </div>
                    ) : paidOrders.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <ShoppingCart size={48} className="mx-auto mb-2 text-gray-300" />
                            <p className="text-sm">Chưa có đơn hàng nào được thanh toán</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã đơn</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Khách hàng</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày đặt</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày giao</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tổng tiền</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {paidOrders.map(order => (
                                            <tr key={order.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                    {order.orderId}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900">
                                                    <div>
                                                        <p className="font-medium">{order.userEmail || `User #${order.userId}`}</p>
                                                        {order.shippingAddress && (
                                                            <p className="text-xs text-gray-500">{order.shippingAddress.city}</p>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-600">
                                                    {order.orderDate ? new Date(order.orderDate).toLocaleDateString('vi-VN') : '-'}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-600">
                                                    {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString('vi-VN') : '-'}
                                                </td>
                                                <td className="px-4 py-3 text-sm">
                                                    <span className="font-semibold text-green-600">
                                                        ${order.totalPrice?.toFixed(2) || '0.00'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm">
                                                    {getStatusBadge(order.orderStatus)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                                        disabled={currentPage === 0}
                                        className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeft size={16} />
                                        Trước
                                    </button>
                                    <span className="text-sm text-gray-600">
                                        Trang {currentPage + 1} / {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                                        disabled={currentPage >= totalPages - 1}
                                        className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Sau
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;