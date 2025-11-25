import React, { useState } from 'react';
import Dashboard from './Dashboard';
import UserManagement from './user/UserManagement';
import ProductManagement from './product/ProductManagement';
import CategoryManagement from './category/CategoryManagement';
import OrderManagement from './order/OrderManagement';
import RatingManagement from './rating/RatingManagement';
import ReviewManagement from './review/ReviewManagement';

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

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'users', label: 'Quản lý người dùng', icon: Users },
        { id: 'products', label: 'Quản lý sản phẩm', icon: Package },
        { id: 'categories', label: 'Quản lý danh mục', icon: FolderTree },
        { id: 'orders', label: 'Quản lý đơn hàng', icon: ShoppingCart },
        { id: 'ratings', label: 'Quản lý đánh giá', icon: Star },
        { id: 'reviews', label: 'Quản lý bình luận', icon: MessageSquare },
    ];

    return (
        <div className="flex h-screen bg-[#f5f5f5]">
            {/* Sidebar */}
            <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}>
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
                    {activeTab === 'dashboard' && <Dashboard />}
                    {activeTab === 'users' && <UserManagement />}
                    {activeTab === 'products' && <ProductManagement />}
                    {activeTab === 'categories' && <CategoryManagement />}
                    {activeTab === 'orders' && <OrderManagement />}
                    {activeTab === 'ratings' && <RatingManagement />}
                    {activeTab === 'reviews' && <ReviewManagement />}
                </div>
            </div>
        </div>
    );
};

// Dashboard Component
// const Dashboard = () => {
//     const stats = [
//         { label: 'Tổng người dùng', value: '7', icon: Users, color: 'bg-blue-100 text-blue-600' },
//         { label: 'Tổng sản phẩm', value: '20', icon: Package, color: 'bg-green-100 text-green-600' },
//         { label: 'Tổng đơn hàng', value: '0', icon: ShoppingCart, color: 'bg-purple-100 text-purple-600' },
//         { label: 'Tổng đánh giá', value: '20', icon: Star, color: 'bg-yellow-100 text-yellow-600' },
//     ];

//     return (
//         <div>
//             <h2 className="text-2xl font-semibold text-[#2d2d2d] mb-6">Dashboard</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                 {stats.map((stat, index) => {
//                     const Icon = stat.icon;
//                     return (
//                         <div key={index} className="bg-white rounded-lg p-6 border border-gray-200">
//                             <div className="flex items-center justify-between">
//                                 <div>
//                                     <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
//                                     <p className="text-3xl font-semibold text-[#2d2d2d]">{stat.value}</p>
//                                 </div>
//                                 <div className={`p-3 rounded-lg ${stat.color}`}>
//                                     <Icon size={24} />
//                                 </div>
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>
//         </div>
//     );
// };

// User Management Component
// const UserManagement = () => {
//     const [users, setUsers] = useState([
//         { id: 1, email: 'tranphuc120203@gmail.com', firstName: 'phuc', lastName: 't', createdAt: '2025-11-15' },
//         { id: 2, email: 'phuc.ttp.2356@aptechlearning.edu.vn', firstName: 'phuc', lastName: 'tran', createdAt: '2025-11-15' },
//         { id: 102, email: 't10@gmail.com', firstName: 'phuc', lastName: 'tran', createdAt: '2025-11-19' },
//     ]);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [showModal, setShowModal] = useState(false);
//     const [editingUser, setEditingUser] = useState(null);

//     const filteredUsers = users.filter(user =>
//         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     return (
//         <div>
//             <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-semibold text-[#2d2d2d]">Quản lý người dùng</h2>
//                 <button
//                     onClick={() => { setEditingUser(null); setShowModal(true); }}
//                     className="flex items-center gap-2 px-4 py-2 bg-[#2d2d2d] text-white rounded-lg hover:bg-[#1a1a1a] transition-colors"
//                 >
//                     <Plus size={20} />
//                     Thêm người dùng
//                 </button>
//             </div>

//             <div className="bg-white rounded-lg border border-gray-200">
//                 <div className="p-4 border-b border-gray-200">
//                     <div className="relative">
//                         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//                         <input
//                             type="text"
//                             placeholder="Tìm kiếm người dùng..."
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                             className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d2d2d]"
//                         />
//                     </div>
//                 </div>

