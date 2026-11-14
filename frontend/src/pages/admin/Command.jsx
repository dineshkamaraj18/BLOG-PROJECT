import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  Trash2,
  ExternalLink,
  Search,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

const Command = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const token = localStorage.getItem('token');

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/blogs/admin/all-comments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setComments(data.comments);
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleDeleteComment = async (blogId, commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      setDeletingId(commentId);
      const res = await fetch(`${API_BASE_URL}/api/blogs/${blogId}/comments/${commentId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setComments((prev) => prev.filter((c) => c.commentId !== commentId));
        setFeedback({ type: 'success', text: 'Comment removed successfully.' });
      } else {
        setFeedback({ type: 'error', text: data.message || 'Failed to remove comment.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', text: 'Network error deleting comment.' });
    } finally {
      setDeletingId(null);
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const filteredComments = comments.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.comment.toLowerCase().includes(search.toLowerCase()) ||
      c.blogTitle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Comments Moderation
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review, search, and moderate community comments across all published articles.
          </p>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-medium ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Filter bar */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-800">
              User Comments ({comments.length})
            </h2>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search author, text, or blog..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
            <p className="text-sm">Loading comments...</p>
          </div>
        ) : filteredComments.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <p className="text-slate-600 font-semibold mb-1">No comments found</p>
            <p className="text-xs">
              {search ? 'Try adjusting your search criteria.' : 'No comments submitted yet.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredComments.map((c) => (
              <div
                key={c.commentId}
                className="p-6 hover:bg-slate-50/60 transition flex flex-col sm:flex-row items-start justify-between gap-4"
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900 text-sm">{c.name}</span>
                    <span className="text-xs text-slate-400">
                      {new Date(c.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <p className="text-slate-700 text-sm leading-relaxed">{c.comment}</p>

                  <div className="pt-1">
                    <Link
                      to={`/blog/${c.blogId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      <span>On: {c.blogTitle}</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteComment(c.blogId, c.commentId)}
                  disabled={deletingId === c.commentId}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition border border-rose-100 disabled:opacity-50"
                  title="Delete comment"
                >
                  {deletingId === c.commentId ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                  <span>Delete</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Command;
