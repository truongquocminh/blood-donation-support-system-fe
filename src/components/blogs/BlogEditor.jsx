import React, { useState, useRef } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { Editor } from '@tinymce/tinymce-react';
import { createBlogs, updateBlogById } from '../../services/blogService';

const BlogEditor = ({ blog, onBack, onSave }) => {
    const [formData, setFormData] = useState({
        title: blog?.title || '',
        content: blog?.content || ''
    });
    const [formErrors, setFormErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const editorRef = useRef(null);

    const handleImageUpload = (blobInfo, progress) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                // Trả về base64 để lưu trực tiếp vào content
                resolve(reader.result);
            };
            reader.onerror = () => {
                reject('Lỗi đọc file');
            };
            reader.readAsDataURL(blobInfo.blob());
        });
    };

    const editorConfig = {
        height: 500,
        menubar: false,
        plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'help', 'wordcount', 'emoticons'
        ],
        toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor backcolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | link image media | table | emoticons | fullscreen | help',
        content_style: `
            body { 
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
                font-size: 14px;
                line-height: 1.6;
                margin: 1rem;
            }
            img {
                max-width: 100%;
                height: auto;
            }
        `,
        images_upload_handler: handleImageUpload,
        paste_data_images: true,
        automatic_uploads: true,
        file_picker_types: 'image',
        images_reuse_filename: true,
        branding: false,
        promotion: false,
        placeholder: 'Nhập nội dung bài viết của bạn...',
        setup: (editor) => {
            editor.on('init', () => {
                if (formData.content) {
                    editor.setContent(formData.content);
                }
            });
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.title.trim()) {
            errors.title = 'Tiêu đề không được để trống';
        }
        const textContent = formData.content.replace(/<[^>]*>/g, '').trim();
        if (!textContent) {
            errors.content = 'Nội dung không được để trống';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            if (blog) {
                await updateBlogById(blog.id, formData);
                toast.success('Cập nhật bài viết thành công!');
            } else {
                await createBlogs(formData);
                toast.success('Tạo bài viết thành công!');
            }
            onSave();
        } catch (error) {
            toast.error(blog ? 'Không thể cập nhật bài viết' : 'Không thể tạo bài viết');
            console.error('Submit error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditorChange = (content) => {
        setFormData({ ...formData, content });
        if (formErrors.content) {
            setFormErrors({ ...formErrors, content: '' });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Quay lại
                </button>

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <div className="flex items-center">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            {blog ? 'Đang cập nhật...' : 'Đang lưu...'}
                        </div>
                    ) : (
                        <>
                            <Save className="w-4 h-4 mr-2" />
                            {blog ? 'Cập nhật' : 'Lưu bài viết'}
                        </>
                    )}
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">
                        {blog ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
                    </h1>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tiêu đề bài viết <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => {
                                    setFormData({ ...formData, title: e.target.value });
                                    if (formErrors.title) {
                                        setFormErrors({ ...formErrors, title: '' });
                                    }
                                }}
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-lg ${
                                    formErrors.title ? 'border-red-300' : 'border-gray-300'
                                }`}
                                placeholder="Nhập tiêu đề bài viết..."
                            />
                            {formErrors.title && (
                                <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nội dung bài viết <span className="text-red-500">*</span>
                            </label>
                            <div className={`border rounded-lg overflow-hidden ${
                                formErrors.content ? 'border-red-300' : 'border-gray-300'
                            }`}>
                                <Editor
                                    ref={editorRef}
                                    apiKey="8xthohg6998m9wdtqnh7cdjiw5bvlgrnf2sdmz8yxid83rq4"
                                    value={formData.content}
                                    onEditorChange={handleEditorChange}
                                    init={editorConfig}
                                />
                            </div>
                            {formErrors.content && (
                                <p className="mt-1 text-sm text-red-600">{formErrors.content}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogEditor;