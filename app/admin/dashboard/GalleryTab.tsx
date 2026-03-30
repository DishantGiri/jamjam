import React, { useState, useEffect } from 'react';
import { Plus, X, Edit, Trash2, ImageIcon, UploadCloud } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Gallery Tab Component
export default function GalleryTab() {
    const [images, setImages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingImage, setEditingImage] = useState<any | null>(null);

    // Form state
    const [files, setFiles] = useState<File[]>([]);
    const [caption, setCaption] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        try {
            // Remove the duplicate /api/ if NEXT_PUBLIC_API_BASE_URL already contains it
            const baseUrl = API_BASE_URL?.endsWith('/api') ? API_BASE_URL.replace(/\/api$/, '') : API_BASE_URL;
            const res = await fetch(`${baseUrl}/api/gallery`, {
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!res.ok) {
                console.error('Failed to fetch gallery:', res.status);
                return;
            }

            const data = await res.json();
            if (data.status && data.data) {
                setImages(data.data);
            }
        } catch (error) {
            console.error('Error fetching gallery:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const token = localStorage.getItem('authToken');

        try {
            const formData = new FormData();
            if (caption) formData.append('caption', caption);
            formData.append('is_active', isActive ? '1' : '0');

            const baseUrl = API_BASE_URL?.endsWith('/api') ? API_BASE_URL.replace(/\/api$/, '') : API_BASE_URL;
            let url = `${baseUrl}/api/gallery`;

            if (editingImage) {
                url = `${baseUrl}/api/gallery/${editingImage.id}`;
                if (files.length > 0) {
                    formData.append('image', files[0]);
                }
                // Appending _method PUT just in case Laravel expects it to be a PUT disguised as POST
                formData.append('_method', 'PUT');
            } else {
                files.forEach(file => {
                    formData.append('images[]', file);
                });
                // Fallback for single uploads or if backend has a mismatched validation rule
                if (files.length > 0) {
                    formData.append('image', files[0]);
                }
            }

            const res = await fetch(url, {
                method: 'POST', // POST is used for both create and update for multipart/form-data
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                body: formData
            });

            const responseData = await res.json().catch(() => null);

            if (res.ok) {
                setShowForm(false);
                setEditingImage(null);
                setFiles([]);
                setCaption('');
                setIsActive(true);
                fetchGallery();
            } else {
                console.error('Failed to save gallery items:', responseData);
                alert(`Error: ${responseData?.message || 'Failed to save items'}`);
            }
        } catch (error) {
            console.error('Error saving gallery items:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this image?')) return;

        const token = localStorage.getItem('authToken');
        try {
            const baseUrl = API_BASE_URL?.endsWith('/api') ? API_BASE_URL.replace(/\/api$/, '') : API_BASE_URL;
            const res = await fetch(`${baseUrl}/api/gallery/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (res.ok) {
                fetchGallery();
            }
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };

    const handleEdit = (img: any) => {
        setEditingImage(img);
        setCaption(img.caption || '');
        setIsActive(img.is_active);
        setFiles([]);
        setShowForm(true);
    };

    if (loading) {
        return <div className="text-center py-8">Loading gallery...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Gallery Management</h2>
                    <p className="text-gray-500 text-sm mt-1">Upload and manage gallery images</p>
                </div>
                <button
                    onClick={() => {
                        setEditingImage(null);
                        setCaption('');
                        setIsActive(true);
                        setFiles([]);
                        setShowForm(!showForm);
                    }}
                    className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md text-sm font-medium"
                >
                    {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    <span className="hidden sm:inline">{showForm ? 'Cancel' : 'Upload Images'}</span>
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                        {editingImage ? 'Edit Image' : 'Bulk Upload Images'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {editingImage ? 'Image (Leave empty to keep current)' : 'Select Images'}
                            </label>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                multiple={!editingImage}
                                accept="image/jpeg,image/png,image/webp"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                                required={!editingImage}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
                            <input
                                type="text"
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                                placeholder={editingImage ? 'Image caption' : 'Caption to apply to ALL images in this batch'}
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={isActive}
                                onChange={(e) => setIsActive(e.target.checked)}
                                className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                            />
                            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                                Active (Visible to public)
                            </label>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving || (!editingImage && files.length === 0)}
                                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg transition-colors font-medium text-sm disabled:opacity-50"
                            >
                                <UploadCloud className="w-4 h-4" />
                                {saving ? 'Saving...' : (editingImage ? 'Update' : 'Upload')}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {images.map((img) => (
                    <div key={img.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group">
                        <div className="relative aspect-square">
                            <img
                                src={img.image_url}
                                alt={img.caption || 'Gallery image'}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            {!img.is_active && (
                                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                    Hidden
                                </div>
                            )}
                        </div>
                        <div className="p-3">
                            <p className="text-sm text-gray-600 truncate" title={img.caption || 'No caption'}>
                                {img.caption || <span className="italic">No caption</span>}
                            </p>
                            <div className="flex justify-between mt-3">
                                <button
                                    onClick={() => handleEdit(img)}
                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Edit"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(img.id)}
                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {images.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-300" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No images</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by uploading some images to your gallery.</p>
                </div>
            )}
        </div>
    );
}

