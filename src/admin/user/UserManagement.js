// src/admin/user/UserManagement.js
import React, { useState, useEffect } from 'react';
import { Plus, Search, CheckCircle, XCircle, RefreshCw, LockIcon } from 'lucide-react';
import UserModal from './UserModal';
import AdminUserService from '../api/AdminUserService';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize] = useState(10);

    useEffect(() => {
        fetchUsers();
    }, [currentPage]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await AdminUserService.getAllUsers(currentPage, pageSize, 'id');
            setUsers(data.content || []);
            setTotalPages(data.totalPages || 0);
            setError(null);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Không thể tải danh sách người dùng');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (userId) => {
        try {
            const updatedUser = await AdminUserService.toggleUserStatus(userId);
            setUsers(users.map(user =>
                user.id === userId ? updatedUser : user
            ));
        } catch (err) {
            console.error('Error toggling user status:', err);
            alert('Không thể thay đổi trạng thái người dùng là ADMIN');
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' ||
            (filterStatus === 'active' && user.active) ||
            (filterStatus === 'inactive' && !user.active);
        return matchesSearch && matchesStatus;
    });

    if (loading && users.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <RefreshCw className="animate-spin text-gray-400" size={32} />
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-[#2d2d2d]">Quản lý người dùng</h2>
                <button
                    onClick={() => { setEditingUser(null); setShowModal(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-[#2d2d2d] text-white rounded-lg hover:bg-[#1a1a1a] transition-colors"
                >
                    <Plus size={20} />
                    Thêm người dùng
                </button>
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
                                placeholder="Tìm kiếm người dùng..."
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
                            <option value="all">Tất cả</option>
                            <option value="active">Đang hoạt động</option>
                            <option value="inactive">Đã vô hiệu hóa</option>
                        </select>
                        <button
                            onClick={fetchUsers}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            <RefreshCw size={20} />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Họ tên</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vai trò</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày tạo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredUsers.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-900">{user.id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{user.firstName} {user.lastName}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                            }`}>
                                            {user.role || 'USER'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <button
                                            onClick={() => handleToggleStatus(user.id)}
                                            className="flex items-center gap-1"
                                        >
                                            {user.active ? (
                                                <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                                    <CheckCircle size={14} />
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                                                    <XCircle size={14} />
                                                    Inactive
                                                </span>
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <div className="flex gap-2">
                                            {/* <button
                                                onClick={() => { setEditingUser(user); setShowModal(true); }}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                <Trash2 size={16} />
                                            </button> */}
                                            <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                onClick={() => handleToggleStatus(user.id)}>

                                                <LockIcon size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredUsers.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            Không tìm thấy người dùng nào
                        </div>
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

            {showModal && (
                <UserModal
                    user={editingUser}
                    onClose={() => setShowModal(false)}
                    onSuccess={fetchUsers}
                />
            )}
        </div>
    );
};

export default UserManagement;