//                 <div className="overflow-x-auto">
//                     <table className="w-full">
//                         <thead className="bg-gray-50 border-b border-gray-200">
//                             <tr>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Họ tên</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày tạo</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-200">
//                             {filteredUsers.map(user => (
//                                 <tr key={user.id} className="hover:bg-gray-50">
//                                     <td className="px-6 py-4 text-sm text-gray-900">{user.id}</td>
//                                     <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
//                                     <td className="px-6 py-4 text-sm text-gray-900">{user.firstName} {user.lastName}</td>
//                                     <td className="px-6 py-4 text-sm text-gray-900">{user.createdAt}</td>
//                                     <td className="px-6 py-4 text-sm">
//                                         <div className="flex gap-2">
//                                             <button
//                                                 onClick={() => { setEditingUser(user); setShowModal(true); }}
//                                                 className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                                             >
//                                                 <Edit size={16} />
//                                             </button>
//                                             <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
//                                                 <Trash2 size={16} />
//                                             </button>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>

//             {showModal && <UserModal user={editingUser} onClose={() => setShowModal(false)} />}
//         </div>
//     );
// };

// User Modal Component
// const UserModal = ({ user, onClose }) => {
//     const [formData, setFormData] = useState({
//         email: user?.email || '',
//         firstName: user?.firstName || '',
//         lastName: user?.lastName || '',
//         mobile: user?.mobile || '',
//         password: ''
//     });

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg p-6 w-full max-w-md">
//                 <h3 className="text-xl font-semibold text-[#2d2d2d] mb-4">
//                     {user ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
//                 </h3>

//                 <div className="space-y-4">
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//                         <input
//                             type="email"
//                             value={formData.email}
//                             onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d2d2d]"
//                         />
//                     </div>

//                     <div className="grid grid-cols-2 gap-4">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">Họ</label>
//                             <input
//                                 type="text"
//                                 value={formData.firstName}
//                                 onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d2d2d]"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">Tên</label>
//                             <input
//                                 type="text"
//                                 value={formData.lastName}
//                                 onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d2d2d]"
//                             />
//                         </div>
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
//                         <input
//                             type="text"
//                             value={formData.mobile}
//                             onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d2d2d]"
//                         />
//                     </div>

//                     {!user && (
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
//                             <input
//                                 type="password"
//                                 value={formData.password}
//                                 onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d2d2d]"
//                             />
//                         </div>
//                     )}
//                 </div>

//                 <div className="flex gap-3 mt-6">
//                     <button
//                         onClick={onClose}
//                         className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//                     >
//                         Hủy
//                     </button>
//                     <button
//                         className="flex-1 px-4 py-2 bg-[#2d2d2d] text-white rounded-lg hover:bg-[#1a1a1a] transition-colors"
//                     >
//                         {user ? 'Cập nhật' : 'Thêm mới'}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// Product Management Component
// const ProductManagement = () => {
//     const [products, setProducts] = useState([
//         { id: 1, productName: 'iPhone 15 Pro', brand: 'Apple', price: 1200, quantity: 50, categoryId: 1 },
//         { id: 2, productName: 'Samsung Galaxy S23', brand: 'Samsung', price: 900, quantity: 60, categoryId: 1 },
//         { id: 3, productName: 'Sony WH‑1000XM5 Headphones', brand: 'Sony', price: 500, quantity: 40, categoryId: 1 },
//     ]);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [showModal, setShowModal] = useState(false);
//     const [editingProduct, setEditingProduct] = useState(null);
//     const [filterBrand, setFilterBrand] = useState('all');

//     const brands = [...new Set(products.map(p => p.brand))];

//     const filteredProducts = products.filter(product => {
//         const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             product.brand.toLowerCase().includes(searchTerm.toLowerCase());
//         const matchesBrand = filterBrand === 'all' || product.brand === filterBrand;
//         return matchesSearch && matchesBrand;
//     });

//     return (
//         <div>
//             <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-semibold text-[#2d2d2d]">Quản lý sản phẩm</h2>
//                 <button
//                     onClick={() => { setEditingProduct(null); setShowModal(true); }}
//                     className="flex items-center gap-2 px-4 py-2 bg-[#2d2d2d] text-white rounded-lg hover:bg-[#1a1a1a] transition-colors"
//                 >
//                     <Plus size={20} />
//                     Thêm sản phẩm
//                 </button>
//             </div>

