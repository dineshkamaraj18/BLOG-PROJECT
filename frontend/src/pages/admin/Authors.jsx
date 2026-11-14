import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Edit3,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Globe,
  Save,
} from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

const TwitterIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const GithubIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const emptyForm = {
  name: '',
  role: '',
  bio: '',
  avatar: '',
  twitter: '',
  linkedin: '',
  github: '',
  website: '',
};

const Authors = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const token = localStorage.getItem('token');

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/authors`);
      const data = await res.json();
      if (data.success) {
        setAuthors(data.authors);
      }
    } catch (err) {
      console.error('Failed to fetch authors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const openAddModal = () => {
    setEditing(null);
    setFormData(emptyForm);
    setShowModal(true);
    setFeedback(null);
  };

  const openEditModal = (author) => {
    setEditing(author._id);
    setFormData({
      name: author.name || '',
      role: author.role || '',
      bio: author.bio || '',
      avatar: author.avatar || '',
      twitter: author.twitter || '',
      linkedin: author.linkedin || '',
      github: author.github || '',
      website: author.website || '',
    });
    setShowModal(true);
    setFeedback(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFeedback({ type: 'error', text: 'Author name is required.' });
      return;
    }

    try {
      setSaving(true);
      setFeedback(null);
      const url = editing ? `${API_BASE_URL}/api/authors/${editing}` : `${API_BASE_URL}/api/authors`;
      const method = editing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || ''}`,
        },
        body: JSON.stringify(formData),
      });

      let data = null;
      try {
        data = await res.json();
      } catch (parseError) {
        // Not a JSON response (e.g. 404 HTML if backend was not restarted or 502/504)
        data = null;
      }

      if (res.ok && data?.success) {
        setFeedback({
          type: 'success',
          text: editing ? 'Author updated successfully!' : 'Author created successfully!',
        });
        fetchAuthors();
        setTimeout(() => {
          setShowModal(false);
          setFeedback(null);
        }, 1000);
      } else {
        const errorMsg =
          data?.message ||
          (res.status === 404
            ? 'Endpoint not found (404). Please restart your backend server so new routes take effect.'
            : res.status === 401
            ? 'Unauthorized. Please log out and sign in again to refresh your session.'
            : `Server error (${res.status}). Please check your backend console.`);
        setFeedback({ type: 'error', text: errorMsg });
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        text: 'Network error: Unable to reach the backend server. Please verify your backend is running on port 5000.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this author?')) return;
    try {
      setDeleting(id);
      const res = await fetch(`${API_BASE_URL}/api/authors/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        fetchAuthors();
      }
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-3">
            <Users className="w-6 h-6 text-blue-600" />
            Authors
          </h1>
          <p className="text-sm text-slate-400 mt-1">Manage blog authors and contributors</p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Author
        </button>
      </div>

      {/* Authors Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : authors.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-16 text-center">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No authors yet</p>
          <p className="text-slate-400 text-sm mt-1">Add your first author to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {authors.map((author) => (
            <div
              key={author._id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                {author.avatar ? (
                  <img
                    src={author.avatar}
                    alt={author.name}
                    className="w-14 h-14 rounded-2xl object-cover shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 font-bold text-xl flex items-center justify-center shrink-0">
                    {author.name.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 truncate">{author.name}</h3>
                  {author.role && (
                    <p className="text-xs text-blue-600 font-semibold mt-0.5">{author.role}</p>
                  )}
                </div>
              </div>

              {author.bio && (
                <p className="text-sm text-slate-500 mt-3 line-clamp-2 leading-relaxed">
                  {author.bio}
                </p>
              )}

              {/* Social links */}
              <div className="flex items-center gap-2 mt-4">
                {author.twitter && (
                  <a
                    href={author.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-lg bg-slate-50 text-slate-500 hover:text-blue-500 hover:bg-blue-50 flex items-center justify-center transition"
                  >
                    <TwitterIcon />
                  </a>
                )}
                {author.linkedin && (
                  <a
                    href={author.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-lg bg-slate-50 text-slate-500 hover:text-blue-700 hover:bg-blue-50 flex items-center justify-center transition"
                  >
                    <LinkedinIcon />
                  </a>
                )}
                {author.github && (
                  <a
                    href={author.github}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-lg bg-slate-50 text-slate-500 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center transition"
                  >
                    <GithubIcon />
                  </a>
                )}
                {author.website && (
                  <a
                    href={author.website}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-lg bg-slate-50 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 flex items-center justify-center transition"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                <button
                  onClick={() => openEditModal(author)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(author._id)}
                  disabled={deleting === author._id}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition disabled:opacity-50"
                >
                  {deleting === author._id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">
                {editing ? 'Edit Author' : 'Add New Author'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {feedback && (
                <div
                  className={`p-3 rounded-xl text-sm flex items-center gap-2 ${
                    feedback.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {feedback.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>{feedback.text}</span>
                </div>
              )}

              {/* Name & Role */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Role
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    placeholder="Senior Developer"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Bio
                </label>
                <textarea
                  name="bio"
                  rows={3}
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="A short biography about the author..."
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-y"
                />
              </div>

              {/* Avatar URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Avatar URL
                </label>
                <input
                  type="url"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleChange}
                  placeholder="https://... (optional)"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              {/* Social Links */}
              <div className="pt-2">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  Social Links
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="url"
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleChange}
                    placeholder="Twitter / X URL"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    placeholder="LinkedIn URL"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                  <input
                    type="url"
                    name="github"
                    value={formData.github}
                    onChange={handleChange}
                    placeholder="GitHub URL"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="Website URL"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition active:scale-95 disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{editing ? 'Save Changes' : 'Create Author'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Authors;
