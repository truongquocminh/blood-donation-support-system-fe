import React, { useState, useEffect } from 'react';
import { Plus, User, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAllBlogs, getMyBlogs } from '../../services/blogService';
import BlogDetail from '../../components/blogs/BlogDetail';
import BlogEditor from '../../components/blogs/BlogEditor';
import useAuth from '../../hooks/useAuth';

const Blog = () => {
    const { user } = useAuth();
    console.log("user: ", user);
    const [currentView, setCurrentView] = useState('list'); // 'list', 'detail', 'editor'
    const [activeTab, setActiveTab] = useState('all');
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [editingBlog, setEditingBlog] = useState(null);

    const [pagination, setPagination] = useState({
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0
    });

    const fetchBlogs = async (pageIndex = 0) => {
        setLoading(true);
        try {
            const response = activeTab === 'all'
                ? await getAllBlogs(pageIndex, pagination.size)
                : await getMyBlogs(pageIndex, pagination.size);

            if (activeTab === 'my' && response.status === 200 && response.data.status === "NOT_FOUND") {
                setBlogs([]);
                setPagination({
                    page: 0,
                    size: 10,
                    totalElements: 0,
                    totalPages: 0
                });
            } else {
                const { content, page } = response.data.data;
                setBlogs(content);
                setPagination({
                    page: page.number,
                    size: page.size,
                    totalElements: page.totalElements,
                    totalPages: page.totalPages
                });
            }
        } catch (error) {
            console.log("error: ", error);
            toast.error('Không thể tải danh sách bài viết');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentView === 'list') {
            fetchBlogs(0);
        }
    }, [activeTab, currentView]);

    const truncateContent = (content, maxLength = 150) => {
        const textContent = content.replace(/<[^>]*>/g, '');
        let truncatedHTML = content;

        if (textContent.length > maxLength) {
            const div = document.createElement('div');
            div.innerHTML = content;
            const textNode = div.textContent || div.innerText || '';

            if (textNode.length > maxLength) {
                const truncatedText = textNode.substring(0, maxLength);
                const lastSpaceIndex = truncatedText.lastIndexOf(' ');
                const finalText = lastSpaceIndex > 0 ? truncatedText.substring(0, lastSpaceIndex) : truncatedText;

                truncatedHTML = finalText + '...';
            }
        }

        return truncatedHTML;
    };

    const handleViewBlog = (blog) => {
        setSelectedBlog(blog);
        setCurrentView('detail');
    };

    const handleCreateBlog = () => {
        setEditingBlog(null);
        setCurrentView('editor');
    };

    const handleEditBlog = (blog) => {
        setEditingBlog(blog);
        setCurrentView('editor');
    };

    const handleBackToList = () => {
        setCurrentView('list');
        setSelectedBlog(null);
        setEditingBlog(null);
        fetchBlogs(pagination.page);
    };

    const handlePageChange = (newPage) => {
        fetchBlogs(newPage);
    };

    if (currentView === 'detail') {
        return (
            <BlogDetail
                blog={selectedBlog}
                onBack={handleBackToList}
                onEdit={handleEditBlog}
                canEdit={activeTab === 'my'}
            />
        );
    }

    if (currentView === 'editor') {
        return (
            <BlogEditor
                blog={editingBlog}
                onBack={handleBackToList}
                onSave={handleBackToList}
            />
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {user?.role === ('ADMIN' || 'STAFF') ? 'Quản lý bài viết' : 'Bài viết'}
                    </h1>
                    <p className="text-gray-600">
                        {user?.role === ('ADMIN' || 'STAFF') ? 'Quản lý và theo dõi các bài viết đã được đăng' : 'Xem các bài viết hiện có'}
                    </p>
                </div>

                {
                    user?.role === ('ADMIN' || 'STAFF')
                    &&
                    <button
                        onClick={handleCreateBlog}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Tạo bài viết
                    </button>
                }

            </div>

            <div className="bg-gray-50 rounded-lg shadow-sm border border-gray-200">
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'all'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Tất cả bài viết
                        </button>
                        {user?.role === ('ADMIN' || 'STAFF') &&

                            (<button
                                onClick={() => setActiveTab('my')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'my'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Bài viết của tôi
                            </button>)
                        }
                    </nav>
                </div>

                <div className="p-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : blogs.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <User className="w-12 h-12 text-gray-400" />
                            </div>
                            <p className="text-gray-500 text-lg">Không có bài viết nào</p>
                            <p className="text-gray-400 text-sm mt-1">Hãy tạo bài viết đầu tiên của bạn!</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {blogs.map((blog) => (
                                    <div
                                        key={blog.id}
                                        className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden group"
                                        onClick={() => handleViewBlog(blog)}
                                    >
                                        <div className="p-6">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                                                {blog.title}
                                            </h3>

                                            <div
                                                className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3"
                                                dangerouslySetInnerHTML={{
                                                    __html: truncateContent(blog.content, 120)
                                                }}
                                            />

                                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <User className="w-4 h-4 mr-2" />
                                                    <span className="truncate">{blog.authorName}</span>
                                                </div>

                                                <div className="text-xs text-gray-400">
                                                    <span>Xem thêm →</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {pagination.totalPages > 1 && (
                                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                                    <div className="text-sm text-gray-700">
                                        Hiển thị {pagination.page * pagination.size + 1} - {Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)} trong tổng số {pagination.totalElements} bài viết
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handlePageChange(pagination.page - 1)}
                                            disabled={pagination.page === 0}
                                            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>

                                        <div className="flex items-center space-x-1">
                                            {[...Array(pagination.totalPages)].map((_, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => handlePageChange(index)}
                                                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${index === pagination.page
                                                        ? 'bg-blue-600 text-white'
                                                        : 'text-gray-700 hover:bg-gray-100'
                                                        }`}
                                                >
                                                    {index + 1}
                                                </button>
                                            ))}
                                        </div>

                                        <button
                                            onClick={() => handlePageChange(pagination.page + 1)}
                                            disabled={pagination.page >= pagination.totalPages - 1}
                                            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Blog;