//             <div className="bg-white rounded-lg border border-gray-200">
//                 <div className="p-4 border-b border-gray-200">
//                     <div className="flex gap-4">
//                         <div className="relative flex-1">
//                             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//                             <input
//                                 type="text"
//                                 placeholder="Tìm kiếm sản phẩm..."
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d2d2d]"
//                             />
//                         </div>
//                         <select
//                             value={filterBrand}
//                             onChange={(e) => setFilterBrand(e.target.value)}
//                             className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d2d2d]"
//                         >
//                             <option value="all">Tất cả thương hiệu</option>
//                             {brands.map(brand => (
//                                 <option key={brand} value={brand}>{brand}</option>
//                             ))}
//                         </select>
//                     </div>
//                 </div>

//                 <div className="overflow-x-auto">
//                     <table className="w-full">
//                         <thead className="bg-gray-50 border-b border-gray-200">
//                             <tr>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên sản phẩm</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thương hiệu</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số lượng</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-200">
//                             {filteredProducts.map(product => (
//                                 <tr key={product.id} className="hover:bg-gray-50">
//                                     <td className="px-6 py-4 text-sm text-gray-900">{product.id}</td>
//                                     <td className="px-6 py-4 text-sm text-gray-900">{product.productName}</td>
//                                     <td className="px-6 py-4 text-sm text-gray-900">{product.brand}</td>
//                                     <td className="px-6 py-4 text-sm text-gray-900">${product.price}</td>
//                                     <td className="px-6 py-4 text-sm">
//                                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.quantity > 20 ? 'bg-green-100 text-green-800' :
//                                             product.quantity > 0 ? 'bg-yellow-100 text-yellow-800' :
//                                                 'bg-red-100 text-red-800'
//                                             }`}>
//                                             {product.quantity}
//                                         </span>
//                                     </td>
//                                     <td className="px-6 py-4 text-sm">
//                                         <div className="flex gap-2">
//                                             <button
//                                                 onClick={() => { setEditingProduct(product); setShowModal(true); }}
//                                                 className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                                             >
//                                                 <Edit size={16} />
//                                             </button>
//                                             <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
//                                                 <Trash2 size={16} />
//                                             </button>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>

//             {showModal && <ProductModal product={editingProduct} onClose={() => setShowModal(false)} />}
//         </div>
//     );
// };

// Product Modal Component
// const ProductModal = ({ product, onClose }) => {
//     const [formData, setFormData] = useState({
//         productName: product?.productName || '',
//         brand: product?.brand || '',
//         price: product?.price || '',
//         quantity: product?.quantity || '',
//         categoryId: product?.categoryId || 1,
//         imageUrl: ''
//     });

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//                 <h3 className="text-xl font-semibold text-[#2d2d2d] mb-4">
//                     {product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
//                 </h3>

//                 <div className="space-y-4">
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm</label>
//                         <input
//                             type="text"
//                             value={formData.productName}
//                             onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d2d2d]"
//                         />
//                     </div>

//                     <div className="grid grid-cols-2 gap-4">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">Thương hiệu</label>
//                             <input
//                                 type="text"
//                                 value={formData.brand}
//                                 onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d2d2d]"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
//                             <select
//                                 value={formData.categoryId}
//                                 onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d2d2d]"
//                             >
//                                 <option value={1}>Đồ điện tử</option>
//                             </select>
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-2 gap-4">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">Giá</label>
//                             <input
//                                 type="number"
//                                 value={formData.price}
//                                 onChange={(e) => setFormData({ ...formData, price: e.target.value })}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d2d2d]"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng</label>
//                             <input
//                                 type="number"
//                                 value={formData.quantity}
//                                 onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d2d2d]"
//                             />
//                         </div>
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">URL Hình ảnh</label>
//                         <input
//                             type="text"
//                             value={formData.imageUrl}
//                             onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
//                             placeholder="https://example.com/image.jpg"
//                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d2d2d]"
//                         />
//                     </div>
//                 </div>

