import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MessageSquare, CheckCircle2, AlertCircle, Loader2, Heart, Globe } from 'lucide-react';

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

const Blog = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Comment Form state
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);

  // Like state (persisted in localStorage per blog)
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    if (!id) return;
    const storedLikes = JSON.parse(localStorage.getItem('blog_likes') || '{}');
    setLiked(!!storedLikes[id]?.liked);
    setLikeCount(storedLikes[id]?.count || 0);
  }, [id]);

  const handleLike = () => {
    const storedLikes = JSON.parse(localStorage.getItem('blog_likes') || '{}');
    const current = storedLikes[id] || { liked: false, count: 0 };
    const newLiked = !current.liked;
    const newCount = newLiked ? current.count + 1 : Math.max(0, current.count - 1);
    storedLikes[id] = { liked: newLiked, count: newCount };
    localStorage.setItem('blog_likes', JSON.stringify(storedLikes));
    setLiked(newLiked);
    setLikeCount(newCount);
  };

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/blogs/${id}`);
        const data = await res.json();
        if (data.success) {
          setBlog(data.blog);
        } else {
          setError(data.message || 'Blog not found.');
        }
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError('Failed to connect to server.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      setSubmitMessage({ type: 'error', text: 'Please fill in both name and comment.' });
      return;
    }

    try {
      setSubmitting(true);
      setSubmitMessage(null);

      const res = await fetch(`/api/blogs/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), comment: comment.trim() }),
      });

      const data = await res.json();

      if (data.success) {
        setBlog((prev) => ({
          ...prev,
          comments: data.comments,
        }));
        setName('');
        setComment('');
        setSubmitMessage({ type: 'success', text: 'Comment submitted successfully!' });
      } else {
        setSubmitMessage({ type: 'error', text: data.message || 'Failed to add comment.' });
      }
    } catch (err) {
      console.error('Comment submission error:', err);
      setSubmitMessage({ type: 'error', text: 'Network error submitting comment.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-slate-500">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
        <p className="font-medium text-sm">Loading article...</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="max-w-xl mx-auto my-20 p-8 text-center bg-rose-50 rounded-3xl border border-rose-100">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-rose-800 mb-2">Error Loading Post</h2>
        <p className="text-rose-600 text-sm mb-6">{error || 'Article could not be found.'}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(blog.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <article className="min-h-screen bg-white pb-24">
      {/* Top Navigation */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all blogs</span>
        </Link>
      </div>

      {/* Blog Header */}
      <header className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 pb-8">
        <div className="mb-4">
          <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide bg-blue-50 text-blue-700 border border-blue-100">
            {blog.category}
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.2] mb-6">
          {blog.title}
        </h1>

        <div className="flex flex-wrap items-center gap-5 text-sm text-slate-500 pb-8 border-b border-slate-100">
          <div className="flex items-center gap-2 font-medium text-slate-700">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
              {(blog.author || 'Admin').charAt(0).toUpperCase()}
            </div>
            <span>{blog.author || 'Admin'}</span>
          </div>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-slate-400" />
            {formattedDate}
          </span>
          <span className="flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-blue-500" />
            {blog.comments?.length || 0} Comments
          </span>
          {/* Like Button */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200 active:scale-95 select-none ${
              liked
                ? 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100'
                : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200'
            }`}
            title={liked ? 'Unlike this post' : 'Like this post'}
          >
            <Heart
              className={`w-4 h-4 transition-all duration-200 ${liked ? 'fill-rose-500 text-rose-500 scale-110' : ''}`}
            />
            <span>{likeCount > 0 ? likeCount : ''}{likeCount === 0 ? 'Like' : likeCount === 1 ? ' Like' : ' Likes'}</span>
          </button>
        </div>
      </header>

      {/* Blog Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="prose prose-lg text-slate-800 leading-relaxed font-normal space-y-6">
          {blog.content.split('\n\n').map((paragraph, index) => {
            const trimmed = paragraph.trim();
            if (trimmed.startsWith('### ')) {
              return (
                <h3 key={index} className="text-2xl font-bold text-slate-900 pt-4 pb-1">
                  {trimmed.replace('### ', '')}
                </h3>
              );
            }
            if (trimmed.startsWith('## ')) {
              return (
                <h2 key={index} className="text-3xl font-bold text-slate-900 pt-6 pb-2">
                  {trimmed.replace('## ', '')}
                </h2>
              );
            }
            if (trimmed.startsWith('1. ') || trimmed.includes('\n1. ')) {
              const items = trimmed.split('\n').filter((l) => l.trim().length > 0);
              return (
                <ol key={index} className="list-decimal pl-6 space-y-2 text-slate-700">
                  {items.map((it, idx) => (
                    <li key={idx} className="pl-1">
                      {it.replace(/^\d+\.\s*/, '')}
                    </li>
                  ))}
                </ol>
              );
            }
            if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
              const items = trimmed.split('\n').filter((l) => l.trim().length > 0);
              return (
                <ul key={index} className="list-disc pl-6 space-y-2 text-slate-700">
                  {items.map((it, idx) => (
                    <li key={idx} className="pl-1">
                      {it.replace(/^[-*]\s*/, '')}
                    </li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={index} className="text-slate-700 text-lg leading-relaxed">
                {trimmed}
              </p>
            );
          })}
        </div>

        {/* About the Author */}
        {blog.authorId && typeof blog.authorId === 'object' && (
          <div className="mt-16 bg-slate-50 rounded-3xl border border-slate-200/80 p-6 sm:p-8">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-5">
              About the Author
            </h3>
            <div className="flex items-start gap-5">
              {blog.authorId.avatar ? (
                <img
                  src={blog.authorId.avatar}
                  alt={blog.authorId.name}
                  className="w-16 h-16 rounded-2xl object-cover shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-700 font-bold text-2xl flex items-center justify-center shrink-0">
                  {blog.authorId.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="text-lg font-bold text-slate-900">{blog.authorId.name}</h4>
                {blog.authorId.role && (
                  <p className="text-sm text-blue-600 font-semibold mt-0.5">{blog.authorId.role}</p>
                )}
                {blog.authorId.bio && (
                  <p className="text-sm text-slate-600 mt-3 leading-relaxed">{blog.authorId.bio}</p>
                )}
                <div className="flex items-center gap-2 mt-4">
                  {blog.authorId.twitter && (
                    <a href={blog.authorId.twitter} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-white text-slate-500 hover:text-blue-500 hover:bg-blue-50 flex items-center justify-center transition border border-slate-100">
                      <TwitterIcon />
                    </a>
                  )}
                  {blog.authorId.linkedin && (
                    <a href={blog.authorId.linkedin} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-white text-slate-500 hover:text-blue-700 hover:bg-blue-50 flex items-center justify-center transition border border-slate-100">
                      <LinkedinIcon />
                    </a>
                  )}
                  {blog.authorId.github && (
                    <a href={blog.authorId.github} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center transition border border-slate-100">
                      <GithubIcon />
                    </a>
                  )}
                  {blog.authorId.website && (
                    <a href={blog.authorId.website} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-white text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 flex items-center justify-center transition border border-slate-100">
                      <Globe className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Separator */}
        <hr className="my-16 border-slate-100" />

        {/* Comments Section */}
        <section className="pt-2">
          {/* Comments Count Heading */}
          <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
            <span>Comments ({blog.comments?.length || 0})</span>
          </h2>

          {/* Existing Comments List */}
          {blog.comments && blog.comments.length > 0 ? (
            <div className="space-y-4 mb-12">
              {blog.comments.map((item, idx) => (
                <div
                  key={item._id || idx}
                  className="bg-slate-50 border border-slate-100 rounded-2xl p-5 transition"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-slate-900">{item.name}</span>
                    <span className="text-xs text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed">{item.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-sm mb-12 italic">
              No comments yet. Be the first to share your thoughts!
            </p>
          )}

          {/* Add your comment form */}
          <div className="mt-8">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Add your comment</h3>

            {submitMessage && (
              <div
                className={`p-4 rounded-xl text-sm mb-4 flex items-center gap-2 ${
                  submitMessage.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {submitMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
                )}
                <span>{submitMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleCommentSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                />
              </div>

              <div>
                <textarea
                  placeholder="Comment"
                  rows={5}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-y"
                  required
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-2.5 rounded-xl transition shadow-md shadow-blue-500/20 active:scale-95 disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Submit</span>
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </article>
  );
};

export default Blog;
