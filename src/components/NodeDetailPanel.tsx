'use client';

import { useState } from 'react';
import type { CampaignNode } from '@/lib/types';

const PLATFORMS = [
  'YouTube',
  'Instagram',
  'TikTok',
  'Spotify + Apple Podcasts',
  'Broadcast + YouTube',
  'Live Event',
  'Twitter/X',
  'Press',
  'Long-form',
];

interface Props {
  node: CampaignNode;
  onClose: () => void;
  onDelete: (id: string) => void;
  onEdit: (updated: CampaignNode) => void;
}

const fieldLabel: React.CSSProperties = {
  fontFamily: "'Simpson', sans-serif",
  textTransform: 'uppercase',
  letterSpacing: '0.18em',
  fontSize: '8px',
  color: '#6B6B6B',
  marginBottom: '5px',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#0E0E0E',
  border: '1px solid #333',
  borderRadius: 0,
  color: '#F2EFE8',
  fontFamily: "'ABC Camera', sans-serif",
  fontSize: '12px',
  padding: '7px 9px',
  boxSizing: 'border-box',
  outline: 'none',
};

const actionBtn = (accent = false): React.CSSProperties => ({
  flex: 1,
  background: accent ? '#BF4723' : 'transparent',
  border: accent ? 'none' : '1px solid #444',
  borderRadius: 0,
  color: accent ? '#F2EFE8' : '#6B6B6B',
  fontFamily: "'Simpson', sans-serif",
  textTransform: 'uppercase',
  letterSpacing: '0.18em',
  fontSize: '8px',
  padding: '9px',
  cursor: 'pointer',
  transition: 'border-color 0.2s, color 0.2s, background 0.2s',
});

export default function NodeDetailPanel({ node, onClose, onDelete, onEdit }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<CampaignNode>(node);

  const isSatellite = node.type === 'satellite';

  function startEdit() {
    setDraft(node);
    setEditing(true);
  }

  function save() {
    onEdit(draft);
    setEditing(false);
  }

  function cancel() {
    setDraft(node);
    setEditing(false);
  }

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '24px',
        right: '24px',
        width: '288px',
        animation: 'slideUp 0.28s ease-out both',
        zIndex: 20,
      }}
    >
      <div style={{ background: '#161616', border: '1px solid #333' }}>

        {/* Header */}
        <div style={{ borderBottom: '1px solid #333', padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="label" style={{ color: '#BF4723', letterSpacing: '0.18em', fontSize: '9px' }}>
            {editing ? draft.platform : node.platform}
          </span>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', fontSize: '16px', lineHeight: 1, padding: '0 2px' }}
          >
            ×
          </button>
        </div>

        {/* Title */}
        <div style={{ padding: '14px 14px 10px' }}>
          <h3 className="font-display" style={{ margin: 0, fontSize: '16px', color: '#F2EFE8', lineHeight: 1.2 }}>
            {node.title}
          </h3>
        </div>

        {editing ? (
          /* ── Edit mode ─────────────────────────────────────────── */
          <div style={{ padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

            <div>
              <div style={fieldLabel}>Platform</div>
              <select
                value={draft.platform}
                onChange={e => setDraft(d => ({ ...d, platform: e.target.value }))}
                style={{ ...inputStyle, appearance: 'none' }}
              >
                {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div>
              <div style={fieldLabel}>Format</div>
              <input
                value={draft.format}
                onChange={e => setDraft(d => ({ ...d, format: e.target.value }))}
                style={inputStyle}
              />
            </div>

            <div>
              <div style={fieldLabel}>Duration</div>
              <input
                value={draft.duration}
                onChange={e => setDraft(d => ({ ...d, duration: e.target.value }))}
                style={inputStyle}
              />
            </div>

            <div>
              <div style={fieldLabel}>Description</div>
              <textarea
                value={draft.description}
                onChange={e => setDraft(d => ({ ...d, description: e.target.value }))}
                rows={4}
                style={{ ...inputStyle, resize: 'none', lineHeight: 1.5 }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={actionBtn(true)} onClick={save}>Save</button>
              <button
                style={actionBtn(false)}
                onClick={cancel}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#BF4723'; (e.currentTarget as HTMLButtonElement).style.color = '#BF4723'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#444'; (e.currentTarget as HTMLButtonElement).style.color = '#6B6B6B'; }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          /* ── View mode ─────────────────────────────────────────── */
          <>
            {/* Meta grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1px', background: '#333', borderTop: '1px solid #333', borderBottom: '1px solid #333' }}>
              {[
                { label: 'Format', value: node.format },
                { label: 'Duration', value: node.duration },
                { label: node.type === 'hero' ? 'Type' : 'Orbit', value: node.type === 'hero' ? 'Hero Asset' : `Ring ${node.ring}` },
              ].map(({ label, value }) => (
                <div key={label} style={{ background: '#161616', padding: '10px 12px' }}>
                  <div className="label" style={{ fontSize: '8px', marginBottom: '4px' }}>{label}</div>
                  <div className="font-display" style={{ fontSize: '11px', color: '#F2EFE8', lineHeight: 1.3 }}>{value}</div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="no-scrollbar" style={{ padding: '12px 14px 10px', maxHeight: '160px', overflowY: 'auto' }}>
              <p className="font-body" style={{ margin: 0, fontSize: '12px', color: '#9A958C', lineHeight: 1.55 }}>
                {node.description}
              </p>
            </div>

            {/* Satellite actions */}
            {isSatellite && (
              <div style={{ padding: '0 14px 14px', display: 'flex', gap: '8px' }}>
                <button
                  style={actionBtn(false)}
                  onClick={startEdit}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#BF4723'; (e.currentTarget as HTMLButtonElement).style.color = '#BF4723'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#444'; (e.currentTarget as HTMLButtonElement).style.color = '#6B6B6B'; }}
                >
                  Edit Node
                </button>
                <button
                  style={actionBtn(false)}
                  onClick={() => { onDelete(node.id); onClose(); }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#BF4723'; (e.currentTarget as HTMLButtonElement).style.color = '#BF4723'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#444'; (e.currentTarget as HTMLButtonElement).style.color = '#6B6B6B'; }}
                >
                  Remove Node
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
