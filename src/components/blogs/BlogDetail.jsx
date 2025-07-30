import React, { useState } from 'react';
import { ArrowLeft, Edit, Trash2, User, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { deleteBlogById } from '../../services/blogService';
import ConfirmModal from '../../components/common/ConfirmModal';

const BlogDetail = ({ blog, onBack, onEdit, canEdit }) => {
    const [confirmModal, setConfirmModal] = useState({ isOpen: false });
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            await deleteBlogById(blog.id);
            toast.success('Xóa bài viết thành công!');
            onBack();
        } catch (error) {
            toast.error('Không thể xóa bài viết');
        } finally {
            setLoading(false);
        }
        setConfirmModal({ isOpen: false });
    };

    if (!blog) {
        return (
            <div className="flex items-center justify-center py-12">
                <p className="text-gray-500">Không tìm thấy bài viết</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Quay lại danh sách
                </button>

                {canEdit && (
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => onEdit(blog)}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Edit className="w-4 h-4 mr-2" />
                            Chỉnh sửa
                        </button>
                        <button
                            onClick={() => setConfirmModal({ isOpen: true })}
                            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Xóa
                        </button>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-8">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            {blog.title}
                        </h1>
                        
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                            <div className="flex items-center">
                                <User className="w-4 h-4 mr-1" />
                                <span>Tác giả: {blog.authorName}</span>
                            </div>
                            {blog.createdAt && (
                                <div className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    <span>Ngày tạo: {new Date(blog.createdAt).toLocaleDateString('vi-VN')}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                        <div 
                            className="prose prose-lg max-w-none"
                            dangerouslySetInnerHTML={{ __html: blog.content }}
                            style={{
                                lineHeight: '1.8',
                                fontSize: '16px'
                            }}
                        />
                    </div>
                </div>
            </div>

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                title="Xác nhận xóa bài viết"
                message="Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác."
                onConfirm={handleDelete}
                onCancel={() => setConfirmModal({ isOpen: false })}
                confirmText="Xóa"
                cancelText="Hủy"
                confirmButtonClass="bg-red-600 hover:bg-red-700 text-white"
                type="danger"
            />
        </div>
    );
};

export default BlogDetail;