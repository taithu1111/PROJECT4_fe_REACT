import React from 'react';
import { Users, Package, ShoppingCart, Star } from 'lucide-react';

const Dashboard = () => {
    const stats = [
        { label: 'Tổng người dùng', value: '7', icon: Users, color: 'bg-blue-100 text-blue-600' },
        { label: 'Tổng sản phẩm', value: '20', icon: Package, color: 'bg-green-100 text-green-600' },
        { label: 'Tổng đơn hàng', value: '0', icon: ShoppingCart, color: 'bg-purple-100 text-purple-600' },
        { label: 'Tổng đánh giá', value: '20', icon: Star, color: 'bg-yellow-100 text-yellow-600' },
    ];

    return (
        <div>
            <h2 className="text-2xl font-semibold text-[#2d2d2d] mb-6">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-white rounded-lg p-6 border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                                    <p className="text-3xl font-semibold text-[#2d2d2d]">{stat.value}</p>
                                </div>
                                <div className={`p-3 rounded-lg ${stat.color}`}>
                                    <Icon size={24} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Dashboard;