//                 <div className="flex gap-3 mt-6">
//                     <button
//                         onClick={onClose}
//                         className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//                     >
//                         Hủy
//                     </button>
//                     <button
//                         className="flex-1 px-4 py-2 bg-[#2d2d2d] text-white rounded-lg hover:bg-[#1a1a1a] transition-colors"
//                     >
//                         {product ? 'Cập nhật' : 'Thêm mới'}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// Category Management Component
// const CategoryManagement = () => {
//     const [categories, setCategories] = useState([
//         { id: 1, categoryName: 'Đồ điện tử', level: 1, parentCategoryId: null },
//     ]);
//     const [showModal, setShowModal] = useState(false);
//     const [editingCategory, setEditingCategory] = useState(null);

//     return (
//         <div>
//             <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-semibold text-[#2d2d2d]">Quản lý danh mục</h2>
//                 <button
//                     onClick={() => { setEditingCategory(null); setShowModal(true); }}
//                     className="flex items-center gap-2 px-4 py-2 bg-[#2d2d2d] text-white rounded-lg hover:bg-[#1a1a1a] transition-colors"
//                 >
//                     <Plus size={20} />
//                     Thêm danh mục
//                 </button>
//             </div>

//             <div className="bg-white rounded-lg border border-gray-200">
//                 <div className="overflow-x-auto">
//                     <table className="w-full">
//                         <thead className="bg-gray-50 border-b border-gray-200">
//                             <tr>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên danh mục</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cấp độ</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Danh mục cha</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-200">
//                             {categories.map(category => (
//                                 <tr key={category.id} className="hover:bg-gray-50">
//                                     <td className="px-6 py-4 text-sm text-gray-900">{category.id}</td>
//                                     <td className="px-6 py-4 text-sm text-gray-900">{category.categoryName}</td>
//                                     <td className="px-6 py-4 text-sm text-gray-900">{category.level}</td>
//                                     <td className="px-6 py-4 text-sm text-gray-900">
//                                         {category.parentCategoryId || '-'}
//                                     </td>
//                                     <td className="px-6 py-4 text-sm">
//                                         <div className="flex gap-2">
//                                             <button
//                                                 onClick={() => { setEditingCategory(category); setShowModal(true); }}
//                                                 className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                                             >
//                                                 <Edit size={16} />
//                                             </button>
//                                             <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
//                                                 <Trash2 size={16} />
//                                             </button>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>

//             {showModal && <CategoryModal category={editingCategory} onClose={() => setShowModal(false)} categories={categories} />}
//         </div>
//     );
// };

// Category Modal Component
// const CategoryModal = ({ category, onClose, categories }) => {
//     const [formData, setFormData] = useState({
//         categoryName: category?.categoryName || '',
//         level: category?.level || 1,
//         parentCategoryId: category?.parentCategoryId || ''
//     });

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg p-6 w-full max-w-md">
//                 <h3 className="text-xl font-semibold text-[#2d2d2d] mb-4">
//                     {category ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
//                 </h3>

//                 <div className="space-y-4">
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Tên danh mục</label>
//                         <input
//                             type="text"
//                             value={formData.categoryName}
//                             onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d2d2d]"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Cấp độ</label>
//                         <input
//                             type="number"
//                             value={formData.level}
//                             onChange={(e) => setFormData({ ...formData, level: e.target.value })}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d2d2d]"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục cha</label>
//                         <select
//                             value={formData.parentCategoryId}
//                             onChange={(e) => setFormData({ ...formData, parentCategoryId: e.target.value })}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d2d2d]"
//                         >
//                             <option value="">Không có</option>
//                             {categories.map(cat => (
//                                 <option key={cat.id} value={cat.id}>{cat.categoryName}</option>
//                             ))}
//                         </select>
//                     </div>
//                 </div>

//                 <div className="flex gap-3 mt-6">
//                     <button
//                         onClick={onClose}
//                         className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//                     >
//                         Hủy
//                     </button>
//                     <button
//                         className="flex-1 px-4 py-2 bg-[#2d2d2d] text-white rounded-lg hover:bg-[#1a1a1a] transition-colors"
//                     >
//                         {category ? 'Cập nhật' : 'Thêm mới'}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// Order Management Component
// const OrderManagement = () => {
//     const [orders, setOrders] = useState([
//         // Sample data - trong thực tế sẽ không có dữ liệu vì database trống
//     ]);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [filterStatus, setFilterStatus] = useState('all');
//     const [selectedOrder, setSelectedOrder] = useState(null);

