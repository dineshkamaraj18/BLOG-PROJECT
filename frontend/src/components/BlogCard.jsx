import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Calendar, Heart } from 'lucide-react';

const categoryColorMap = {
  'Software Development': 'bg-blue-50 text-blue-700 border-blue-200/80',
  'Artificial Intelligence & Machine Learning': 'bg-purple-50 text-purple-700 border-purple-200/80',
  'Web and Mobile App Development': 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
  'Technology & Innovation': 'bg-cyan-50 text-cyan-700 border-cyan-200/80',
  'Cybersecurity': 'bg-rose-50 text-rose-700 border-rose-200/80',
  'Cloud Computing': 'bg-sky-50 text-sky-700 border-sky-200/80',
  'Industry Insights': 'bg-amber-50 text-amber-700 border-amber-200/80',
};

const BlogCard = ({ blog }) => {
  const badgeClass =
    categoryColorMap[blog.category] || 'bg-slate-100 text-slate-700 border-slate-200';

  const formattedDate = new Date(blog.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Read like state from localStorage (same key used in Blog.jsx)
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    if (!blog._id) return;
    const storedLikes = JSON.parse(localStorage.getItem('blog_likes') || '{}');
    setLiked(!!storedLikes[blog._id]?.liked);
    setLikeCount(storedLikes[blog._id]?.count || 0);
  }, [blog._id]);

  const handleLike = (e) => {
    e.preventDefault(); // prevent navigating to blog page
    e.stopPropagation();
    const storedLikes = JSON.parse(localStorage.getItem('blog_likes') || '{}');
    const current = storedLikes[blog._id] || { liked: false, count: 0 };
    const newLiked = !current.liked;
    const newCount = newLiked ? current.count + 1 : Math.max(0, current.count - 1);
    storedLikes[blog._id] = { liked: newLiked, count: newCount };
    localStorage.setItem('blog_likes', JSON.stringify(storedLikes));
    setLiked(newLiked);
    setLikeCount(newCount);
  };

  return (
    <Link
      to={`/blog/${blog._id}`}
      className="group flex flex-col bg-white rounded-3xl p-4 border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-200 hover:-translate-y-1 transition-all duration-300"
    >
      {/* Blog Featured Thumbnail */}
      {blog.image && (
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-100 mb-4">
          <img
            src={blog.image}
            alt={blog.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      )}

      {/* Category Pill */}
      <div className="mb-3">
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide border ${badgeClass}`}
        >
          {blog.category}
        </span>
      </div>

      {/* Blog Title */}
      <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug mb-2">
        {blog.title}
      </h3>

      {/* Short Excerpt */}
      <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-grow leading-relaxed">
        {blog.description}
      </p>

      {/* Footer Meta */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          {formattedDate}
        </span>
        <div className="flex items-center gap-3">
          {/* Like Button */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 transition-all duration-200 active:scale-95 ${
              liked ? 'text-rose-500' : 'text-slate-400 hover:text-rose-400'
            }`}
            title={liked ? 'Unlike' : 'Like'}
          >
            <Heart
              className={`w-3.5 h-3.5 transition-all duration-200 ${liked ? 'fill-rose-500' : ''}`}
            />
            <span className="font-semibold">{likeCount > 0 ? likeCount : ''}</span>
          </button>
          {/* Comments */}
          <span className="flex items-center gap-1.5 font-semibold text-slate-500">
            <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
            {blog.comments ? blog.comments.length : 0}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
