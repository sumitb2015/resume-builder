import React, { useState } from 'react';
import { ArrowLeft, Clock, Tag, ChevronRight, BookOpen } from 'lucide-react';
import NavBar from './NavBar';
import FooterSection from './FooterSection';
import { TosModal, PrivacyModal } from './TosModal';
import { AboutModal, CareersModal, ContactModal } from './CompanyModals';

interface Props {
  onBack: () => void;
  onStart: () => void;
}

const ARTICLES = [
  {
    id: 'ats-bullets',
    tag: 'ATS Tips',
    title: 'How to Write ATS-Friendly Resume Bullets',
    date: 'March 28, 2026',
    readTime: '5 min read',
    excerpt: 'Applicant Tracking Systems scan your resume before a human ever sees it. Learn the exact formula for writing bullet points that sail through ATS filters.',
    content: `
      <h2>The Reality of ATS Systems</h2>
      <p>Before a recruiter or hiring manager ever sees your carefully crafted resume, it must pass through an Applicant Tracking System (ATS). These automated gatekeepers scan for keywords, formatting, and relevance. If your resume isn't optimized, you might be rejected before a human even glances at your experience.</p>
      
      <h2>The Formula for the Perfect Bullet Point</h2>
      <p>The most effective resume bullet points follow a simple but powerful formula: <strong>Action Verb + Task + Quantifiable Result</strong>.</p>
      
      <h3>1. Start with Strong Action Verbs</h3>
      <p>Instead of "Responsible for managing a team", use "Spearheaded a team of 10 engineers". Instead of "Helped with marketing", use "Executed marketing campaigns". Action verbs show immediate impact and leadership.</p>
      
      <h3>2. Quantify Your Achievements</h3>
      <p>Numbers speak louder than words. "Increased sales by 25% over 6 months" is infinitely better than "Increased sales". If you don't have exact numbers, use reasonable estimates or focus on scale (e.g., "managed a $50k budget", "supported 500+ daily active users"). Quantifiable data gives recruiters a concrete understanding of your capabilities.</p>
      
      <h3>3. Natural Keyword Integration</h3>
      <p>Review the job description and extract the core skills they are asking for. If they ask for "agile project management", make sure that exact phrase is in your resume. Integrate these keywords naturally into your bullets. Do not just list them at the bottom of your resume; show <em>how</em> you used them in context.</p>
      
      <h2>What to Avoid</h2>
      <ul>
        <li><strong>Complex formatting:</strong> Tables, columns, and heavy graphics can confuse ATS parsers, causing them to read your data out of order or miss it entirely.</li>
        <li><strong>Vague descriptors:</strong> Words like "synergy", "hard-working", and "team player" waste valuable space and don't tell the ATS or the recruiter anything tangible about your skills.</li>
        <li><strong>Headers and Footers:</strong> Avoid putting critical contact information in document headers or footers, as some older ATS systems cannot parse them.</li>
      </ul>
      <p>By structuring your bullets logically and clearly, you ensure that both the ATS robot and the human recruiter immediately understand your value.</p>
    `
  },
  {
    id: 'resume-mistakes',
    tag: 'Common Mistakes',
    title: 'Top 5 Resume Mistakes That Cost You Interviews',
    date: 'March 15, 2026',
    readTime: '4 min read',
    excerpt: 'From using the wrong file format to burying your most impressive achievements on page two, we break down the five most common resume blunders and how to fix them.',
    content: `
      <h2>1. Sending a Word Document Instead of a PDF</h2>
      <p>Unless a job posting specifically asks for a .doc file (which is rare), always send your resume as a PDF. Word documents can lose their formatting depending on the recruiter's operating system or software version. A PDF locks your design perfectly in place, ensuring the recruiter sees exactly what you intended them to see.</p>
      
      <h2>2. The "One Size Fits All" Approach</h2>
      <p>Sending the exact same resume to 50 different companies is a recipe for rejection. Hiring managers want to see that you are the perfect fit for <em>their</em> specific role. Always tweak your summary and top bullets to align with the job description. It takes 5 extra minutes but increases your callback rate exponentially.</p>
      
      <h2>3. Including an Objective Instead of a Summary</h2>
      <p>Objectives ("Seeking a challenging role in marketing to utilize my skills") are outdated and self-serving. Replace it with a Professional Summary that highlights your top achievements ("Award-winning marketer with 8 years of experience driving 30% YoY growth"). Tell them what you can do for them, not what you want from them.</p>
      
      <h2>4. Overloading with Irrelevant Experience</h2>
      <p>If you're applying for a Senior Developer role, you don't need to include the barista job you had 10 years ago. Keep your experience strictly relevant to the role you are applying for. If you must show continuous employment, keep older, irrelevant roles to a single line without bullet points.</p>
      
      <h2>5. Ignoring Typos and Grammar</h2>
      <p>It sounds obvious, but a single typo can disqualify you when a recruiter is choosing between two identical candidates. It signals a lack of attention to detail. Always use tools like Grammarly, read your resume out loud, and ideally, have a friend read over your resume before submitting.</p>
    `
  },
  {
    id: 'job-tailoring',
    tag: 'Job Search Strategy',
    title: 'Tailoring Your Resume for Each Job Application',
    date: 'February 22, 2026',
    readTime: '6 min read',
    excerpt: "Sending the same resume to every job? That's leaving interviews on the table. Discover how to quickly customize your resume for each role without spending hours rewriting.",
    content: `
      <h2>Why Tailoring Matters</h2>
      <p>In a competitive job market, generic resumes get ignored. Tailoring your resume shows the employer that you understand their specific needs and have the exact background to solve their problems. It also drastically improves your chances of passing ATS filters.</p>
      
      <h2>Step 1: Deconstruct the Job Description</h2>
      <p>Print out the job description and highlight the core responsibilities and required skills. Notice the specific language they use. If they ask for "Client Relations" instead of "Customer Service", mirror their language in your resume. If they emphasize "cross-functional collaboration", make sure one of your bullets highlights a time you worked across teams.</p>
      
      <h2>Step 2: Rearrange Your Priorities</h2>
      <p>Recruiters spend an average of 7 seconds scanning a resume. The most relevant achievements should always be the first bullet under each job. If the job focuses heavily on Project Management but your current resume highlights your Coding skills first, reorder your bullet points so the project management achievements are at the top.</p>
      
      <h2>Step 3: Update Your Summary</h2>
      <p>Your Professional Summary should act as a tailored elevator pitch. If applying for a leadership role, emphasize your management experience here. If applying for a highly technical role, list your core stack immediately. This is the first thing they read; make sure it aligns perfectly with the job title.</p>
      
      <h2>Use AI to Speed Up the Process</h2>
      <p>Tailoring manually takes time. Use tools like BespokeCV's Job Tailor to automatically map your existing experience to a target job description. AI can analyze the JD, identify the missing keywords, and suggest rewrites for your bullets, ensuring maximum ATS compatibility without spending hours rewriting from scratch.</p>
    `
  },
  {
    id: 'perfect-summary',
    tag: 'Resume Writing',
    title: 'The Perfect Resume Summary: A Step-by-Step Guide',
    date: 'February 8, 2026',
    readTime: '5 min read',
    excerpt: "Your resume summary is prime real estate. We'll walk you through crafting a 3–4 line summary that packs your years of experience and top skills into a punchy opening.",
    content: `
      <h2>What is a Resume Summary?</h2>
      <p>A resume summary is a brief 3-5 sentence paragraph at the top of your resume that highlights your professional background, key skills, and greatest achievements. Think of it as a movie trailer for your career. It should hook the reader and make them want to read the rest of the document.</p>
      
      <h2>Step 1: State Your Title and Experience</h2>
      <p>Start strong. Tell them exactly who you are and your level of seniority. <br/><br/><em>Example: "Results-driven Digital Marketing Manager with over 7 years of experience in B2B SaaS..."</em></p>
      
      <h2>Step 2: Highlight Your Superpower</h2>
      <p>What makes you unique? What is your core competency? This is where you list your top 2-3 hard skills that directly apply to the job.<br/><br/><em>Example: "...specializing in organic growth, technical SEO, and building high-performing content teams..."</em></p>
      
      <h2>Step 3: Provide a Major Achievement</h2>
      <p>Anchor your claims with a quantifiable metric. Prove that you are good at what you do.<br/><br/><em>Example: "...with a proven track record of scaling inbound traffic from 10k to 100k monthly visitors within 12 months."</em></p>
      
      <h2>Putting It All Together</h2>
      <p><strong>Final Summary:</strong> "Results-driven Digital Marketing Manager with over 7 years of experience in B2B SaaS, specializing in organic growth, technical SEO, and building high-performing content teams. Proven track record of scaling inbound traffic from 10k to 100k monthly visitors within 12 months and increasing lead conversion by 35%."</p>
      
      <h2>Pro Tips</h2>
      <ul>
        <li>Keep it concise. Do not exceed 5 lines.</li>
        <li>Never use the word "I", "me", or "my". Resumes should be written in the first-person without the pronoun.</li>
        <li>Tailor the summary for the specific job you are applying for.</li>
      </ul>
    `
  },
  {
    id: 'interview-prep',
    tag: 'Interview Prep',
    title: 'How to Answer "Tell Me About Yourself" in an Interview',
    date: 'January 14, 2026',
    readTime: '7 min read',
    excerpt: 'It is the most common interview question, yet the one candidates struggle with the most. Learn the "Present-Past-Future" framework to nail this question every time.',
    content: `
      <h2>The Trap of "Tell Me About Yourself"</h2>
      <p>"Tell me about yourself" is rarely an invitation to recount your entire life story, your hobbies, or where you grew up. It is a strategic opening question designed to see how you pitch yourself professionally and if you understand what the role requires.</p>
      
      <h2>The "Present-Past-Future" Framework</h2>
      <p>The most effective way to answer this question is by structuring your response into three clear sections: Present, Past, and Future. Keep your total answer under 2 minutes.</p>
      
      <h3>1. Present: Where you are right now</h3>
      <p>Start with your current role, the scope of your responsibilities, and perhaps a recent major accomplishment. This grounds the interviewer in your current professional status.</p>
      <p><em>Example: "Currently, I'm an Account Executive at TechCorp, where I manage our top-tier enterprise clients and recently closed a $2M deal..."</em></p>
      
      <h3>2. Past: How you got there</h3>
      <p>Next, pivot to the past. Don't go back to high school. Go back to the most relevant stepping stone that led to your current expertise. Highlight a key skill you learned along the way.</p>
      <p><em>Example: "Before that, I spent three years at StartupInc building their sales development team from the ground up, which is really where I honed my outbound prospecting strategy and team leadership skills..."</em></p>
      
      <h3>3. Future: Why you are here today</h3>
      <p>Finally, connect your past and present to the specific company you are interviewing with. Why this role? Why now?</p>
      <p><em>Example: "While I love my current team, I'm looking to transition into a role that focuses specifically on international expansion, which is why I was so excited about this opportunity at your company given your recent launch in Europe."</em></p>
      
      <h2>Things to Keep in Mind</h2>
      <ul>
        <li><strong>Practice, don't memorize:</strong> You want to sound natural, not robotic. Know your bullet points but don't read a script.</li>
        <li><strong>Keep it professional:</strong> Unless asked, keep personal details (family, pets, hobbies) out of this specific answer.</li>
        <li><strong>Tailor the narrative:</strong> Highlight the parts of your past and present that are most relevant to the job description.</li>
      </ul>
    `
  }
];