//     const statusOptions = [
//         { value: 'all', label: 'Tất cả' },
//         { value: 'PENDING', label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800' },
//         { value: 'CONFIRMED', label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800' },
//         { value: 'SHIPPED', label: 'Đang giao', color: 'bg-purple-100 text-purple-800' },
//         { value: 'DELIVERED', label: 'Đã giao', color: 'bg-green-100 text-green-800' },
//         { value: 'CANCELLED', label: 'Đã hủy', color: 'bg-red-100 text-red-800' }
//     ];

//     const filteredOrders = orders.filter(order => {
//         const matchesSearch = order.orderId?.toLowerCase().includes(searchTerm.toLowerCase());
//         const matchesStatus = filterStatus === 'all' || order.orderStatus === filterStatus;
//         return matchesSearch && matchesStatus;
//     });

//     return (
//         <div>
//             <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-semibold text-[#2d2d2d]">Quản lý đơn hàng</h2>
//             </div>

//             <div className="bg-white rounded-lg border border-gray-200">
//                 <div className="p-4 border-b border-gray-200">
//                     <div className="flex gap-4">
//                         <div className="relative flex-1">
//                             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//                             <input
//                                 type="text"
//                                 placeholder="Tìm kiếm theo mã đơn hàng..."
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d2d2d]"
//                             />
//                         </div>
//                         <select
//                             value={filterStatus}
//                             onChange={(e) => setFilterStatus(e.target.value)}
//                             className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d2d2d]"
//                         >
//                             {statusOptions.map(opt => (
//                                 <option key={opt.value} value={opt.value}>{opt.label}</option>
//                             ))}
//                         </select>
//                     </div>
//                 </div>

//                 <div className="overflow-x-auto">
//                     {orders.length === 0 ? (
//                         <div className="p-8 text-center text-gray-500">
//                             <ShoppingCart size={48} className="mx-auto mb-2 text-gray-300" />
//                             <p>Chưa có đơn hàng nào</p>
//                         </div>
//                     ) : (
//                         <table className="w-full">
//                             <thead className="bg-gray-50 border-b border-gray-200">
//                                 <tr>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã đơn</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày đặt</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Khách hàng</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tổng tiền</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="divide-y divide-gray-200">
//                                 {filteredOrders.map(order => {
//                                     const status = statusOptions.find(s => s.value === order.orderStatus);
//                                     return (
//                                         <tr key={order.id} className="hover:bg-gray-50">
//                                             <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.orderId}</td>
//                                             <td className="px-6 py-4 text-sm text-gray-900">
//                                                 {new Date(order.orderDate).toLocaleDateString('vi-VN')}
//                                             </td>
//                                             <td className="px-6 py-4 text-sm text-gray-900">User #{order.userId}</td>
//                                             <td className="px-6 py-4 text-sm text-gray-900">${order.totalPrice}</td>
//                                             <td className="px-6 py-4 text-sm">
//                                                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${status?.color}`}>
//                                                     {status?.label}
//                                                 </span>
//                                             </td>
//                                             <td className="px-6 py-4 text-sm">
//                                                 <button
//                                                     onClick={() => setSelectedOrder(order)}
//                                                     className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                                                 >
//                                                     <Edit size={16} />
//                                                 </button>
//                                             </td>
//                                         </tr>
//                                     );
//                                 })}
//                             </tbody>
//                         </table>
//                     )}
//                 </div>
//             </div>

//             {selectedOrder && <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} statusOptions={statusOptions} />}
//         </div>
//     );
// };

// Order Detail Modal
// const OrderDetailModal = ({ order, onClose, statusOptions }) => {
//     const [orderStatus, setOrderStatus] = useState(order.orderStatus);

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//                 <h3 className="text-xl font-semibold text-[#2d2d2d] mb-4">
//                     Chi tiết đơn hàng: {order.orderId}
//                 </h3>

