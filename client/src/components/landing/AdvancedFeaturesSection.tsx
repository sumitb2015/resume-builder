import React, { useState, useEffect } from 'react';
import { Layers, Palette, Moon, Sun, Monitor, FileText, CheckCircle, UserCheck } from 'lucide-react';

const ADVANCED_FEATURES = [
  {
    icon: <Layers size={24} />,
    title: 'Multi-Resume Cloud Sync',
    desc: 'Create, duplicate, and manage unlimited tailored versions of your resume for different job applications. All synced to your account.',
    color: '#6366F1',
  },
  {
    icon: <Palette size={24} />,
    title: 'Advanced Style Editor',
    desc: 'Fine-tune your resume with 10+ professional color palettes, custom typography, and adjustable margins for the perfect fit.',
    color: '#EC4899',
  },
  {
    icon: <Monitor size={24} />,
    title: 'Native Dark Mode',
    desc: 'Designed for the modern professional. Switch between Light and Dark mode for a comfortable, high-contrast editing experience.',
    color: '#8B5CF6',
  },
  {
    icon: <FileText size={24} />,
    title: 'Live Paged Preview',
    desc: 'See exactly how your resume will look on paper. Real-time multi-page pagination ensures your content never gets cut off.',
    color: '#10B981',
  },
  {
    icon: <UserCheck size={24} />,
    title: 'Expert Human Review',
    desc: 'Get your resume reviewed by a human expert for personalized, strategic feedback on wording, positioning, and impact. Included with Ultimate.',
    color: '#14B8A6',
  },
];