const tagColors: Record<string, string> = {
  'ATS Tips': '#6366F1',
  'Common Mistakes': '#EC4899',
  'Job Search Strategy': '#10B981',
  'Resume Writing': '#F59E0B',
  'Interview Prep': '#8B5CF6',
};

const BlogPage: React.FC<Props> = ({ onStart }) => {
  const [activeArticle, setActiveArticle] = useState<typeof ARTICLES[0] | null>(null);

  // Modals state for footer
  const [tosOpen, setTosOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [careersOpen, setCareersOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  const renderArticleList = () => (
    <>
      <div style={{ textAlign: 'center', padding: '60px 24px 40px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'rgba(99,102,241,0.1)', borderRadius: '100px', color: '#818CF8', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
          <BookOpen size={14} /> BespokeCV Blog
        </div>
        <h1 style={{ fontSize: '42px', fontWeight: 800, color: 'var(--color-ui-text)', letterSpacing: '-0.03em', marginBottom: '16px', lineHeight: 1.1 }}>
          Resume Tips & <span style={{ color: '#818CF8' }}>Career Insights</span>
        </h1>
        <p style={{ fontSize: '18px', color: 'var(--color-ui-text-muted)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
          Practical advice from industry experts to help you craft a resume that gets results, beat the ATS, and land your dream job.
        </p>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px 80px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {ARTICLES.map((post) => (
          <button
            key={post.id}
            onClick={() => {
              setActiveArticle(post);
              window.scrollTo({ top: 0, behavior: 'smooth' });
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
    </>
  );

  const renderFullArticle = () => {
    if (!activeArticle) return null;
    return (
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '40px 24px 80px' }}>
        <button
          onClick={() => setActiveArticle(null)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'transparent', border: 'none', color: 'var(--color-ui-text-muted)',
            fontSize: '14px', fontWeight: 600, cursor: 'pointer', padding: '8px 0', marginBottom: '32px',
            transition: 'color 0.2s'
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-ui-text)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-ui-text-muted)')}
        >
          <ArrowLeft size={16} /> Back to Blog
        </button>

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
    <div style={{ minHeight: '100vh', background: 'var(--color-ui-bg)', display: 'flex', flexDirection: 'column' }}>
      <NavBar onStart={onStart} />
      
      <main style={{ flex: 1, paddingTop: '80px' }}>
        {activeArticle ? renderFullArticle() : renderArticleList()}
      </main>

      <FooterSection
        onOpenTos={() => setTosOpen(true)}
        onOpenPrivacy={() => setPrivacyOpen(true)}
        onOpenAbout={() => setAboutOpen(true)}
        onOpenBlog={() => setActiveArticle(null)} // If they click blog in footer, reset to list
        onOpenCareers={() => setCareersOpen(true)}
        onOpenContact={() => setContactOpen(true)}
      />

      {tosOpen && <TosModal onClose={() => setTosOpen(false)} />}
      {privacyOpen && <PrivacyModal onClose={() => setPrivacyOpen(false)} />}
      {aboutOpen && <AboutModal onClose={() => setAboutOpen(false)} />}
      {careersOpen && <CareersModal onClose={() => setCareersOpen(false)} />}
      {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}
    </div>
  );
};

export default BlogPage;