//                 <div className="space-y-4">
//                     <div className="grid grid-cols-2 gap-4">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">Ngày đặt</label>
//                             <p className="text-sm text-gray-900">
//                                 {new Date(order.orderDate).toLocaleString('vi-VN')}
//                             </p>
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">Tổng tiền</label>
//                             <p className="text-sm text-gray-900 font-semibold">${order.totalPrice}</p>
//                         </div>
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái đơn hàng</label>
//                         <select
//                             value={orderStatus}
//                             onChange={(e) => setOrderStatus(e.target.value)}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d2d2d]"
//                         >
//                             {statusOptions.filter(s => s.value !== 'all').map(opt => (
//                                 <option key={opt.value} value={opt.value}>{opt.label}</option>
//                             ))}
//                         </select>
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">Thông tin giao hàng</label>
//                         <div className="p-4 bg-gray-50 rounded-lg">
//                             <p className="text-sm text-gray-900">Địa chỉ giao hàng sẽ hiển thị ở đây</p>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="flex gap-3 mt-6">
//                     <button
//                         onClick={onClose}
//                         className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//                     >
//                         Đóng
//                     </button>
//                     <button
//                         className="flex-1 px-4 py-2 bg-[#2d2d2d] text-white rounded-lg hover:bg-[#1a1a1a] transition-colors"
//                     >
//                         Cập nhật trạng thái
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// Rating Management Component
// const RatingManagement = () => {
//     const [ratings, setRatings] = useState([
//         { id: 1, rating: 5, productId: 1, productName: 'iPhone 15 Pro', userId: 1, userName: 'phuc t', createdAt: '2025-11-15 15:36:37' },
//         { id: 2, rating: 4.9, productId: 2, productName: 'Samsung Galaxy S23', userId: 1, userName: 'phuc t', createdAt: '2025-11-15 15:36:37' },
//         { id: 3, rating: 4.8, productId: 3, productName: 'Sony WH‑1000XM5 Headphones', userId: 1, userName: 'phuc t', createdAt: '2025-11-15 15:36:37' },
//     ]);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [filterRating, setFilterRating] = useState('all');

//     const filteredRatings = ratings.filter(rating => {
//         const matchesSearch = rating.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             rating.userName.toLowerCase().includes(searchTerm.toLowerCase());
//         const matchesRating = filterRating === 'all' ||
//             (filterRating === '5' && rating.rating === 5) ||
//             (filterRating === '4+' && rating.rating >= 4 && rating.rating < 5) ||
//             (filterRating === '3+' && rating.rating >= 3 && rating.rating < 4) ||
//             (filterRating === 'low' && rating.rating < 3);
//         return matchesSearch && matchesRating;
//     });

//     const getRatingColor = (rating) => {
//         if (rating >= 4.5) return 'text-green-600';
//         if (rating >= 3.5) return 'text-yellow-600';
//         return 'text-red-600';
//     };

//     return (
//         <div>
//             <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-semibold text-[#2d2d2d]">Quản lý đánh giá</h2>
//             </div>

//             <div className="bg-white rounded-lg border border-gray-200">
//                 <div className="p-4 border-b border-gray-200">
//                     <div className="flex gap-4">
//                         <div className="relative flex-1">
//                             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//                             <input
//                                 type="text"
//                                 placeholder="Tìm kiếm theo sản phẩm hoặc người dùng..."
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d2d2d]"
//                             />
//                         </div>
//                         <select
//                             value={filterRating}
//                             onChange={(e) => setFilterRating(e.target.value)}
//                             className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d2d2d]"
//                         >
//                             <option value="all">Tất cả đánh giá</option>
//                             <option value="5">5 sao</option>
//                             <option value="4+">4+ sao</option>
//                             <option value="3+">3+ sao</option>
//                             <option value="low">Dưới 3 sao</option>
//                         </select>
//                     </div>
//                 </div>

//                 <div className="overflow-x-auto">
//                     <table className="w-full">
//                         <thead className="bg-gray-50 border-b border-gray-200">
//                             <tr>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sản phẩm</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Người dùng</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Đánh giá</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày tạo</th>
//                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-200">
//                             {filteredRatings.map(rating => (
//                                 <tr key={rating.id} className="hover:bg-gray-50">
//                                     <td className="px-6 py-4 text-sm text-gray-900">{rating.id}</td>
//                                     <td className="px-6 py-4 text-sm text-gray-900">{rating.productName}</td>
//                                     <td className="px-6 py-4 text-sm text-gray-900">{rating.userName}</td>
//                                     <td className="px-6 py-4 text-sm">
//                                         <div className="flex items-center gap-1">
//                                             <Star size={16} className={`${getRatingColor(rating.rating)} fill-current`} />
//                                             <span className={`font-semibold ${getRatingColor(rating.rating)}`}>
//                                                 {rating.rating}
//                                             </span>
//                                         </div>
//                                     </td>
//                                     <td className="px-6 py-4 text-sm text-gray-900">
//                                         {new Date(rating.createdAt).toLocaleDateString('vi-VN')}
//                                     </td>
//                                     <td className="px-6 py-4 text-sm">
//                                         <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
//                                             <Trash2 size={16} />
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// };

