import React, { useState, useEffect } from 'react';
import { ARTICLES, tagColors } from './blogData';
import { ArrowRight, Clock } from 'lucide-react';

interface Props { onOpenBlog: () => void }

const BlogPreviewSection: React.FC<Props> = ({ onOpenBlog }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const latestArticles = ARTICLES.slice(0, 3);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section id="blog-preview" style={{
      padding: isMobile ? '60px 20px' : '100px 48px',
      background: 'var(--color-ui-bg)',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', gap: '20px', flexDirection: isMobile ? 'column' : 'row', textAlign: isMobile ? 'center' : 'left' }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '6px 16px', borderRadius: '100px',
              background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.25)',
              marginBottom: '20px',
            }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#EC4899', letterSpacing: '0.04em' }}>CAREER INSIGHTS</span>
            </div>
            <h2 style={{ fontSize: isMobile ? '28px' : '40px', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--color-ui-text)', marginBottom: '14px' }}>
              Latest from the blog
            </h2>
            <p style={{ fontSize: '16px', color: 'var(--color-ui-text-muted)', maxWidth: '500px' }}>
              Expert advice on resume writing, interview preparation, and navigating the modern job market.
            </p>
          </div>
          <button
            onClick={onOpenBlog}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '12px 24px', borderRadius: '12px',
              background: 'var(--color-ui-surface)', border: '1px solid var(--color-ui-border)',
              color: 'var(--color-ui-text)', fontSize: '14px', fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-ui-surface-2)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-ui-surface)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Read All Articles
            <ArrowRight size={16} />
          </button>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', 
          gap: '24px' 
        }}>
          {latestArticles.map((article) => (
            <div
              key={article.id}
              onClick={onOpenBlog}
              style={{
                borderRadius: '20px', overflow: 'hidden',
                background: 'var(--color-ui-surface)', border: '1px solid var(--color-ui-border)',
                cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex', flexDirection: 'column',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
                e.currentTarget.style.borderColor = 'var(--color-ui-accent-subtle)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'var(--color-ui-border)';
              }}
            >
              {/* Image Placeholder with Tag */}
              <div style={{ 
                height: '180px', background: `linear-gradient(135deg, ${tagColors[article.tag]}20, ${tagColors[article.tag]}05)`,
                position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderBottom: '1px solid var(--color-ui-border)',
              }}>
                <div style={{
                  padding: '6px 14px', borderRadius: '100px',
                  background: 'var(--color-ui-bg)', border: `1px solid ${tagColors[article.tag]}40`,
                  fontSize: '11px', fontWeight: 700, color: tagColors[article.tag],
                  position: 'absolute', top: '16px', left: '16px',
                }}>
                  {article.tag}
                </div>
                <div style={{ fontSize: '48px', opacity: 0.5 }}>
                  {article.tag === 'ATS Tips' ? '🤖' : article.tag === 'Common Mistakes' ? '❌' : '🎯'}
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--color-ui-text-dim)' }}>
                    <Clock size={12} />
                    {article.readTime}
                  </div>
                  <div style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'var(--color-ui-text-dim)' }} />
                  <div style={{ fontSize: '12px', color: 'var(--color-ui-text-dim)' }}>{article.date}</div>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-ui-text)', marginBottom: '12px', lineHeight: 1.4 }}>
                  {article.title}
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--color-ui-text-muted)', lineHeight: 1.6, marginBottom: '24px', flex: 1 }}>
                  {article.excerpt}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 700, color: '#818CF8' }}>
                  Read More
                  <ArrowRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogPreviewSection;
