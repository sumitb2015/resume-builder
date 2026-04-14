import React, { useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import { ArrowLeft, Clock, Tag, ChevronRight, BookOpen, Share2, Search, X } from 'lucide-react';
import NavBar from './NavBar';
import FooterSection from './FooterSection';
import { ARTICLES, tagColors, type Article } from './blogData';

interface Props {
  onBack: () => void;
  onStart: () => void;
  onShowProfile: () => void;
}

const BlogPage: React.FC<Props> = ({ onBack, onStart, onShowProfile }) => {
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) return ARTICLES;
    const query = searchQuery.toLowerCase().trim();
    return ARTICLES.filter(a => 
      a.title.toLowerCase().includes(query) || 
      a.excerpt.toLowerCase().includes(query) || 
      a.tag.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  React.useEffect(() => {
    // Handle deep linking via ?article=id
    const params = new URLSearchParams(window.location.search);
    const articleId = params.get('article');
    if (articleId) {
      const article = ARTICLES.find(a => a.id === articleId);
      if (article) setActiveArticle(article);
    }

    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderArticleList = () => (
    <>
      <div style={{ textAlign: 'center', padding: isMobile ? '30px 20px 20px' : '60px 24px 20px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'rgba(99,102,241,0.1)', borderRadius: '100px', color: '#818CF8', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
          <BookOpen size={14} /> BespokeCV Blog
        </div>
        <h1 style={{ fontSize: isMobile ? '32px' : '42px', fontWeight: 800, color: 'var(--color-ui-text)', letterSpacing: '-0.03em', marginBottom: '16px', lineHeight: 1.1 }}>
          Resume Tips & <span style={{ color: '#818CF8' }}>Career Insights</span>
        </h1>
        <p style={{ fontSize: isMobile ? '16px' : '18px', color: 'var(--color-ui-text-muted)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
          Practical advice from industry experts to help you craft a resume that gets results, beat the ATS, and land your dream job.
        </p>
      </div>

      {/* Search Bar */}
      <div style={{ maxWidth: '600px', margin: '0 auto 48px', padding: '0 24px' }}>
        <div style={{ position: 'relative' }}>
          <Search 
            size={18} 
            style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-ui-text-dim)' }} 
          />
          <input
            type="text"
            placeholder="Search articles, topics, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 48px',
              borderRadius: '14px',
              background: 'var(--color-ui-surface)',
              border: '1px solid var(--color-ui-border)',
              color: 'var(--color-ui-text)',
              fontSize: '15px',
              outline: 'none',
              transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#818CF8';
              e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--color-ui-border)';
              e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)';
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                background: 'var(--color-ui-surface-2)', border: 'none', borderRadius: '50%',
                width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'var(--color-ui-text-dim)'
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {filteredArticles.length > 0 ? (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px 80px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {filteredArticles.map((post) => (
            <button
              key={post.id}
              onClick={() => {
                setActiveArticle(post);
                const container = document.querySelector('.landing-page');
                if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{
                display: 'flex', flexDirection: 'column', textAlign: 'left',
                background: 'var(--color-ui-surface)', border: '1px solid var(--color-ui-border)',
                borderRadius: '16px', padding: '28px', cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = '#818CF850';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.05)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--color-ui-border)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
                  color: tagColors[post.tag] ?? '#818CF8',
                  background: `${tagColors[post.tag] ?? '#818CF8'}18`,
                  border: `1px solid ${tagColors[post.tag] ?? '#818CF8'}33`,
                  borderRadius: '6px', padding: '4px 10px',
                }}>
                  <Tag size={10} />
                  {post.tag}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--color-ui-text-muted)', fontWeight: 500 }}>
                  <Clock size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-2px' }} />
                  {post.readTime}
                </span>
              </div>

              <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-ui-text)', marginBottom: '12px', lineHeight: 1.3 }}>
                {post.title}
              </h3>
              <p style={{ fontSize: '15px', color: 'var(--color-ui-text-muted)', lineHeight: 1.6, marginBottom: '24px', flex: 1 }}>
                {post.excerpt}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--color-ui-border)' }}>
                <span style={{ fontSize: '13px', color: 'var(--color-ui-text-muted)', fontWeight: 500 }}>{post.date}</span>
                <span style={{ fontSize: '13px', color: '#818CF8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
                  Read Article <ChevronRight size={14} />
                </span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 24px 120px' }}>
          <div style={{ 
            width: '64px', height: '64px', borderRadius: '50%', background: 'var(--color-ui-surface-2)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--color-ui-text-dim)' 
          }}>
            <Search size={32} />
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-ui-text)', marginBottom: '8px' }}>No articles found</h3>
          <p style={{ fontSize: '15px', color: 'var(--color-ui-text-muted)', marginBottom: '24px' }}>
            We couldn't find any results for "{searchQuery}". Try a different keyword.
          </p>
          <button 
            onClick={() => setSearchQuery('')}
            style={{
              padding: '10px 20px', borderRadius: '10px', background: 'var(--color-ui-surface-2)',
              border: '1px solid var(--color-ui-border)', color: 'var(--color-ui-text)',
              fontSize: '14px', fontWeight: 600, cursor: 'pointer'
            }}
          >
            Clear Search
          </button>
        </div>
      )}
    </>
  );

  const renderFullArticle = () => {
      if (!activeArticle) return null;

      const shareArticle = () => {
        const url = `https://bespokecv.in/blog?article=${activeArticle.id}`;
        if (navigator.share) {
          navigator.share({
            title: activeArticle.title,
            text: activeArticle.excerpt,
            url: url,
          }).catch(() => {});
        } else {
          navigator.clipboard.writeText(url);
          toast.success('Link copied to clipboard!');
        }
      };

      return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '40px 24px 80px' }}>
          {/* Structured Data for BlogPosting */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "headline": activeArticle.title,
              "description": activeArticle.excerpt,
              "datePublished": new Date(activeArticle.date).toISOString(),
              "author": {
                "@type": "Organization",
                "name": "BespokeCV"
              },
              "publisher": {
                "@type": "Organization",
                "name": "BespokeCV",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://bespokecv.in/favicon.svg"
                }
              },
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `https://bespokecv.in/blog?article=${activeArticle.id}`
              }
            })}
          </script>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
            <button
              onClick={() => setActiveArticle(null)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: 'transparent', border: 'none', color: 'var(--color-ui-text-muted)',
                fontSize: '14px', fontWeight: 600, cursor: 'pointer', padding: '8px 0',
                transition: 'color 0.2s'
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-ui-text)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-ui-text-muted)')}
            >
              <ArrowLeft size={16} /> Back to Blog
            </button>

            <button
              onClick={shareArticle}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '8px 16px', borderRadius: '100px',
                background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)',
                color: '#818CF8', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(99, 102, 241, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.2)';
              }}
            >
              <Share2 size={14} /> Share Article
            </button>
          </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
            color: tagColors[activeArticle.tag] ?? '#818CF8',
            background: `${tagColors[activeArticle.tag] ?? '#818CF8'}18`,
            border: `1px solid ${tagColors[activeArticle.tag] ?? '#818CF8'}33`,
            borderRadius: '6px', padding: '4px 10px',
          }}>
            {activeArticle.tag}
          </span>
          <span style={{ fontSize: '14px', color: 'var(--color-ui-text-muted)', fontWeight: 500 }}>
            {activeArticle.date} • {activeArticle.readTime}
          </span>
        </div>

        <h1 style={{ fontSize: '36px', fontWeight: 800, color: 'var(--color-ui-text)', letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: '40px' }}>
          {activeArticle.title}
        </h1>

        <div 
          className="blog-content"
          style={{ fontSize: '17px', color: 'var(--color-ui-text-muted)', lineHeight: 1.8 }}
          dangerouslySetInnerHTML={{ __html: activeArticle.content }} 
        />
        
        <style dangerouslySetInnerHTML={{__html: `
          .blog-content h2 { font-size: 24px; font-weight: 800; color: var(--color-ui-text); margin: 40px 0 16px; letter-spacing: -0.02em; }
          .blog-content h3 { font-size: 20px; font-weight: 700; color: var(--color-ui-text); margin: 32px 0 12px; }
          .blog-content p { margin-bottom: 20px; }
          .blog-content ul { margin-bottom: 24px; padding-left: 24px; }
          .blog-content li { margin-bottom: 8px; }
          .blog-content strong { color: var(--color-ui-text); font-weight: 700; }
          .blog-content em { color: var(--color-ui-text); font-style: italic; }
          .blog-content img { width: 100%; height: auto; border-radius: 12px; margin: 32px 0; border: 1px solid var(--color-ui-border); }
          .blog-content blockquote { border-left: 4px solid #818CF8; padding-left: 20px; margin: 30px 0; font-style: italic; color: var(--color-ui-text); }
        `}} />
        
        <div style={{ marginTop: '60px', paddingTop: '40px', borderTop: '1px solid var(--color-ui-border)', textAlign: 'center' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-ui-text)', marginBottom: '12px' }}>Ready to apply these tips?</h3>
            <p style={{ fontSize: '15px', color: 'var(--color-ui-text-muted)', marginBottom: '24px' }}>Build an ATS-friendly, professional resume in minutes.</p>
            <button 
              className="btn-primary" 
              onClick={onStart}
              style={{ fontSize: '15px', padding: '12px 24px', margin: '0 auto' }}
            >
              Start Building Now
            </button>
        </div>
      </div>
    );
  };
return (
  <div className="landing-page" style={{ background: 'var(--color-ui-bg)', display: 'flex', flexDirection: 'column' }}>
    <NavBar 
      onStart={onStart} 
      isBlogPage={true} 
      onBackToHome={onBack} 
      onOpenBlog={() => setActiveArticle(null)}
      onShowProfile={onShowProfile}
      currentLabel={activeArticle?.title}
    />

    <main style={{ flex: 1, paddingTop: isMobile ? '20px' : '80px' }}>
      {activeArticle ? renderFullArticle() : renderArticleList()}
    </main>

      <FooterSection />
    </div>
  );
};

export default BlogPage;
