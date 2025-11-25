// src/admin/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Users, Package, ShoppingCart, Star, TrendingUp, AlertCircle } from 'lucide-react';
import AdminStatisticsService from './api/AdminStatisticsService';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalRatings: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

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

    const statsCards = [
        { label: 'Tổng người dùng', value: stats.totalUsers || '0', icon: Users, color: 'bg-blue-100 text-blue-600', trend: '+0%' },
        { label: 'Tổng sản phẩm', value: stats.totalProducts || '0', icon: Package, color: 'bg-green-100 text-green-600', trend: '+0%' },
        { label: 'Tổng đơn hàng', value: stats.totalOrders || '0', icon: ShoppingCart, color: 'bg-purple-100 text-purple-600', trend: '+0%' },
        { label: 'Tổng đánh giá', value: stats.totalRatings || '0', icon: Star, color: 'bg-yellow-100 text-yellow-600', trend: '+0%' },
    ];

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
                                <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                                    <TrendingUp size={14} />
                                    {stat.trend}
                                </span>
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
                    <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <Users size={20} />
                        </div>
                        <div className="text-left">
                            <p className="font-medium text-gray-900">Thêm người dùng</p>
                            <p className="text-xs text-gray-500">Tạo tài khoản mới</p>
                        </div>
                    </button>

                    <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                            <Package size={20} />
                        </div>
                        <div className="text-left">
                            <p className="font-medium text-gray-900">Thêm sản phẩm</p>
                            <p className="text-xs text-gray-500">Tạo sản phẩm mới</p>
                        </div>
                    </button>

                    <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
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

            {/* Recent Activities */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-[#2d2d2d] mb-4">Hoạt động gần đây</h3>
                <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">Chưa có hoạt động nào</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;