// Review Management Component
// const ReviewManagement = () => {
//     const [reviews, setReviews] = useState([
//         { id: 1, review: 'Review sản phẩm 1 của user 1', productId: 1, productName: 'iPhone 15 Pro', userId: 1, userName: 'phuc t', createdAt: '2025-11-15 15:36:37' },
//         { id: 2, review: 'Review sản phẩm 2 của user 1', productId: 2, productName: 'Samsung Galaxy S23', userId: 1, userName: 'phuc t', createdAt: '2025-11-15 15:36:37' },
//         { id: 3, review: 'Review sản phẩm 3 của user 1', productId: 3, productName: 'Sony WH‑1000XM5 Headphones', userId: 1, userName: 'phuc t', createdAt: '2025-11-15 15:36:37' },
//     ]);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [selectedReview, setSelectedReview] = useState(null);

//     const filteredReviews = reviews.filter(review =>
//         review.review.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         review.userName.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     return (
//         <div>
//             <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-semibold text-[#2d2d2d]">Quản lý bình luận</h2>
//             </div>

//             <div className="bg-white rounded-lg border border-gray-200">
//                 <div className="p-4 border-b border-gray-200">
//                     <div className="relative">
//                         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//                         <input
//                             type="text"
//                             placeholder="Tìm kiếm bình luận..."
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                             className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d2d2d]"
//                         />
//                     </div>
//                 </div>

//                 <div className="divide-y divide-gray-200">
//                     {filteredReviews.map(review => (
//                         <div key={review.id} className="p-6 hover:bg-gray-50">
//                             <div className="flex justify-between items-start mb-2">
//                                 <div className="flex-1">
//                                     <div className="flex items-center gap-2 mb-1">
//                                         <span className="font-medium text-gray-900">{review.userName}</span>
//                                         <span className="text-xs text-gray-500">•</span>
//                                         <span className="text-xs text-gray-500">
//                                             {new Date(review.createdAt).toLocaleDateString('vi-VN')}
//                                         </span>
//                                     </div>
//                                     <p className="text-sm text-gray-600 mb-2">{review.productName}</p>
//                                     <p className="text-sm text-gray-900">{review.review}</p>
//                                 </div>
//                                 <div className="flex gap-2 ml-4">
//                                     <button
//                                         onClick={() => setSelectedReview(review)}
//                                         className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                                     >
//                                         <Edit size={16} />
//                                     </button>
//                                     <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
//                                         <Trash2 size={16} />
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             {selectedReview && <ReviewModal review={selectedReview} onClose={() => setSelectedReview(null)} />}
//         </div>
//     );
// };

// Review Modal Component
// const ReviewModal = ({ review, onClose }) => {
//     const [reviewText, setReviewText] = useState(review.review);

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
//                 <h3 className="text-xl font-semibold text-[#2d2d2d] mb-4">
//                     Chỉnh sửa bình luận
//                 </h3>

//                 <div className="space-y-4">
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Sản phẩm</label>
//                         <p className="text-sm text-gray-900">{review.productName}</p>
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Người dùng</label>
//                         <p className="text-sm text-gray-900">{review.userName}</p>
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung bình luận</label>
//                         <textarea
//                             value={reviewText}
//                             onChange={(e) => setReviewText(e.target.value)}
//                             rows={4}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d2d2d]"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Ngày tạo</label>
//                         <p className="text-sm text-gray-900">
//                             {new Date(review.createdAt).toLocaleString('vi-VN')}
//                         </p>
//                     </div>
//                 </div>

//                 <div className="flex gap-3 mt-6">
//                     <button
//                         onClick={onClose}
//                         className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//                     >
//                         Hủy
//                     </button>
//                     <button
//                         className="flex-1 px-4 py-2 bg-[#2d2d2d] text-white rounded-lg hover:bg-[#1a1a1a] transition-colors"
//                     >
//                         Cập nhật
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

export default AdminContent;