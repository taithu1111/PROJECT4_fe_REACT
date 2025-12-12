import React, { useState } from 'react';
import Dashboard from './Dashboard';
import UserManagement from './user/UserManagement';
import ProductManagement from './product/ProductManagement';
import CategoryManagement from './category/CategoryManagement';
import OrderManagement from './order/OrderManagement';
import RatingManagement from './rating/RatingManagement';
import ReviewManagement from './review/ReviewManagement';
import PaymentManagement from './payment/PaymentManagement';
import './styles/adminContent.css';
import {
    LayoutDashboard,
    Users,
    Package,
    ShoppingCart,
    Star,
    MessageSquare,
    FolderTree,
    Image,
    Menu,
    X,
    CreditCard,
    Plus,
    Edit,
    Trash2,
    Search,
    ChevronDown,
    ChevronUp
} from 'lucide-react';

// Main Admin Content Component
const AdminContent = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [openCreateProduct, setOpenCreateProduct] = useState(false);
    const [openCreateCategory, setOpenCreateCategory] = useState(false);
    const handleResetCreateFlag = () => {
        setOpenCreateCategory(false);
    };
    const handleResetProductFlag = () => {
        setOpenCreateProduct(false);
    };

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'users', label: 'Quản lý người dùng', icon: Users },
        { id: 'products', label: 'Quản lý sản phẩm', icon: Package },
        { id: 'categories', label: 'Quản lý danh mục', icon: FolderTree },
        { id: 'orders', label: 'Quản lý đơn hàng', icon: ShoppingCart },
        { id: 'payment', label: 'Thanh toán', icon: CreditCard },
        { id: 'ratings', label: 'Quản lý đánh giá', icon: Star },
        { id: 'reviews', label: 'Quản lý bình luận', icon: MessageSquare },
    ];

    return (
        <div className='admin-content'>
            <div className="flex h-screen bg-white">
                {/* Sidebar */}
                <div className={`sidebar-container ${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}>
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                        {isSidebarOpen && <h1 className="text-xl font-semibold text-[#2d2d2d]">Admin Panel</h1>}
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>

                    <nav className="flex-1 p-2 overflow-y-auto">
                        {menuItems.map(item => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-3 mb-1 rounded-lg transition-colors ${activeTab === item.id
                                        ? 'bg-[#f0ebe5] text-[#2d2d2d]'
                                        : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    <Icon size={20} />
                                    {isSidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-auto">
                    <div className="p-6">
                        {activeTab === 'dashboard' && (
                            <Dashboard
                                onAddProduct={() => {
                                    setActiveTab('products');
                                    setOpenCreateProduct(true);
                                }}
                                onShowOrders={() => setActiveTab('orders')}
                                onAddCategory={() => {
                                    setActiveTab('categories');
                                    setOpenCreateCategory(true);
                                }}
                            />
                        )}
                        {activeTab === 'users' && <UserManagement />}
                        {activeTab === 'products' && <ProductManagement openCreateProduct={openCreateProduct} onResetCreateFlag={handleResetProductFlag} />}
                        {activeTab === 'categories' && <CategoryManagement openCreateCategory={openCreateCategory} onResetCreateFlag={handleResetCreateFlag} />}
                        {activeTab === 'orders' && <OrderManagement />}
                        {activeTab === 'ratings' && <RatingManagement />}
                        {activeTab === 'payment' && <PaymentManagement />}
                        {activeTab === 'reviews' && <ReviewManagement />}
                    </div>
                </div>
            </div>
        </div>

    );
};
export default AdminContent;