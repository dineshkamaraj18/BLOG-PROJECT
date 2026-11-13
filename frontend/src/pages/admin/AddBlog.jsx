import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Sparkles,
  Save,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
} from 'lucide-react';

const AddBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Software Development',
    image: '',
    description: '',
    content: '',
    authorId: '',
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [feedback, setFeedback] = useState(null);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [authors, setAuthors] = useState([]);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const res = await fetch('/api/authors');
        const data = await res.json();
        if (data.success) setAuthors(data.authors);
      } catch (err) {
        console.error('Failed to fetch authors:', err);
      }
    };
    fetchAuthors();
  }, []);

  useEffect(() => {
    if (isEditing) {
      const fetchBlogToEdit = async () => {
        try {
          setFetching(true);
          const res = await fetch(`/api/blogs/${id}`);
          const data = await res.json();
          if (data.success) {
            setFormData({
              title: data.blog.title || '',
              category: data.blog.category || 'Software Development',
              image: data.blog.image || '',
              description: data.blog.description || '',
              content: data.blog.content || '',
              authorId: data.blog.authorId?._id || data.blog.authorId || '',
            });
          } else {
            setFeedback({ type: 'error', text: data.message || 'Failed to load blog.' });
          }
        } catch (err) {
          setFeedback({ type: 'error', text: 'Error fetching blog details.' });
        } finally {
          setFetching(false);
        }
      };

      fetchBlogToEdit();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAiAssist = () => {
    if (!formData.title.trim()) {
      alert('Please enter a Title first for AI content generation.');
      return;
    }

    setAiGenerating(true);
    setTimeout(() => {
      const generatedExcerpt = `A comprehensive deep-dive exploring key strategies, emerging methodologies, and actionable practices for modern ${formData.category.toLowerCase()} enthusiasts.`;
      const generatedContent = `### 1. Introduction & Overview
In today’s fast-moving industry, understanding ${formData.title.trim()} is crucial for creators, developers, and founders looking to stand out.

### 2. Core Methodologies & Strategies
- Focus on foundational principles before adopting complex tooling.
- Validate assumptions with rapid iterations and genuine user feedback.
- Automate repetitive tasks to preserve high-value intellectual focus.

### 3. Practical Implementation Guide
1. Start with clear, measurable milestone definitions.
2. Maintain clean architecture and consistent standards.
3. Continually review real-world feedback to iterate effectively.

### 4. Summary & Next Steps
By staying intentional and consistent, you can master these concepts and build remarkable solutions.`;

      setFormData((prev) => ({
        ...prev,
        description: prev.description || generatedExcerpt,
        content: prev.content ? `${prev.content}\n\n${generatedContent}` : generatedContent,
      }));
      setAiGenerating(false);
      setFeedback({
        type: 'success',
        text: 'AI content generated! You can review and refine it before publishing.',
      });
      setTimeout(() => setFeedback(null), 4000);
    }, 600);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.content) {
      setFeedback({ type: 'error', text: 'Please complete all required fields.' });
      return;
    }

    try {
      setLoading(true);
      setFeedback(null);

      const url = isEditing ? `/api/blogs/${id}` : '/api/blogs';
      const method = isEditing ? 'PUT' : 'POST';

      // Auto-set author name from selected authorId
      const submitData = { ...formData };
      if (submitData.authorId) {
        const selectedAuthor = authors.find((a) => a._id === submitData.authorId);
        if (selectedAuthor) submitData.author = selectedAuthor.name;
      }

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(submitData),
      });

      const data = await res.json();

      if (data.success) {
        setFeedback({
          type: 'success',
          text: isEditing
            ? 'Blog updated successfully!'
            : 'Blog post published successfully!',
        });
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 1200);
      } else {
        setFeedback({ type: 'error', text: data.message || 'Operation failed.' });
      }
    } catch (err) {
      console.error('Save error:', err);
      setFeedback({ type: 'error', text: 'Network error saving blog post.' });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
        <p className="text-sm">Loading post details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/dashboard"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{showPreview ? 'Edit Mode' : 'Live Preview'}</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {isEditing
                ? 'Update your article contents and media.'
                : 'Write and publish an engaging article for your readers.'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleAiAssist}
            disabled={aiGenerating}
            className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-xl text-xs font-semibold transition active:scale-95 disabled:opacity-50"
            title="Generate structured outline and content based on Title"
          >
            {aiGenerating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 fill-cyan-500 text-cyan-500" />
            )}
            <span>AI Assist Writer</span>
          </button>
        </div>

        {feedback && (
          <div
            className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-medium mb-6 ${
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

        {showPreview ? (
          /* Preview Mode */
          <div className="space-y-6">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full uppercase">
                {formData.category}
              </span>
              <h2 className="text-2xl font-bold text-slate-900 mt-3">{formData.title || 'Untitled Post'}</h2>
              <p className="text-sm text-slate-500 mt-1">{formData.description || 'No excerpt provided.'}</p>
            </div>
            {formData.image && (
              <img
                src={formData.image}
                alt="Preview"
                className="w-full h-64 object-cover rounded-2xl"
              />
            )}
            <div className="prose max-w-none text-slate-700 whitespace-pre-line">
              {formData.content || 'No content written yet.'}
            </div>
          </div>
        ) : (
          /* Edit Form */
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Blog Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Learning new technology to boost your career in software"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
            </div>

            {/* Category & Image URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                >
                  <option value="Software Development">Software Development</option>
                  <option value="Artificial Intelligence & Machine Learning">Artificial Intelligence & Machine Learning</option>
                  <option value="Web and Mobile App Development">Web and Mobile App Development</option>
                  <option value="Technology & Innovation">Technology & Innovation</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Cloud Computing">Cloud Computing</option>
                  <option value="Industry Insights">Industry Insights</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Featured Image URL
                </label>
                <div className="relative">
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://... (optional)"
                    className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                  <ImageIcon className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Author Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Author
              </label>
              <select
                name="authorId"
                value={formData.authorId}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="">— No Author (Admin) —</option>
                {authors.map((a) => (
                  <option key={a._id} value={a._id}>
                    {a.name}{a.role ? ` — ${a.role}` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Short Excerpt */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Short Description / Excerpt *
              </label>
              <textarea
                name="description"
                rows={2}
                value={formData.description}
                onChange={handleChange}
                placeholder="A concise 1-2 sentence preview for the blog card..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-y"
                required
              />
            </div>

            {/* Main Content */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Article Content (Supports Markdown & Headings) *
              </label>
              <textarea
                name="content"
                rows={12}
                value={formData.content}
                onChange={handleChange}
                placeholder="Write your article here. You can use ## Subheadings, 1. Ordered lists, - Bullet points..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-normal text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-y font-mono"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <Link
                to="/admin/dashboard"
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-sm px-7 py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition active:scale-95 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{isEditing ? 'Save Changes' : 'Publish Article'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddBlog;