const AdvancedFeaturesSection: React.FC = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section id="advanced-features" style={{
      padding: isMobile ? '60px 20px' : '100px 48px',
      background: 'var(--color-ui-surface-2)',
      borderTop: '1px solid var(--color-ui-border)',
      borderBottom: '1px solid var(--color-ui-border)',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '64px', alignItems: 'center' }}>
          
          {/* Left Side: Content */}
          <div style={{ flex: 1 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '6px 16px', borderRadius: '100px',
              background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
              marginBottom: '20px',
            }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#818CF8', letterSpacing: '0.04em' }}>BEYOND THE BASICS</span>
            </div>
            <h2 style={{ fontSize: isMobile ? '28px' : '40px', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--color-ui-text)', marginBottom: '24px', lineHeight: 1.2 }}>
              Everything you need to <span style={{ color: '#818CF8' }}>stand out</span>
            </h2>
            <p style={{ fontSize: '16px', color: 'var(--color-ui-text-muted)', marginBottom: '40px', lineHeight: 1.6 }}>
              BespokeCV goes further than simple templates. We provide a professional suite of tools to manage your entire job application strategy in one place.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {ADVANCED_FEATURES.map((f, i) => (
                <div 
                  key={i}
                  onMouseEnter={() => setActiveTab(i)}
                  style={{
                    padding: '20px', borderRadius: '16px',
                    background: activeTab === i ? 'var(--color-ui-surface)' : 'transparent',
                    border: activeTab === i ? '1px solid var(--color-ui-border)' : '1px solid transparent',
                    cursor: 'pointer', transition: 'all 0.2s ease',
                    display: 'flex', gap: '16px', alignItems: 'flex-start',
                  }}
                >
                  <div style={{ 
                    color: activeTab === i ? f.color : 'var(--color-ui-text-dim)',
                    transition: 'color 0.2s',
                  }}>
                    {f.icon}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-ui-text)', marginBottom: '6px' }}>{f.title}</h3>
                    <p style={{ fontSize: '14px', color: 'var(--color-ui-text-muted)', lineHeight: 1.5 }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Visual Preview */}
          {!isMobile && (
            <div style={{ flex: 1, position: 'relative' }}>
              <div style={{
                width: '100%', aspectRatio: '1/1',
                background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(236,72,153,0.05))',
                borderRadius: '32px', border: '1px solid var(--color-ui-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', position: 'relative',
              }}>
                {/* Animated Background Mesh */}
                <div style={{
                  position: 'absolute', top: '20%', left: '20%', width: '60%', height: '60%',
                  background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)',
                  filter: 'blur(40px)', animation: 'pulse 8s infinite alternate',
                }} />

                {/* Mock UI Element based on activeTab */}
                <div style={{ 
                  width: '85%', height: '70%', background: '#0D1117', borderRadius: '16px',
                  border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
                  padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px',
                  transform: 'perspective(1000px) rotateY(-5deg) rotateX(5deg)',
                  zIndex: 2,
                }}>
                  {/* Mock Sidebar */}
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FF5F56' }} />
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FFBD2E' }} />
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27C93F' }} />
                    <div style={{ flex: 1 }} />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Sun size={12} color="rgba(255,255,255,0.4)" />
                      <div style={{ width: '24px', height: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', position: 'relative' }}>
                        <div style={{ position: 'absolute', right: '2px', top: '2px', width: '8px', height: '8px', background: '#818CF8', borderRadius: '50%' }} />
                      </div>
                      <Moon size={12} color="#818CF8" />
                    </div>
                  </div>

                  {activeTab === 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)', fontWeight: 600, letterSpacing: '0.05em' }}>MY SAVED RESUMES</div>
                      {[
                        { name: 'Senior UI Designer - Google', date: '2 days ago', active: true },
                        { name: 'Product Lead - Stripe', date: '1 week ago', active: false },
                        { name: 'Senior Designer - General', date: 'Mar 15, 2026', active: false },
                      ].map((item, i) => (
                        <div key={i} style={{ 
                          padding: '12px', borderRadius: '8px', 
                          background: item.active ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
                          border: item.active ? '1px solid rgba(99,102,241,0.3)' : '1px solid rgba(255,255,255,0.08)',
                          display: 'flex', alignItems: 'center', gap: '12px'
                        }}>
                          <FileText size={16} color={item.active ? '#818CF8' : 'rgba(255,255,255,0.3)'} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '12px', color: item.active ? 'white' : 'rgba(255,255,255,0.92)', fontWeight: 600 }}>{item.name}</div>
                            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.55)' }}>{item.date}</div>
                          </div>
                          {item.active && <CheckCircle size={14} color="#4ADE80" />}
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 1 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)', fontWeight: 600, letterSpacing: '0.05em' }}>STYLE CUSTOMIZATION</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.80)' }}>Primary Color</div>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            {['#6366F1', '#EC4899', '#10B981', '#F59E0B'].map(c => (
                              <div key={c} style={{ width: '20px', height: '20px', borderRadius: '50%', background: c, border: c === '#EC4899' ? '2px solid white' : 'none' }} />
                            ))}
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.80)' }}>Typography</div>
                          <div style={{ padding: '6px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', fontSize: '11px', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}>Inter (Sans-serif)</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.80)' }}>Page Margins</div>
                          <div style={{ fontSize: '10px', color: 'white' }}>15mm</div>
                        </div>
                        <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', position: 'relative' }}>
                          <div style={{ position: 'absolute', left: '0', width: '60%', height: '100%', background: '#EC4899', borderRadius: '2px' }} />
                          <div style={{ position: 'absolute', left: '60%', top: '50%', transform: 'translate(-50%, -50%)', width: '12px', height: '12px', background: 'white', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 2 && (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                      <div style={{ position: 'relative', width: '160px', height: '80px', background: 'rgba(255,255,255,0.03)', borderRadius: '40px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', padding: '0 8px' }}>
                        <div style={{ 
                          position: 'absolute', right: '8px', width: '64px', height: '64px', borderRadius: '50%', 
                          background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', 
                          boxShadow: '0 8px 20px rgba(99,102,241,0.4)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          <Moon size={32} color="white" />
                        </div>
                        <Sun size={24} color="rgba(255,255,255,0.2)" style={{ marginLeft: '24px' }} />
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '16px', fontWeight: 700, color: 'white', marginBottom: '4px' }}>Theme Sync</div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.60)' }}>Matches your system preferences automatically</div>
                      </div>
                    </div>
                  )}

                  {activeTab === 4 && (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '14px', padding: '4px 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '10px', background: 'rgba(20,184,166,0.08)', border: '1px solid rgba(20,184,166,0.2)' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(20,184,166,0.15)', border: '1px solid rgba(20,184,166,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>👨‍💼</div>
                        <div>
                          <div style={{ fontSize: '11px', color: 'white', fontWeight: 700, marginBottom: '2px' }}>Expert Feedback</div>
                          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.65)', fontStyle: 'italic' }}>"Your header is strong, but let's reword the Cloud Architect section to emphasise cost savings..."</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {['Wording & tone review', 'Career positioning advice', 'Section-by-section notes'].map(item => (
                          <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10.5px', color: 'rgba(255,255,255,0.85)' }}>
                            <CheckCircle size={12} color="#14B8A6" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 3 && (
                    <div style={{ display: 'flex', gap: '16px', height: '100%' }}>
                      <div style={{ flex: 1, background: 'white', borderRadius: '4px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ height: '6px', width: '40%', background: '#EEE', borderRadius: '2px' }} />
                        <div style={{ height: '4px', width: '100%', background: '#F5F5F5', borderRadius: '1px' }} />
                        <div style={{ height: '4px', width: '90%', background: '#F5F5F5', borderRadius: '1px' }} />
                        <div style={{ height: '20px', width: '100%', background: '#F8F9FF', borderRadius: '2px', marginTop: '4px' }} />
                        <div style={{ flex: 1 }} />
                        <div style={{ textAlign: 'center', fontSize: '8px', color: '#AAA', fontWeight: 700 }}>PAGE 1</div>
                      </div>
                      <div style={{ flex: 1, background: 'white', borderRadius: '4px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', opacity: 0.6 }}>
                        <div style={{ height: '6px', width: '30%', background: '#EEE', borderRadius: '2px' }} />
                        <div style={{ height: '4px', width: '100%', background: '#F5F5F5', borderRadius: '1px' }} />
                        <div style={{ height: '4px', width: '85%', background: '#F5F5F5', borderRadius: '1px' }} />
                        <div style={{ flex: 1 }} />
                        <div style={{ textAlign: 'center', fontSize: '8px', color: '#AAA', fontWeight: 700 }}>PAGE 2</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.2; }
          100% { transform: scale(1.1); opacity: 0.3; }
        }
      `}} />
    </section>
  );
};

export default AdvancedFeaturesSection;
