import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sparkles, Search, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import BlogCard from '../components/BlogCard';

const categories = [
  'All',
  'Software Development',
  'Artificial Intelligence & Machine Learning',
  'Web and Mobile App Development',
  'Technology & Innovation',
  'Cybersecurity',
  'Cloud Computing',
  'Industry Insights',
];

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();

  const BLOGS_PER_PAGE = 8;

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam && categories.includes(categoryParam)) {
      setActiveCategory(categoryParam);
      setPage(1);
      const blogsSection = document.getElementById('blogs-section');
      if (blogsSection) {
        blogsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [searchParams]);

  // Fetch blogs from backend API
  const fetchBlogs = async (category = 'All', search = '', pageNum = 1) => {
    try {
      setLoading(true);
      setError(null);

      let url = '/api/blogs';
      const params = new URLSearchParams();

      if (category && category !== 'All') {
        params.append('category', category);
      }
      if (search && search.trim() !== '') {
        params.append('search', search.trim());
      }
      params.append('page', pageNum);
      params.append('limit', BLOGS_PER_PAGE);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      if (data.success) {
        setBlogs(data.blogs);
        setTotalPages(data.totalPages || 1);
        setTotalBlogs(data.total || data.blogs.length);
        setHasPrevPage(data.hasPrevPage || false);
        setHasNextPage(data.hasNextPage || false);
      } else {
        setError(data.message || 'Failed to load blogs.');
      }
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError('Could not connect to the backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(activeCategory, searchTerm, page);
  }, [activeCategory, searchTerm, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchTerm(searchQuery);
    setPage(1);
  };

  const handleCategorySelect = (cat) => {
    setActiveCategory(cat);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
      setPage(newPage);
      const blogsSection = document.getElementById('blogs-section');
      if (blogsSection) {
        blogsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-14 pb-14 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Soft Modern Glow in Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-gradient-to-tr from-blue-100/50 via-cyan-50/40 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-200/80 bg-blue-50/70 text-blue-700 text-xs font-semibold mb-6 shadow-sm">
            <span>New: AI feature integrated</span>
            <Sparkles className="w-3.5 h-3.5 fill-cyan-500 text-cyan-500" />
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15] mb-5">
            Your own{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              blogging
            </span>{' '}
            platform.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-500 max-w-2xl leading-relaxed mb-8">
            This is your space to think out loud, to share what matters, and to write without filters.
            Whether it's one word or a thousand, your story starts right here.
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="w-full max-w-xl flex items-center bg-white rounded-2xl border border-slate-200/90 shadow-md p-1.5 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all mb-8"
          >
            <div className="pl-3.5 text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for blogs"
              className="w-full px-3 py-2 text-sm sm:text-base text-slate-800 placeholder-slate-400 bg-transparent outline-none"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-6 py-2.5 rounded-xl transition shadow-sm active:scale-95"
            >
              Search
            </button>
          </form>

          {/* Categories Pill Filter */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-105'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Blog Cards Grid */}
      <section id="blogs-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
            <p className="text-sm font-medium">Loading articles...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-rose-50 rounded-3xl border border-rose-100 max-w-lg mx-auto p-6">
            <p className="text-rose-700 font-medium mb-3">{error}</p>
            <button
              onClick={() => fetchBlogs(activeCategory, searchTerm, page)}
              className="px-4 py-2 bg-rose-600 text-white rounded-xl text-sm font-semibold hover:bg-rose-700 transition"
            >
              Try Again
            </button>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-3xl border border-slate-100 max-w-md mx-auto p-8">
            <p className="text-slate-700 font-bold text-lg mb-1">No articles found</p>
            <p className="text-slate-400 text-sm mb-4">
              Try adjusting your category filter or search query.
            </p>
            <button
              onClick={() => {
                setActiveCategory('All');
                setSearchQuery('');
                setSearchTerm('');
                setPage(1);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {blogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-14 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Results count */}
                <p className="text-xs sm:text-sm font-medium text-slate-500">
                  Showing <span className="font-semibold text-slate-800">{(page - 1) * BLOGS_PER_PAGE + 1}</span>–
                  <span className="font-semibold text-slate-800">{Math.min(page * BLOGS_PER_PAGE, totalBlogs)}</span> of{' '}
                  <span className="font-semibold text-slate-800">{totalBlogs}</span> articles
                </p>

                {/* Page Buttons */}
                <div className="flex items-center gap-2">
                  {/* Previous Page Button */}
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={!hasPrevPage || page <= 1}
                    aria-label="Previous Page"
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition border ${
                      !hasPrevPage || page <= 1
                        ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 shadow-sm active:scale-95'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  {/* Page Number Pills */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => {
                      const isCurrent = num === page;
                      return (
                        <button
                          key={num}
                          onClick={() => handlePageChange(num)}
                          className={`w-9 h-9 rounded-xl text-sm font-bold transition flex items-center justify-center ${
                            isCurrent
                              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-105'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-blue-600'
                          }`}
                        >
                          {num}
                        </button>
                      );
                    })}
                  </div>

                  {/* Next Page Button */}
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={!hasNextPage || page >= totalPages}
                    aria-label="Next Page"
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition border ${
                      !hasNextPage || page >= totalPages
                        ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 shadow-sm active:scale-95'
                    }`}
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Home;
