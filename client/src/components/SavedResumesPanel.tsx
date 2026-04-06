import { useState } from 'react';
import { X, FolderOpen, Trash2, Edit3, Check, Clock, Plus, Lock } from 'lucide-react';
import type { SavedResume } from '../hooks/useSavedResumes';
import { usePlan, MAX_RESUMES } from '../contexts/PlanContext';

interface Props {
  savedResumes: SavedResume[];
  currentResumeId: string | null;
  maxResumes: number;
  onLoad: (saved: SavedResume) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onNewResume: () => void;
  onClose: () => void;
  onUpgradeNeeded: () => void;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: diffDays > 365 ? 'numeric' : undefined });
}

export default function SavedResumesPanel({
  savedResumes, currentResumeId, maxResumes,
  onLoad, onDelete, onRename, onNewResume, onClose, onUpgradeNeeded,
}: Props) {
  const { plan } = usePlan();
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const canAddMore = savedResumes.length < maxResumes;

  const startRename = (id: string, currentName: string) => {
    setRenamingId(id);
    setRenameValue(currentName);
  };

  const commitRename = (id: string) => {
    const trimmed = renameValue.trim();
    if (trimmed) onRename(id, trimmed);
    setRenamingId(null);
  };

  // Plan limit info for upgrade nudge
  const planLimits: Record<string, { next: string; nextMax: number }> = {
    basic: { next: 'Pro', nextMax: MAX_RESUMES.pro },
    pro: { next: 'Ultimate', nextMax: MAX_RESUMES.ultimate },
    ultimate: { next: '', nextMax: MAX_RESUMES.ultimate },
  };
  const limitInfo = plan ? planLimits[plan] : null;
  const atLimit = savedResumes.length >= maxResumes;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9000,
      display: 'flex',
    }}>
      {/* Backdrop */}
      <div style={{ flex: 1, background: 'rgba(0,0,0,0.5)' }} onClick={onClose} />

      {/* Drawer */}
      <div style={{
        width: '360px', height: '100%',
        background: 'var(--color-ui-surface)',
        borderLeft: '1px solid var(--color-ui-border)',
        display: 'flex', flexDirection: 'column',
        boxShadow: '-8px 0 32px rgba(0,0,0,0.4)',
      }}>
        {/* Header */}
        <div style={{
          padding: '0 20px', height: '56px', flexShrink: 0,
          borderBottom: '1px solid var(--color-ui-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-ui-text)' }}>My Resumes</div>
            <div style={{ fontSize: '11px', color: 'var(--color-ui-text-muted)' }}>
              {savedResumes.length} / {maxResumes} saved
            </div>
          </div>
          <button className="btn-ghost" style={{ padding: '6px' }} onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* New resume button */}
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-ui-border)', flexShrink: 0 }}>
          <button
            onClick={onNewResume}
            className="btn-secondary"
            style={{ width: '100%', justifyContent: 'center', gap: '8px', fontSize: '13px' }}
          >
            <Plus size={14} /> New Resume
          </button>
        </div>

        {/* Resumes list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {savedResumes.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center' }}>
              <FolderOpen size={32} style={{ color: 'var(--color-ui-text-muted)', margin: '0 auto 12px', display: 'block' }} />
              <p style={{ fontSize: '13px', color: 'var(--color-ui-text-muted)', lineHeight: 1.6 }}>
                No saved resumes yet.<br />Click Save to save your current resume.
              </p>
            </div>
          ) : (
            savedResumes.map(saved => {
              const isActive = saved.id === currentResumeId;
              return (
                <div
                  key={saved.id}
                  style={{
                    margin: '4px 8px',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: `1px solid ${isActive ? 'var(--color-ui-accent)' : 'var(--color-ui-border)'}`,
                    background: isActive ? 'rgba(99,102,241,0.08)' : 'transparent',
                    transition: 'all 0.15s',
                  }}
                >
                  {/* Name row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    {renamingId === saved.id ? (
                      <input
                        autoFocus
                        value={renameValue}
                        onChange={e => setRenameValue(e.target.value)}
                        onBlur={() => commitRename(saved.id)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') commitRename(saved.id);
                          if (e.key === 'Escape') setRenamingId(null);
                        }}
                        style={{
                          flex: 1, background: 'var(--color-ui-bg)', border: '1px solid var(--color-ui-accent)',
                          borderRadius: '6px', padding: '4px 8px', fontSize: '13px', color: 'var(--color-ui-text)',
                          outline: 'none',
                        }}
                      />
                    ) : (
                      <span style={{ flex: 1, fontSize: '13px', fontWeight: 600, color: 'var(--color-ui-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {saved.name}
                      </span>
                    )}

                    {isActive && (
                      <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-ui-accent)', background: 'rgba(99,102,241,0.15)', padding: '2px 6px', borderRadius: '4px', flexShrink: 0 }}>
                        Current
                      </span>
                    )}
                  </div>

                  {/* Meta */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                    <Clock size={10} color="var(--color-ui-text-muted)" />
                    <span style={{ fontSize: '11px', color: 'var(--color-ui-text-muted)' }}>
                      {formatDate(saved.savedAt)}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--color-ui-text-muted)' }}>·</span>
                    <span style={{ fontSize: '11px', color: 'var(--color-ui-text-muted)', textTransform: 'capitalize' }}>
                      {saved.templateId}
                    </span>
                  </div>

                  {/* Actions */}
                  {confirmDeleteId === saved.id ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '12px', color: '#F87171', flex: 1 }}>Delete this resume?</span>
                      <button
                        onClick={() => { onDelete(saved.id); setConfirmDeleteId(null); }}
                        style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(248,113,113,0.15)', border: '1px solid rgba(248,113,113,0.3)', color: '#F87171', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="btn-ghost"
                        style={{ padding: '4px 8px', fontSize: '12px' }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {!isActive && (
                        <button
                          onClick={() => onLoad(saved)}
                          className="btn-primary"
                          style={{ flex: 1, justifyContent: 'center', fontSize: '12px', padding: '6px 10px', gap: '5px' }}
                        >
                          <FolderOpen size={12} /> Open
                        </button>
                      )}
                      <button
                        onClick={() => startRename(saved.id, saved.name)}
                        className="btn-ghost"
                        style={{ padding: '6px 8px' }}
                        title="Rename"
                      >
                        <Edit3 size={13} />
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(saved.id)}
                        className="btn-ghost"
                        style={{ padding: '6px 8px', color: 'rgba(248,113,113,0.6)' }}
                        title="Delete"
                        onMouseEnter={e => (e.currentTarget.style.color = '#F87171')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(248,113,113,0.6)')}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Plan limit footer */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--color-ui-border)', flexShrink: 0 }}>
          {/* Progress bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', color: 'var(--color-ui-text-muted)' }}>
              Storage used
            </span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: atLimit ? '#F87171' : 'var(--color-ui-text-muted)' }}>
              {savedResumes.length} / {maxResumes}
            </span>
          </div>
          <div style={{ height: '4px', background: 'var(--color-ui-border)', borderRadius: '2px', marginBottom: '10px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: '2px',
              width: `${Math.min(100, (savedResumes.length / maxResumes) * 100)}%`,
              background: atLimit ? '#F87171' : 'var(--color-ui-accent)',
              transition: 'width 0.3s',
            }} />
          </div>

          {atLimit && limitInfo?.next && (
            <button
              onClick={onUpgradeNeeded}
              style={{
                width: '100%', padding: '9px', borderRadius: '8px',
                background: 'rgba(168,85,247,0.1)',
                border: '1px solid rgba(192,132,252,0.25)',
                color: '#C084FC', fontSize: '12.5px', fontWeight: 600,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              }}
            >
              <Lock size={12} />
              Upgrade to {limitInfo.next} for {limitInfo.nextMax} resumes
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
