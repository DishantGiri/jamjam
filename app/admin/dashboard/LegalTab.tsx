import React, { useState, useEffect } from 'react';
import { Plus, X, Edit, Trash2, FileBadge, UploadCloud } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Legal Documents Tab Component
export default function LegalTab() {
    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingDoc, setEditingDoc] = useState<any | null>(null);

    // Form state
    const [files, setFiles] = useState<File[]>([]);
    const [title, setTitle] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const baseUrl = API_BASE_URL?.endsWith('/api') ? API_BASE_URL.replace(/\/api$/, '') : API_BASE_URL;
            const res = await fetch(`${baseUrl}/api/legal-documents`, {
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!res.ok) {
                console.error('Failed to fetch legal documents:', res.status);
                return;
            }

            const data = await res.json();
            if (data.status && data.data) {
                setDocuments(data.data);
            }
        } catch (error) {
            console.error('Error fetching legal documents:', error);
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
            if (title) formData.append('title', title);
            formData.append('is_active', isActive ? '1' : '0');

            const baseUrl = API_BASE_URL?.endsWith('/api') ? API_BASE_URL.replace(/\/api$/, '') : API_BASE_URL;
            let url = `${baseUrl}/api/legal-documents`;

            if (editingDoc) {
                url = `${baseUrl}/api/legal-documents/${editingDoc.id}`;
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
                setEditingDoc(null);
                setFiles([]);
                setTitle('');
                setIsActive(true);
                fetchDocuments();
            } else {
                console.error('Failed to save legal document:', responseData);
                alert(`Error: ${responseData?.message || 'Failed to save items'}`);
            }
        } catch (error) {
            console.error('Error saving legal document:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this document?')) return;

        const token = localStorage.getItem('authToken');
        try {
            const baseUrl = API_BASE_URL?.endsWith('/api') ? API_BASE_URL.replace(/\/api$/, '') : API_BASE_URL;
            const res = await fetch(`${baseUrl}/api/legal-documents/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (res.ok) {
                fetchDocuments();
            }
        } catch (error) {
            console.error('Error deleting document:', error);
        }
    };

    const handleEdit = (doc: any) => {
        setEditingDoc(doc);
        setTitle(doc.title || '');
        setIsActive(doc.is_active);
        setFiles([]);
        setShowForm(true);
    };

    if (loading) {
        return <div className="text-center py-8">Loading legal documents...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Legal Documents</h2>
                    <p className="text-gray-500 text-sm mt-1">Upload and manage certifications and legal documents</p>
                </div>
                <button
                    onClick={() => {
                        setEditingDoc(null);
                        setTitle('');
                        setIsActive(true);
                        setFiles([]);
                        setShowForm(!showForm);
                    }}
                    className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md text-sm font-medium"
                >
                    {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    <span className="hidden sm:inline">{showForm ? 'Cancel' : 'Upload Documents'}</span>
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                        {editingDoc ? 'Edit Document' : 'Upload New Documents'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {editingDoc ? 'Image File (Leave empty to keep current)' : 'Select Files (Images/PDFs)'}
                            </label>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                multiple={!editingDoc}
                                accept="image/jpeg,image/png,image/webp,application/pdf"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                                required={!editingDoc}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Document Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                                placeholder={editingDoc ? 'E.g. Company Registration 2024' : 'Title for the uploaded document(s)'}
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="isActiveDoc"
                                checked={isActive}
                                onChange={(e) => setIsActive(e.target.checked)}
                                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                            />
                            <label htmlFor="isActiveDoc" className="ml-2 block text-sm text-gray-900">
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
                                disabled={saving || (!editingDoc && files.length === 0)}
                                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-lg transition-colors font-medium text-sm disabled:opacity-50"
                            >
                                <UploadCloud className="w-4 h-4" />
                                {saving ? 'Saving...' : (editingDoc ? 'Update' : 'Upload')}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                {documents.map((doc) => (
                    <div key={doc.id} className="break-inside-avoid bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group">
                        <div className="relative">
                            <img
                                src={doc.image_url}
                                alt={doc.title || 'Legal Document'}
                                className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                                loading="lazy"
                            />
                            {!doc.is_active && (
                                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                    Hidden
                                </div>
                            )}
                        </div>
                        <div className="p-3 bg-white relative z-10 border-t border-gray-50">
                            <h4 className="font-semibold text-gray-800 text-sm mb-1">{doc.title || 'Untitled Document'}</h4>
                            <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-50">
                                <button
                                    onClick={() => handleEdit(doc)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-teal-600 hover:bg-teal-50 rounded-lg transition-colors font-medium"
                                    title="Edit"
                                >
                                    <Edit className="w-4 h-4" />
                                    <span>Edit</span>
                                </button>
                                <button
                                    onClick={() => handleDelete(doc.id)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                                    title="Delete"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    <span>Delete</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {documents.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                    <FileBadge className="mx-auto h-12 w-12 text-gray-300" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No legal documents</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by uploading your company certificates.</p>
                </div>
            )}
        </div>
    );
}

